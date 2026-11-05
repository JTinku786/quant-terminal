// Candles from the Titania Postgres database (titania_trading), read through the
// read-only SQL bridge (Algo_ICT_Trader backend/rest_api.py POST /api/sql/query, via zrok).
//
// Why: the public sources (Yahoo, Nasdaq) rate limit shared cloud IPs. Symbols the
// Titania loaders already store (Dow 30, NIFTY 50 + indices, major FX daily) are served
// from the database, so most charts never touch a public API.
//
// Env: QT_PG_PROXY_URL (e.g. https://algoicttraderapi.share.zrok.io) and QT_PG_PROXY_TOKEN.

import { parseTf, resample, nativeBase } from "../public/lib/series.js";

const PROXY_URL = process.env.QT_PG_PROXY_URL || "";
const PROXY_TOKEN = process.env.QT_PG_PROXY_TOKEN || "";
const TIMEOUT_MS = 20000;

export const dbEnabled = () => Boolean(PROXY_URL && PROXY_TOKEN);

// Native tables, smallest first. Timeframes in between are resampled from the nearest base.
const TABLES = {
  "1m": "candles_1m",
  "5m": "candles_5m",
  "30m": "candles_30m",
  "1h": "candles_1h",
  "1D": "candles_1d",
};

async function sql(text, values = []) {
  // Base64 envelope: zrok's public frontend blocks some raw SQL patterns in request bodies.
  const b64 = Buffer.from(JSON.stringify({ text, values }), "utf8").toString("base64");
  const res = await fetch(new URL("/api/sql/query", PROXY_URL), {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": PROXY_TOKEN },
    body: JSON.stringify({ b64 }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body) throw new Error(`Titania DB ${res.status}: ${body?.error || "unavailable"}`);
  return body.rows || [];
}

// Symbols the database has, refreshed hourly per server instance.
let symbolCache = { at: 0, promise: null };
function symbolSet() {
  const now = Date.now();
  if (!symbolCache.promise || now - symbolCache.at > 3600e3) {
    const promise = sql("SELECT DISTINCT yahoo_symbol FROM candles_1d")
      .then((rows) => new Set(rows.map((r) => r.yahoo_symbol)))
      .catch((e) => {
        symbolCache = { at: 0, promise: null };
        throw e;
      });
    symbolCache = { at: now, promise };
  }
  return symbolCache.promise;
}

// The database's name for a resolved terminal symbol, or null when it isn't stored.
async function dbSymbol(sym) {
  const t = String(sym.ticker || "");
  const candidates =
    sym.exchange === "US"
      ? [t]
      : sym.exchange === "FX"
        ? [`^${t}`, `${t}=X`]
        : sym.exchange === "YAHOO"
          ? [t, t.replace(/^\^/, "%5E"), t.replace(/=X$/, "").replace(/^(?!\^)/, "^")]
          : [];
  if (!candidates.length) return null;
  const set = await symbolSet();
  return candidates.find((c) => set.has(c)) || null;
}

export async function dbCandles(sym, tf, limit) {
  if (!dbEnabled()) return [];
  const ysym = await dbSymbol(sym);
  if (!ysym) return [];
  const base = nativeBase(tf, Object.keys(TABLES));
  if (!base) return [];
  const tfSec = parseTf(tf).seconds;
  const baseSec = parseTf(base).seconds;
  const factor = Math.max(1, Math.ceil(tfSec / baseSec));
  const rows = Math.min(limit * factor + factor, 60000);
  const daily = baseSec >= 86400;
  // Daily bars are stamped at the exchange's local date (as UTC midnight), like the Yahoo parser.
  const timeExpr = daily
    ? "extract(epoch from ((candle_ts at time zone coalesce(exchange_timezone, 'America/New_York'))::date)::timestamp)::float8"
    : "extract(epoch from candle_ts)::float8";
  const data = await sql(
    `SELECT ${timeExpr} AS time, open_price AS open, high_price AS high, low_price AS low,
            close_price AS close, coalesce(volume, 0)::float8 AS volume
       FROM (SELECT * FROM ${TABLES[base]} WHERE yahoo_symbol = $1 ORDER BY candle_ts DESC LIMIT $2) s
      ORDER BY candle_ts ASC`,
    [ysym, rows],
  );
  let bars = toBars(data);
  if (!bars.length) return [];
  // The daily table can lag the intraday loaders: rebuild the missing recent days from 5m bars.
  if (daily && isStale(bars, true)) bars = bars.concat(await dailyFrom5m(ysym, bars.at(-1).time));
  // Still stale (e.g. forex has no 5m table): let the public chain answer instead.
  if (isStale(bars, daily)) return [];
  return base === tf ? bars.slice(-limit) : resample(bars, tf).slice(-limit);
}

function toBars(rows) {
  return rows
    .map((r) => ({
      time: Number(r.time),
      open: Number(r.open),
      high: Number(r.high),
      low: Number(r.low),
      close: Number(r.close),
      volume: Number(r.volume) || 0,
    }))
    .filter((b) => Number.isFinite(b.time) && Number.isFinite(b.open) && Number.isFinite(b.close));
}

// Older than 4 days covers weekends and one-day holidays without flagging good data.
function isStale(bars, daily) {
  const last = bars.at(-1)?.time;
  if (!last) return true;
  const ageDays = (Date.now() / 1000 - last) / 86400;
  return ageDays > (daily ? 4.5 : 4);
}

async function dailyFrom5m(ysym, lastDailyTime) {
  const after = new Date((lastDailyTime + 86400) * 1000).toISOString().slice(0, 10);
  const rows = await sql(
    `SELECT extract(epoch from d::timestamp)::float8 AS time,
            (array_agg(open_price ORDER BY candle_ts))[1] AS open,
            max(high_price) AS high, min(low_price) AS low,
            (array_agg(close_price ORDER BY candle_ts DESC))[1] AS close,
            coalesce(sum(volume), 0)::float8 AS volume
       FROM (SELECT *, (candle_ts at time zone coalesce(exchange_timezone, 'America/New_York'))::date AS d
               FROM candles_5m WHERE yahoo_symbol = $1 AND candle_ts >= ($2::date - 1)) s
      WHERE d >= $2::date
      GROUP BY d ORDER BY d`,
    [ysym, after],
  );
  return toBars(rows);
}

// ---------------------------------------------------------------------------
// Backtest windows: candles around a historical date, for replaying Titania backtest trades.
// Symbol form "TBT:<TICKER>_<YYYYMMDD>" (e.g. TBT:AAPL_20240510, TBT:^EURUSD_20230301).
// Intraday comes from historical_candles_5m (Barchart/forex history, 2017+) merged with candles_5m.
// ---------------------------------------------------------------------------
const INDEX_ALIASES = { NIFTY50: "^NSEI", BANKNIFTY: "^NSEBANK" };

function symbolCandidates(ticker) {
  const t = INDEX_ALIASES[ticker] || ticker;
  const out = new Set([t]);
  if (t.startsWith("^")) {
    out.add("%5E" + t.slice(1));
    if (/^\^[A-Z]{6}$/.test(t)) out.add(`${t.slice(1)}=X`);
  }
  return [...out];
}

// Window size (days before / after the trade date) per timeframe.
function windowFor(tfSec) {
  if (tfSec <= 300) return [10, 6];
  if (tfSec <= 1800) return [30, 12];
  if (tfSec < 86400) return [75, 20];
  return [600, 90];
}

export async function windowCandles(ticker, yyyymmdd, tf, limit) {
  if (!dbEnabled()) throw new Error("Titania database is not configured");
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(yyyymmdd || "");
  if (!m) throw Object.assign(new Error("Backtest window needs a date, like TBT:AAPL_20240510"), { status: 400 });
  const center = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const tfSec = parseTf(tf).seconds;
  const [before, after] = windowFor(tfSec);
  const from = new Date(center - before * 86400e3).toISOString();
  const to = new Date(center + after * 86400e3).toISOString();
  const syms = symbolCandidates(ticker);
  const daily = tfSec >= 86400;
  const rows = daily
    ? await sql(
        `SELECT extract(epoch from ((candle_ts at time zone coalesce(exchange_timezone, 'America/New_York'))::date)::timestamp)::float8 AS time,
                open_price AS open, high_price AS high, low_price AS low, close_price AS close, coalesce(volume, 0)::float8 AS volume, pri
           FROM (SELECT exchange_timezone, candle_ts, open_price, high_price, low_price, close_price, volume, 1 pri
                   FROM historical_candles_1d WHERE yahoo_symbol = ANY($1) AND candle_ts BETWEEN $2 AND $3
                 UNION ALL
                 SELECT exchange_timezone, candle_ts, open_price, high_price, low_price, close_price, volume, 2 pri
                   FROM candles_1d WHERE yahoo_symbol = ANY($1) AND candle_ts BETWEEN $2 AND $3) u
          ORDER BY candle_ts, pri`,
        [syms, from, to])
    : await sql(
        `SELECT extract(epoch from candle_ts)::float8 AS time, open_price AS open, high_price AS high, low_price AS low,
                close_price AS close, coalesce(volume, 0)::float8 AS volume, pri
           FROM (SELECT candle_ts, open_price, high_price, low_price, close_price, volume, 1 pri
                   FROM historical_candles_5m WHERE yahoo_symbol = ANY($1) AND candle_ts BETWEEN $2 AND $3
                 UNION ALL
                 SELECT candle_ts, open_price, high_price, low_price, close_price, volume, 2 pri
                   FROM candles_5m WHERE yahoo_symbol = ANY($1) AND candle_ts BETWEEN $2 AND $3) u
          ORDER BY candle_ts, pri`,
        [syms, from, to]);
  // Keep one bar per timestamp (historical source first).
  const seen = new Set();
  const bars = toBars(rows.filter((r) => { const k = String(r.time); if (seen.has(k)) return false; seen.add(k); return true; }));
  if (!bars.length) return [];
  const base = daily ? "1D" : "5m";
  return (tf === base ? bars : resample(bars, tf)).slice(-limit);
}
