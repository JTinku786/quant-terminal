// Titania Backtest panel: pick any Titania strategy + symbol, list its backtest trades (from the
// Titania database via the ICT Algo Trader Backtest API), and replay each trade bar by bar on the
// candles the backtest used, with the ICT indicator stack on top.
import { api, esc, fmtPrice } from './api.js';

// The indicator stack from the reference TradingView layout, using Titania's own implementations.
export const ICT_BACKTEST_STACK = [
  { id: 'custom:flux-order-blocks', params: {} },        // Order Blocks Volume Delta 3D
  { id: 'custom:market-structure-sd', params: {} },      // Major BoS, Supply/Demand & Inflection
  { id: 'zigzag', params: { deviation: 0.5, depth: 10 } },
  { id: 'custom:lux-buyside-sellside', params: {} },     // Buyside & Sellside Liquidity
  { id: 'custom:ict-sessions', params: {} },             // ICT sessions / killzones
  { id: 'custom:quarterly-divider', params: {} },
  { id: 'custom:ict-mss', params: {} },                  // Market Structure Shift
  { id: 'custom:ict-ifvg', params: {} },                 // FVG + Inversion FVG
  { id: 'custom:ict-rejection-blocks', params: {} },     // ICT Rejection Blocks
];

const TF_SEC = { '5m': 300, '15m': 900, '30m': 1800, '1h': 3600, '4h': 14400, '1D': 86400 };
const etFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: '2-digit', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
const et = (iso) => (iso ? etFmt.format(new Date(iso)) : '—');
const ymd = (iso) => new Date(iso).toISOString().slice(0, 10).replace(/-/g, '');
const tbtSymbol = (symbol, iso) => `TBT:${String(symbol).toUpperCase()}_${ymd(iso)}`;

