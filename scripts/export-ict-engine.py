"""Read-only 20-symbol validation candles. No broker imports or source writes."""
import hashlib,json,sys
from datetime import datetime,timedelta
from pathlib import Path
from zoneinfo import ZoneInfo
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,r'C:\Users\saite\Desktop\ICT_Automation\realtime_execution')
from mss_reversal_data import connect
from reversal_candle_source import load_candles, SOURCE_VERSION
NY=ZoneInfo('America/New_York')
end=datetime(2026,10,24,tzinfo=NY); start=end-timedelta(days=30); warm=start-timedelta(days=35)
folder=ROOT/'data/ict-engine/candles';folder.mkdir(parents=True,exist_ok=True)
universe=[('forex','^'+x) for x in ['NZDUSD','EURUSD','GBPUSD','USDJPY','AUDUSD','USDCAD','USDCHF','EURJPY','GBPJPY','AUDJPY','EURGBP','CHFJPY']]
universe += [('us',x) for x in ['SPY','QQQ','AAPL','MSFT','JPM','XOM','IBM','GS']]
manifest=dict(start=int(start.timestamp()),end=int(end.timestamp()),warmupStart=int(warm.timestamp()),sourceVersion=SOURCE_VERSION,symbols=[],failures=[])
with connect() as conn:
    conn.set_session(readonly=True,isolation_level='REPEATABLE READ')
    for market,ticker in universe:
        if len(manifest['symbols'])>=20:break
        try:
            raw,audit=load_candles(conn,market,ticker,warm,end)
            bars=[dict(time=b['t']//1000,open=b['o'],high=b['h'],low=b['l'],close=b['c'],volume=b['v']) for b in raw]
            recent=[b for b in bars if b['time']>=manifest['start']]
            if len(recent)<500:raise ValueError(f'Only {len(recent)} recent bars')
            name=ticker.lstrip('^');payload=json.dumps(dict(symbol=name,market=market,candles=bars,audit=audit),default=str,separators=(',',':'))
            (folder/(name+'.json')).write_text(payload,encoding='utf-8')
            manifest['symbols'].append(dict(symbol=name,market=market,bars=len(bars),recentBars=len(recent),first=recent[0]['time'],last=recent[-1]['time'],sha256=hashlib.sha256(payload.encode()).hexdigest(),sources=audit.get('sources')))
            print(f'{name}: {len(recent)} bars in window; {len(bars)} with warmup',flush=True)
        except Exception as e:
            manifest['failures'].append(dict(symbol=ticker,reason=str(e)));print(f'{ticker}: {e}',flush=True)
(folder.parent/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
if len(manifest['symbols'])<20:raise SystemExit('Fewer than 20 usable symbols; see manifest failures')
