"""Prepare original NZDUSD candles and native ICT display studies; read-only source DB."""
import argparse, csv, hashlib, io, json, sys
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parents[1]

def request(url, data=None, method=None, content='application/json'):
    req=Request(url,data=data,method=method,headers={'x-qt':'1','Content-Type':content})
    with urlopen(req,timeout=90) as r:return json.load(r)

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source',default=r'C:\Users\saite\Desktop\ICT_Automation')
    p.add_argument('--symbol',default='NZDUSD')
    p.add_argument('--url',default='http://127.0.0.1:3777')
    a=p.parse_args();sys.path.insert(0,str(Path(a.source)/'realtime_execution'))
    from mss_reversal_data import connect
    from reversal_candle_source import load_candles, rollup_candles, SOURCE_VERSION
    manifest=json.loads((ROOT/'public/ict/manifest.json').read_text())
    end=datetime.fromisoformat(manifest['end']);start=end-timedelta(days=550)
    print('Loading original completed candles in a read-only transaction...',flush=True)
    with connect() as c:
        c.set_session(readonly=True,isolation_level='REPEATABLE READ')
        raw,audit=load_candles(c,'forex','^'+a.symbol,start,end)
    if not raw:raise ValueError('No original forex candles')
    daily=rollup_candles(raw,'forex','1d',merge_forex_sunday=True)
    daily_refs=[dict(knownAt=b['knownAt']//1000,high=b['h'],low=b['l']) for b in daily]
    weeks=defaultdict(list)
    for b in daily:
        day=datetime.fromisoformat(b['day']).date()
        weeks[(day-timedelta(days=day.weekday())).isoformat()].append(b)
    weekly=[]
    for bs in weeks.values():
        # Do not publish a weekly level from a week with a missing complete daily constituent.
        if {datetime.fromisoformat(b['day']).weekday() for b in bs}!={0,1,2,3,4}:continue
        weekly.append(dict(knownAt=max(b['knownAt'] for b in bs)//1000,high=max(b['h'] for b in bs),low=min(b['l'] for b in bs)))
    refs=dict(symbol=a.symbol,symbolIdentifiers=['CSV:ICT_'+a.symbol+'_'+tag for tag in ('D1','H1','M30','M5')],
              daily=daily_refs,weekly=sorted(weekly,key=lambda b:b['knownAt']))
    code=(ROOT/'public/lib/ict-studies.js').read_text(encoding='utf-8').replace('export function ','function ')
    definitions={f'ict-context-{a.symbol.lower()}':'makeIctContext('+json.dumps(refs)+')',
                 'ict-fvg-zones':'makeIctFvg(false)','ict-fvg-midpoints':'makeIctFvg(true)','ict-sessions':'makeIctSessions()'}
    for name,definition in definitions.items():
        (ROOT/'custom'/f'{name}.js').write_text(code+'\nexport default '+definition+';\n',encoding='utf-8')
    prepared=dict(symbol=a.symbol,end=end.isoformat(),sourceVersion=SOURCE_VERSION,audit=audit,
                  referenceClock='Canonical NY calendar-day rollups; Sunday merged into Monday',panes=[])
    for tf,tag,limit in [('1D','D1',800),('1h','H1',8000),('30m','M30',8000),('5m','M5',20000)]:
        bars=daily if tf=='1D' else raw if tf=='5m' else rollup_candles(raw,'forex',tf)
        bars=bars[-limit:]
        if len(bars)<10:raise ValueError(f'Insufficient complete {tf} candles')
        buf=io.StringIO();writer=csv.writer(buf);writer.writerow(['time','open','high','low','close','volume'])
        for b in bars:writer.writerow([b['t']//1000,b['o'],b['h'],b['l'],b['c'],b['v']])
        encoded=buf.getvalue().encode()
        r=request(a.url+'/api/import/bars?name=ICT_'+a.symbol+'_'+tag,encoded,'POST','text/csv')
        prepared['panes'].append(dict(tf=tf,symbol=r['symbol'],bars=len(bars),first=bars[0]['day'],last=bars[-1]['day'],sha256=hashlib.sha256(encoded).hexdigest()))
        print(f'{tf}: {len(bars)} complete candles; {bars[0]["day"]} to {bars[-1]["day"]}',flush=True)
    folder=ROOT/'data/ict-workspace';folder.mkdir(parents=True,exist_ok=True)
    (folder/'prepared.json').write_text(json.dumps(prepared,indent=2,default=str),encoding='utf-8')
    print('Prepared native ICT indicators and original chart data. No source writes or broker calls.')

if __name__=='__main__':main()
