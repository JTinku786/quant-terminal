"""Independent candle checks for the source's structure and FVG formulas (not TradingView execution)."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'data/ict-engine'
manifest=json.loads((ROOT/'manifest.json').read_text())
for item in manifest['symbols']:
 bars=json.loads((ROOT/'candles'/(item['symbol']+'.json')).read_text())['candles']
 events=[];fvgs=[];atr=None;seed=[]
 states={name:dict(hi=None,lo=None,trend=0,k=k) for name,k in [('External',10),('Internal',3)]}
 for i,b in enumerate(bars):
  tr=max(b['high']-b['low'],abs(b['high']-bars[i-1]['close']),abs(b['low']-bars[i-1]['close'])) if i else b['high']-b['low']
  if i<50:
   seed.append(tr)
   if i==49:atr=sum(seed)/50
  else:atr=(atr*49+tr)/50
  threshold=.2*(tr if atr is None else atr)
  if i>=2:
   first,middle=bars[i-2],bars[i-1]
   if b['low']>first['high'] and middle['close']>first['high'] and b['low']-first['high']>=threshold:fvgs.append([i,1,b['low'],first['high']])
   if b['high']<first['low'] and middle['close']<first['low'] and first['low']-b['high']>=threshold:fvgs.append([i,-1,first['low'],b['high']])
  for name,s in states.items():
   k=s['k'];j=i-k
   if j>=k:
    for key,field,sign in [('hi','high',1),('lo','low',-1)]:
     v=bars[j][field]
     window=[sign*bars[x][field] for x in range(j-k,i+1)]
     if sign*v==max(window) and all(sign*bars[x][field]<sign*v for x in range(j+1,i+1)):
      s[key]=dict(price=v,taken=False)
   h,l=s['hi'],s['lo'];up=h and not h['taken'] and b['close']>h['price'];dn=l and not l['taken'] and b['close']<l['price']
   if up:
    ev=2 if s['trend']<0 else 1;s['trend']=1;h['taken']=True;events.append([i,name,ev,h['price']])
   elif dn:
    ev=-2 if s['trend']>0 else -1;s['trend']=-1;l['taken']=True;events.append([i,name,ev,l['price']])
 (ROOT/'candles'/(item['symbol']+'.reference.json')).write_text(json.dumps(dict(events=events,fvgs=fvgs)))
 print(item['symbol'],len(events),'structure events',len(fvgs),'FVGs',flush=True)