export async function renderTitaniaBt(el, app) {
  const st = (app.state.titaniaBt ||= { strategy: 'S16', symbol: 'AAPL', target: '1', year: 'ALL', tf: '5m', stack: true });
  el.innerHTML = '<div style="padding:16px">Loading Titania strategies…</div>';
  let meta;
  try { meta = await api.get('/api/titania/strategies'); }
  catch (e) { el.innerHTML = `<div style="padding:16px">Titania backtests unavailable: ${esc(e.message)}</div>`; return; }
  if (!el.isConnected) return;
  const strategies = [...meta.strategies].sort((a, b) => (b.n ?? 0) - (a.n ?? 0));
  const years = ['ALL', ...Array.from({ length: new Date().getUTCFullYear() - 2016 }, (_, i) => String(2017 + i)).reverse()];
  el.innerHTML = `<section style="padding:12px 14px;min-width:760px">
    <div style="display:flex;gap:10px;align-items:end;flex-wrap:wrap">
      <label>Strategy <select class="in" id="tbStrategy">${strategies.map((s) => `<option value="${esc(s.strategy_id)}" ${s.strategy_id === st.strategy ? 'selected' : ''}>${esc(s.strategy_id)}${s.strategy_name ? ' · ' + esc(s.strategy_name) : ''} (${s.n})</option>`).join('')}</select></label>
      <label>Symbol <select class="in" id="tbSymbol">${meta.symbols.map((s) => `<option ${s === st.symbol ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></label>
      <label>Target <select class="in" id="tbTarget">${['1', '2', '3'].map((t) => `<option ${t === st.target ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <label>Year <select class="in" id="tbYear">${years.map((y) => `<option ${y === st.year ? 'selected' : ''}>${y}</option>`).join('')}</select></label>
      <label>Chart <select class="in" id="tbTf">${Object.keys(TF_SEC).map((t) => `<option ${t === st.tf ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="tbStack" ${st.stack ? 'checked' : ''}> ICT backtest indicators</label>
      <button class="btn" id="tbLoad">Load trades</button>
    </div>
    <p style="font-size:12px;opacity:.75;margin:6px 0">Trades come from the Titania database (same rows as the Backtest tab). <b>Replay from entry</b> hides everything after the entry candle — step forward to watch it play out. Candles are the ones the backtest used.</p>
    <div id="tbResult" aria-live="polite"></div>
  </section>`;
  const $ = (id) => el.querySelector('#' + id);
  let trades = [];

  const save = () => {
    Object.assign(st, { strategy: $('tbStrategy').value, symbol: $('tbSymbol').value, target: $('tbTarget').value, year: $('tbYear').value, tf: $('tbTf').value, stack: $('tbStack').checked });
    app.persist();
  };

  async function load() {
    save();
    $('tbResult').textContent = 'Loading trades…';
    try {
      const j = await api.get(`/api/titania/trades?strategy=${encodeURIComponent(st.strategy)}&symbol=${encodeURIComponent(st.symbol)}&target=${st.target}&year=${st.year}`);
      trades = j.trades || [];
      const closed = trades.filter((t) => Number.isFinite(t.r));
      const wins = closed.filter((t) => t.r > 0).length;
      const net = closed.reduce((a, t) => a + t.r, 0);
      $('tbResult').innerHTML = trades.length ? `
        <div style="display:flex;gap:22px;flex-wrap:wrap;padding:6px 0 10px">
          <span>Trades <b>${trades.length}</b></span><span>Win rate <b>${closed.length ? Math.round((wins / closed.length) * 100) : '—'}%</b></span>
          <span>Net <b style="color:${net >= 0 ? '#26a69a' : '#ef5350'}">${net >= 0 ? '+' : ''}${net.toFixed(2)}R</b></span>
          <span>Avg <b>${closed.length ? (net / closed.length).toFixed(2) : '—'}R</b></span>
        </div>
        <div style="max-height:250px;overflow:auto"><table style="width:100%;text-align:left;font-size:12px">
          <thead><tr><th>#</th><th>Entry (ET)</th><th>Side</th><th>Entry</th><th>Stop</th><th>Target</th><th>Exit (ET)</th><th>Result</th><th>R</th><th></th></tr></thead>
          <tbody>${trades.map((t, i) => `<tr>
            <td>${i + 1}</td><td>${et(t.filledAt)}</td><td style="color:${t.side === 'SELL' ? '#ef5350' : '#26a69a'}">${esc(t.side)}</td>
            <td>${fmtPrice(t.entry)}</td><td>${fmtPrice(t.stop)}</td><td>${fmtPrice(t.target)}</td><td>${et(t.closedAt)}</td>
            <td>${esc(t.outcome || t.exitType || '—')}</td><td style="color:${(t.r ?? 0) >= 0 ? '#26a69a' : '#ef5350'}">${Number.isFinite(t.r) ? t.r.toFixed(2) : '—'}</td>
            <td style="white-space:nowrap"><button class="btn small" data-replay="${i}">▶ Replay from entry</button> <button class="btn small" data-show="${i}">Entry + exit</button></td>
          </tr>`).join('')}</tbody></table></div>` : '<p>No trades for this selection.</p>';
    } catch (e) { $('tbResult').textContent = 'Could not load trades: ' + e.message; }
  }

  function toSetup(t, symbolId, tf) {
    const s = TF_SEC[tf] || 300;
    const fill = Date.parse(t.filledAt) / 1000;
    const close = t.closedAt ? Date.parse(t.closedAt) / 1000 : null;
    return {
      id: t.id, symbol: symbolId, tf, entryTime: Math.floor(fill / s) * s, entry: t.entry,
      side: t.side === 'SELL' ? -1 : 1, stop: t.stop, target: t.target, rr: t.plannedRR,
      exit: close ? { time: close, barTime: Math.floor(close / s) * s, price: t.exit, reason: t.exitType || t.outcome || 'exit', r: t.r } : null,
    };
  }

  async function show(i, atEntry) {
    const t = trades[i];
    const pane = app.active;
    if (!t || !pane) return app.toast('Select a chart first', 'err');
    save();
    try {
      const symbolId = tbtSymbol(t.symbol, t.filledAt);
      if (pane.replay) pane.stopReplay?.();
      pane.cfg.symbol = symbolId; pane.cfg.tf = st.tf; pane.cfg.type = 'candles'; pane.cfg.compare = [];
      // Every loaded trade that falls in this same candle window is drawn, so neighbours are visible too.
      pane.cfg.ictTradeSetups = trades.filter((x) => tbtSymbol(x.symbol, x.filledAt) === symbolId).map((x) => toSetup(x, symbolId, st.tf));
      if (st.stack) {
        const keep = pane.cfg.indicators.filter((x) => !x.uid?.startsWith('ictbt-') && !x.id.startsWith('custom:lux-') && !x.id.startsWith('custom:liquidity-pullback') && !x.id.startsWith('custom:next-candle') && !x.id.startsWith('custom:sniper'));
        pane.cfg.indicators = [...keep.filter((x) => !ICT_BACKTEST_STACK.some((s) => s.id === x.id)), ...ICT_BACKTEST_STACK.map((s, k) => ({ uid: `ictbt-${k}`, id: s.id, params: { ...s.params } }))];
      }
      app.settings.bars = 20000;
      await pane.load();
      // The server may normalise the symbol id; keep the setups matched to the loaded symbol.
      for (const x of pane.cfg.ictTradeSetups) x.symbol = pane.cfg.symbol;
      pane.render(false);
      const setup = pane.cfg.ictTradeSetups.find((x) => x.id === t.id);
      let index = pane.bars.findIndex((b) => b.time >= setup.entryTime);
      if (index < 0) throw new Error('The entry candle is not in the stored data');
      if (atEntry && index >= 1) pane.startReplay(index, { entryPreview: true });
      const endIndex = setup.exit ? pane.bars.findIndex((b) => b.time >= setup.exit.barTime) : index + 20;
      pane.chart.timeScale().setVisibleLogicalRange({ from: Math.max(0, index - 60), to: atEntry ? index + 30 : Math.max(index + 30, (endIndex < 0 ? index : endIndex) + 20) });
      app.syncToolbar(); app.persist();
      app.toast(atEntry
        ? `${t.strategy} ${t.side} ${t.symbol} · replay at the entry candle. Green = target, red = stop. Step forward ▶| to see what happened.`
        : `${t.strategy} ${t.side} ${t.symbol} · entry, stop, target and exit (${Number.isFinite(t.r) ? t.r.toFixed(2) + 'R' : t.outcome}).`);
    } catch (e) { app.toast(e.message, 'err'); }
  }

  $('tbLoad').onclick = load;
  for (const id of ['tbStrategy', 'tbSymbol', 'tbTarget', 'tbYear']) $(id).onchange = load;
  $('tbTf').onchange = save; $('tbStack').onchange = save;
  $('tbResult').onclick = (e) => {
    const r = e.target.closest('[data-replay]')?.dataset.replay, s = e.target.closest('[data-show]')?.dataset.show;
    if (r != null) show(Number(r), true);
    else if (s != null) show(Number(s), false);
  };
  await load();
}
