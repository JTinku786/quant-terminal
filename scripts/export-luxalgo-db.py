"""Read-only completed database candles for the LuxAlgo layout."""
import sys,json,csv,io,hashlib
from pathlib import Path
from datetime import datetime,timedelta
from zoneinfo import ZoneInfo
from urllib.request import Request,urlopen
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,r'C:\Users\saite\Desktop\ICT_Automation\realtime_execution')
from mss_reversal_data import connect
NY=ZoneInfo('America/New_York');end=datetime(2026,10,29,tzinfo=NY);start=end-timedelta(days=90)
with connect() as c:
 c.set_session(readonly=True,isolation_level='REPEATABLE READ')
 with c.cursor() as q:
  q.execute("SELECT candle_ts,open_price,high_price,low_price,close_price,volume,source FROM candles_5m WHERE market='india' AND base_symbol='RELIANCE' AND candle_ts >= %s AND candle_ts+interval '5 minutes' <= %s ORDER BY candle_ts,source",(start,end));rows=q.fetchall()
groups={}
for ts,op,hi,lo,cl,vol,source in rows:
 if any(x is None for x in (op,hi,lo,cl)):continue
 groups.setdefault(int(ts.timestamp()),[]).append(dict(time=int(ts.timestamp()),open=float(op),high=float(hi),low=float(lo),close=float(cl),volume=float(vol or 0),source=source))
bars=[];excluded=[]
for ts,items in sorted(groups.items()):
 if any(any(abs(a[k]-items[0][k])>1e-4 for k in ('open','high','low','close')) for a in items):excluded.append(ts);continue
 bars.append(items[0])
if len(bars)<200:raise ValueError('Insufficient completed RELIANCE database candles')
bars=bars[-20000:];folder=ROOT/'data/luxalgo-suite';folder.mkdir(parents=True,exist_ok=True)
buf=io.StringIO();w=csv.writer(buf);w.writerow(['time','open','high','low','close','volume'])
for b in bars:w.writerow([b[k] for k in ('time','open','high','low','close','volume')])
raw=buf.getvalue().encode();req=Request('http://127.0.0.1:3777/api/import/bars?name=DB_RELIANCE_5M',data=raw,method='POST',headers={'x-qt':'1','Content-Type':'text/csv'})
with urlopen(req,timeout=60) as response:imported=json.load(response)
report=dict(symbol=imported['symbol'],market='india',ticker='RELIANCE',timeframe='5m',bars=bars,excludedConflictingOHLC=excluded,sources=sorted(set(b['source'] or '' for b in bars)),csvSHA256=hashlib.sha256(raw).hexdigest(),asof=end.isoformat(),policy='Completed source database OHLC; conflicting duplicate OHLC excluded; no external feed replacement')
(folder/'database-truth.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='bars'},indent=2))
