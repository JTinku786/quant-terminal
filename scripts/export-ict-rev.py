"""Read-only snapshot of stored k1 signals. Never imports or runs a broker module."""
import argparse, ast, csv, hashlib, io, json, sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
ZONE = ZoneInfo('America/New_York')
STRATEGY = 'REV-k1_reclaim3-OTE62-2R-MARKET'

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source', default=r'C:\Users\saite\Desktop\ICT_Automation')
    p.add_argument('--start', default='2026-10-01')
    p.add_argument('--end', default=datetime.now(ZONE).date().isoformat(), help='Exclusive NY date')
    p.add_argument('--url', default='http://127.0.0.1:3777')
    a = p.parse_args()
    source = Path(a.source) / 'realtime_execution'
    sys.path.insert(0, str(source))
    from mss_reversal_data import connect
    from reversal_candle_source import load_candles, SOURCE_VERSION
    from reversal_exit_policy import expected_grid
    from psycopg2.extras import RealDictCursor
    # Copy only pure session definitions from the authoritative routing file.
    # No imports, connection setup, broker calls or module-level execution enter this namespace.
    policy = source / 'reversal_k1_oanda_live.py'
    allowed = {'_m', 'SESSIONS', 'EXCLUDED_SESSIONS', 'sessions_at', 'entry_clock'}
    tree = ast.parse(policy.read_text(encoding='utf-8'))
    nodes = [n for n in tree.body if
             (isinstance(n, ast.FunctionDef) and n.name in allowed) or
             (isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id in allowed for t in n.targets))]
    ns = {'ZONE': ZONE}
    exec(compile(ast.Module(body=nodes, type_ignores=[]), str(policy), 'exec'), ns)
    start = datetime.fromisoformat(a.start).replace(tzinfo=ZONE)
    end = min(datetime.fromisoformat(a.end).replace(tzinfo=ZONE), datetime.now(timezone.utc))
    if end <= start:
        raise ValueError('End must be after start')
    out = ROOT / 'public' / 'ict'
    out.mkdir(parents=True, exist_ok=True)
    manifest = dict(strategy=STRATEGY, mode='Stored-signal replay / candle market-fill estimate',
                    exportedAt=datetime.now(timezone.utc).isoformat(), start=start.isoformat(), end=end.isoformat(),
                    sourceVersion=SOURCE_VERSION, sourcePolicySHA256=hashlib.sha256(policy.read_bytes()).hexdigest(),
                    detectorSHA256=hashlib.sha256((source.parent/'trend_reversal_2026/reversal_engine.py').read_bytes()).hexdigest(),
                    limitations=['Stored signals only; this does not discover new setups or retune the detector.',
                                 'Each pair is tested independently; account-wide caps, funding and broker latency are not simulated.',
                                 'Sizing is a risk-normalized research estimate; live unit caps, home-currency conversion and leverage caps are not reproduced.',
                                 'Candle prices are a fill estimate. Spread and slippage are sensitivity settings, not observed quotes.',
                                 'Historical discovery age cannot be reconstructed from observed_at alone.',
                                 'Source strategy is forex 1H only; US and India are not this route.'], symbols=[])
    with connect() as conn:
        conn.set_session(readonly=True, isolation_level='REPEATABLE READ')
        with conn.cursor(cursor_factory=RealDictCursor) as q:
            q.execute('''SELECT order_id::text, setup_key, ticker, direction, timeframe, entry_datetime,
                       observed_at, entry_price, stoploss, tp1, duplicate_of::text, duplicate_of_timeframe,
                       strategy_json FROM realtime_production_reversal_k1_setups
                       WHERE market='forex' AND timeframe='1h' AND observed_at >= %s AND observed_at < %s
                       ORDER BY observed_at, order_id''', (start, end))
            rows = q.fetchall()
            q.execute("SELECT DISTINCT ticker FROM realtime_production_reversal_k1_setups WHERE market='forex' AND timeframe='1h' ORDER BY ticker")
            tickers = [r['ticker'] for r in q.fetchall()]
        for ticker in tickers:
            symbol = ticker.lstrip('^')
            bars, audit = load_candles(conn, 'forex', ticker, start, end)
            expected = [int(t)//1000 for t in expected_grid('forex', start, end)]
            events = []
            for r in [x for x in rows if x['ticker'] == ticker]:
                proof = r['strategy_json']
                clock = ns['entry_clock'](r['entry_datetime'], '1h')
                sessions = ns['sessions_at'](clock)
                reasons = []
                if r['duplicate_of'] and r['duplicate_of_timeframe'] == '1h': reasons.append('DUPLICATE_1H_SETUP')
                if proof.get('entry_validation', {}).get('verdict') != 'VALID_PAPER_FILL': reasons.append('ENTRY_NOT_VALIDATED')
                if proof.get('trade', {}).get('risk_ok') is not True: reasons.append('RISK_GUARD_NOT_PASSED')
                if not sessions: reasons.append('NO_ICT_SESSION')
                if set(sessions) & ns['EXCLUDED_SESSIONS']: reasons.append('EXCLUDED_SESSION')
                events.append(dict(id=r['order_id'], setupKey=r['setup_key'] or r['order_id'],
                    time=int(r['observed_at'].timestamp()), nativeEntryTime=int(r['entry_datetime'].timestamp()),
                    side=1 if r['direction']=='BUY' else -1, ote=float(r['entry_price']),
                    stop=float(r['stoploss']), target=float(r['tp1']), reasons=reasons, sessions=sessions,
                    engineSHA256=proof.get('engineSHA256'), signal=proof.get('signal', {})))
            candles = [dict(time=b['t']//1000, open=b['o'], high=b['h'], low=b['l'], close=b['c'],
                            volume=b['v'], epsilon=b.get('price_epsilon', 0)) for b in bars]
            if len(candles) < 10:
                raise ValueError(f'{symbol}: fewer than 10 original candles')
            if len(candles) > 20000:
                raise ValueError('Choose a shorter date window: chart import is limited to 20,000 bars')
            dataset = dict(symbol=symbol, strategy=STRATEGY, candles=candles, events=events,
                           expected=expected, audit=audit, start=int(start.timestamp()), end=int(end.timestamp()))
            encoded = json.dumps(dataset, default=str, allow_nan=False, separators=(',', ':'))
            dataset['snapshotSHA256'] = hashlib.sha256(encoded.encode()).hexdigest()
            (out/f'{symbol}.json').write_text(json.dumps(dataset, default=str, allow_nan=False), encoding='utf-8')
            buf = io.StringIO()
            writer = csv.writer(buf)
            writer.writerow(['time','open','high','low','close','volume'])
            for b in candles: writer.writerow([b[k] for k in ('time','open','high','low','close','volume')])
            req = Request(a.url+'/api/import/bars?name=REV_'+symbol, data=buf.getvalue().encode(),
                          headers={'x-qt':'1','Content-Type':'text/csv'}, method='POST')
            with urlopen(req, timeout=30) as response: imported=json.load(response)
            # This indicator has no network access and is scoped to its exact original candle prices.
            factory = (ROOT/'public/lib/ict-rev.js').read_text(encoding='utf-8').split('export function makeRevIndicator', 1)[1]
            custom = 'function makeRevIndicator' + factory + '\nexport default makeRevIndicator(' + json.dumps(dict(symbol=symbol, candles=candles, events=events)) + ');\n'
            (ROOT/'custom'/f'ict-rev-{symbol.lower()}.js').write_text(custom, encoding='utf-8')
            manifest['symbols'].append(dict(symbol=symbol, chartSymbol=imported['symbol'], bars=len(bars),
                signals=len(events), eligible=sum(not e['reasons'] for e in events),
                missingBars=len(set(expected)-{b['time'] for b in candles}), snapshotSHA256=dataset['snapshotSHA256']))
            print(f'{symbol}: {len(bars)} candles, {len(events)} stored signals', flush=True)
    (out/'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print('Read-only snapshot complete. No strategy, broker or database writes were run.')

if __name__ == '__main__': main()
