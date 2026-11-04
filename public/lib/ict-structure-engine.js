// JavaScript adaptation of ICT Structure Engine v6.3.0 by WillyAlgoTrader.
// Original: https://www.tradingview.com/script/4Y1T9TrB-ICT-Structure-Engine-WillyAlgoTrader/
// See docs/ict-structure-engine.md for clock, fill and visual differences. Research only.
export const ENGINE_VERSION='local-0.1.0-source-6.3.0';
export const engineDefaults={external:10,internal:3,poolLength:5,zoneAtr:50,riskAtr:14,
  minGap:.2,equalTolerance:.1,maxZoneAtr:1.5,maxOB:4,maxFVG:5,maxPools:6,
  obFrom:'External',obEdge:'Body',obInvalidation:'Close',breakConfirmation:'Close',
  obOn:'On',fvgOn:'On',breakers:'On',requireObFvg:'Off',minScore:0,fill:'Full',shrink:'On',
  timeFilter:'Killzones',biasFilter:'Off',entryArray:'FVG first',entryFilter:'Discount / Premium',
  sweepWindow:20,ttl:30,displacement:'On',htf:'On',htfSeconds:14400,htfLength:5,
  seconds:300,market:'forex',tick:.00001,stopMode:'Wick-Anchored',preset:'Balanced',
  tpMode:'R-Multiples',be:'On',beOffset:0,latest:'Exclude latest',showInternal:'Off',
  showStructure:'On',showSweeps:'On',showSetups:'On',showTrades:'On',showZones:'On'};
const nyFormatter=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
export function engineClock(t){const p=Object.fromEntries(nyFormatter.formatToParts(new Date(t*1000)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return {day:`${p.year}-${p.month}-${p.day}`,minute:+p.hour*60+(+p.minute)};}
export function atrSeries(bars,n){let sum=0,prev=null;return bars.map((b,i)=>{const tr=i?Math.max(b.high-b.low,Math.abs(b.high-bars[i-1].close),Math.abs(b.low-bars[i-1].close)):b.high-b.low;if(i<n){sum+=tr;if(i===n-1)prev=sum/n;}else prev=(prev*(n-1)+tr)/n;return prev;});}
// Pine chooses the most recent of equal extrema: equal older values are allowed, newer ones invalidate.
export function confirmedPivot(bars,i,k,side){const j=i-k;if(j<k)return null;const key=side>0?'high':'low',v=bars[j][key];for(let x=j-k;x<=i;x++){if(x===j)continue;const other=bars[x][key];if(side>0?(other>v||(x>j&&other===v)):(other<v||(x>j&&other===v)))return null;}return {price:v,idx:j,knownIndex:i,taken:false};}
export function stepStructure(s,bars,i,k,byClose='Close'){
  const ph=confirmedPivot(bars,i,k,1),pl=confirmedPivot(bars,i,k,-1);const swings=[];
  if(ph){if(s.hi)swings.push({...ph,kind:ph.price>s.hi.price?'HH':'LH'});s.hi=ph;}
  if(pl){if(s.lo)swings.push({...pl,kind:pl.price<s.lo.price?'LL':'HL'});s.lo=pl;}
  const b=bars[i];let up=s.hi&&!s.hi.taken&&(byClose==='Close'?b.close:b.high)>s.hi.price;
  let dn=s.lo&&!s.lo.taken&&(byClose==='Close'?b.close:b.low)<s.lo.price;
  if(up&&dn){s.hi.taken=s.lo.taken=true;up=b.close>s.hi.price;dn=b.close<s.lo.price;}
  let ev=0,pivot=null;if(up){s.hi.taken=true;ev=s.trend<0?2:1;s.trend=1;pivot=s.hi;}else if(dn){s.lo.taken=true;ev=s.trend>0?-2:-1;s.trend=-1;pivot=s.lo;}
  return {ev,pivot,swings};
}
export function isFvg(bars,at,d,atr,minGap){if(at<2)return false;const a=bars[at-2],b=bars[at-1],c=bars[at];return d>0?c.low>a.high&&b.close>a.high&&c.low-a.high>=minGap*atr:c.high<a.low&&b.close<a.low&&a.low-c.high>=minGap*atr;}
const tickPrice=(units,tick)=>Number((units*tick).toPrecision(14));
export function buildTradePlan(b,p,atr,sig,levels=[]){
  const d=sig.dir,tick=p.tick;const preset={Balanced:[1.5,1,2,3],Conservative:[2.5,1,2,4],Aggressive:[1,1.5,2.5,4],Scalping:[.8,.8,1.5,2]}[p.preset];
  if(!preset||!(tick>0)||!(atr>0))return {ok:false,reason:'ATR, tick or preset not ready'};
  const roundStop=x=>tickPrice(d>0?Math.floor(x/tick+1e-8):Math.ceil(x/tick-1e-8),tick);
  const roundTarget=x=>tickPrice(d>0?Math.floor(x/tick+1e-8):Math.ceil(x/tick-1e-8),tick);
  const extreme=p.stopMode==='Zone-Anchored'?sig.distal:p.stopMode==='Sweep-Anchored'?(d>0?sig.legLo:sig.legHi):d>0?b.low:b.high;
  let raw=p.stopMode==='ATR'?b.close-d*atr*preset[0]:d>0?Math.min(extreme-.25*atr,b.close-.5*atr):Math.max(extreme+.25*atr,b.close+.5*atr);
  const sl=roundStop(raw),risk=d*(b.close-sl);if(!(risk>0))return {ok:false,reason:'Invalid risk'};
  let targets=preset.slice(1).map(r=>b.close+d*risk*r),tags=['R','R','R'];
  if(p.tpMode!=='R-Multiples')for(let k=1;k<3;k++){
    const next=p.tpMode==='Liquidity'?levels.filter(x=>!x.taken&&x.side===d&&d*(x.price-targets[k-1])>0).sort((a,b)=>d*(a.price-b.price))[0]:[1,2,2.5].map(x=>({price:d>0?sig.legHi+x*(sig.legHi-sig.legLo):sig.legLo-x*(sig.legHi-sig.legLo),name:`${x} leg extension`})).find(x=>d*(x.price-targets[k-1])>0);
    if(next){targets[k]=next.price;tags[k]=next.name;}else if(k===2)targets[k]=d>0?Math.max(targets[k],targets[k-1]+risk):Math.min(targets[k],targets[k-1]-risk);
  }
  targets=targets.map(roundTarget);if(d*(targets[0]-b.close)<=0||d*(targets[1]-targets[0])<=0||d*(targets[2]-targets[1])<=0)return {ok:false,reason:'Targets collapse within one tick'};
  return {ok:true,dir:d,entry:b.close,sl,initialSL:sl,risk,targets,tags,atr,reached:[false,false,false],be:false};
}
// Reproduce the author's virtual TP-priority policy, but flag every unknowable intrabar ordering.
export function manageVirtualTrade(t,b,i,p){
  if(i<=t.entryIndex)return null;
  const d=t.dir,oldSL=t.sl,slHit=d>0?b.low<=oldSL:b.high>=oldSL;
  const hits=t.targets.map(x=>d>0?b.high>=x:b.low<=x),first=hits.map((v,k)=>v&&!t.reached[k]);
  const ambiguous=slHit&&hits.some(Boolean);if(ambiguous)t.ambiguities.push({index:i,time:b.time,stop:oldSL,targets:hits});
  hits.forEach((v,k)=>{if(v)t.reached[k]=true;});let beExit=false;
  if(p.be==='On'&&first[0]&&!t.be){const offset=Math.min(p.beOffset*t.atr,.5*Math.abs(t.targets[0]-t.entry));const x=t.entry+d*offset;const be=tickPrice(d>0?Math.floor(x/p.tick+1e-8):Math.ceil(x/p.tick-1e-8),p.tick);if(d*(b.close-be)<0)beExit=!hits[2];else {t.sl=be;t.be=true;}}
  const stopClose=slHit&&!first[0]&&!first[2];
  if(hits[2]||stopClose||beExit)return {reason:hits[2]?'TP3':stopClose?(t.be&&oldSL!==t.initialSL?'BE_STOP':'SL'):'BE_CLOSE',price:hits[2]?t.targets[2]:stopClose?oldSL:b.close,win:t.reached[0],ambiguous};
  return null;
}
function trim(arr,max){for(const d of [1,-1]){let n=0;for(let j=arr.length-1;j>=0;j--)if(arr[j].dir===d||arr[j].side===d){if(++n>max){arr[j].alive=false;arr.splice(j,1);}}}}
function overlaps(arr,d,top,btm){return arr.some(z=>z.dir===d&&!z.breaker&&!z.touched&&Math.min(top,z.top)-Math.max(btm,z.btm)>.5*Math.min(top-btm,z.top-z.btm));}
export function runStructureEngine(input,params={}){
  const p={...engineDefaults,...params};if(!(p.internal<p.external)||p.internal<1||p.external>50)throw Error('Internal length must be smaller than external');
  if(p.htf==='On'&&p.htfSeconds<p.seconds)throw Error('Higher timeframe is below chart timeframe');
  if(!(p.seconds>0)||!(p.tick>0))throw Error('Invalid interval or minimum tick');
  const n=p.latest==='All completed'?input.length:Math.max(0,input.length-1),bars=input.slice(0,n);
  for(let i=0;i<n;i++){const b=bars[i];if(!['time','open','high','low','close'].every(k=>Number.isFinite(b[k]))||b.low>Math.min(b.open,b.close)||b.high<Math.max(b.open,b.close)||b.low>b.high||(i&&b.time<=bars[i-1].time))throw Error('Invalid or unordered OHLC candles');}
  const za=atrSeries(bars,p.zoneAtr).map((a,i)=>a??(i?Math.max(bars[i].high-bars[i].low,Math.abs(bars[i].high-bars[i-1].close),Math.abs(bars[i].low-bars[i-1].close)):bars[i].high-bars[i].low)),ra=atrSeries(bars,p.riskAtr);
  const ext={trend:0},internal={trend:0},ht={trend:0},hb=[],obs=[],fvgs=[],pools=[],keys=[],rbs=[],pbs=[];
  const events=[],trades=[],setups=[],decisions=[],markers=[],barStates=[],breaks=Array(input.length).fill(false);
  const arrays=Object.fromEntries(['entry','stop','tp1','tp2','tp3','equilibrium','bullZoneLow','bullZoneHigh','bearZoneLow','bearZoneHigh','htfHigh','htfLow','midnight','buy','sell'].map(k=>[k,Array(input.length).fill(null)]));
  let active=null,display=null,set=null,lastBuy=null,lastSell=null,usedBuy=null,usedSell=null,rHi=null,rLo=null,seenHi=-1,seenLo=-1;
  let day=null,prevDay=null,week=null,prevWeek=null,dayKey=null,weekKey=null,mo=null,dailyBias=0,judas=null,hBucket=null,hHi=null,hLo=null,hBull=null,hBear=null;
  const sessions=[{name:'Asia',from:1200,to:1440},{name:'London',from:120,to:300},{name:'NY AM',from:420,to:600},{name:'NY PM',from:810,to:960}];
  const hActive=p.htf==='On'&&p.htfSeconds>p.seconds;
  let currentIndex=0;
  const emit=(kind,i,extra={})=>{const e={kind,index:i,time:bars[i].time,knownAt:bars[i].time+p.seconds,...extra};events.push(e);return e;};
  const mark=(i,text,d,group)=>{if(p[group]==='Off')return;markers.push({time:bars[i].time,position:d>0?'belowBar':'aboveBar',shape:d>0?'arrowUp':'arrowDown',color:d>0?'#00897b':'#d32f2f',text});};
  const setKey=(name,price,side,i)=>{const old=keys.findIndex(k=>k.name===name);if(old>=0)keys.splice(old,1);keys.push({name,price,side,index:i,knownAt:bars[i].time+p.seconds,taken:false});};
  const newZone=(top,btm,d,i,fvg=false,score=0,touched=false)=>({top,btm,eq:(top+btm)/2,dir:d,born:i,fvg,score,touched,alive:true,setup:false,entered:false,id:`${fvg?'FVG':'OB'}-${i}-${d}`});
  const score=(d,top,btm,imb,liq)=>{const hi=hActive?hHi:rHi,lo=hActive?hLo:rLo;return +imb+(+liq)+ +(hActive&&ht.trend===d)+ +(hi!=null&&lo!=null&&hi>lo&&(d>0?(top+btm)/2<(hi+lo)/2:(top+btm)/2>(hi+lo)/2));};
  const fvg=(at,d)=>isFvg(bars,at,d,za[at],p.minGap);
  const drop=(reason,i)=>{emit('SETUP_CANCEL',i,{setupId:set.id,reason});set.zone.setup=false;set=null;};
  const finish=(i,result)=>{Object.assign(active,{exitIndex:i,exitTime:bars[i].time+p.seconds,exitPrice:result.price,result:result.reason,authorWin:active.reached[0],finalPriceR:active.dir*(result.price-active.entry)/active.risk});emit('EXIT',i,{tradeId:active.id,reason:result.reason,price:result.price});active=null;};
  for(let i=0;i<n;i++){
    currentIndex=i;const b=bars[i],clock=engineClock(b.time),minute=clock.minute,a=za[i];
    // LOCAL_ADAPTATION: NY civil-day calendar; no promise of exchange-specific TradingView D/W parity.
    const weekDate=new Date(clock.day+'T12:00:00Z');weekDate.setUTCDate(weekDate.getUTCDate()-((weekDate.getUTCDay()+6)%7));const wk=weekDate.toISOString().slice(0,10);
    if(dayKey!==clock.day){if(day){prevDay=day;setKey('PDH',day.high,1,i);setKey('PDL',day.low,-1,i);if(prevDay.previous){const old=prevDay.previous;dailyBias=prevDay.close>old.high?1:prevDay.close<old.low?-1:prevDay.high>old.high&&prevDay.low<old.low?0:prevDay.high>old.high?-1:prevDay.low<old.low?1:0;}}
      day={high:b.high,low:b.low,close:b.close,previous:prevDay?{high:prevDay.high,low:prevDay.low}:null};dayKey=clock.day;mo=minute===0?b.open:null;judas=null;
    }else{day.high=Math.max(day.high,b.high);day.low=Math.min(day.low,b.low);day.close=b.close;}
    if(weekKey!==wk){if(week){prevWeek=week;setKey('PWH',week.high,1,i);setKey('PWL',week.low,-1,i);}week={high:b.high,low:b.low};weekKey=wk;}else{week.high=Math.max(week.high,b.high);week.low=Math.min(week.low,b.low);}
    // Only prior closed HTF buckets enter the HTF engine. Buckets require every constituent.
    if(hActive){const anchor=p.market==='us'?570:0,span=p.htfSeconds/60;const bucket=clock.day+':'+Math.floor((minute-anchor)/span);
      if(hBucket&&hBucket.key!==bucket){if(hBucket.bars.length===p.htfSeconds/p.seconds&&hBucket.bars.every((v,j)=>!j||v.time-hBucket.bars[j-1].time===p.seconds)){
        const xs=hBucket.bars;hb.push({time:xs[0].time,open:xs[0].open,high:Math.max(...xs.map(x=>x.high)),low:Math.min(...xs.map(x=>x.low)),close:xs.at(-1).close});const j=hb.length-1;const he=stepStructure(ht,hb,j,p.htfLength);hHi=ht.hi?.price??null;hLo=ht.lo?.price??null;
        if(he.ev){const d=Math.sign(he.ev),from=Math.max(0,j-200,he.pivot.idx);let xi=j-1;for(let k=j-1;k>=from;k--)if(d>0?hb[k].low<hb[xi].low:hb[k].high>hb[xi].high)xi=k;const x=hb[xi],ha=atrSeries(hb,p.zoneAtr).at(-1)??hb[j].high-hb[j].low;const dist=d>0?x.low:x.high;let edge=d>0?Math.max(x.open,x.close):Math.min(x.open,x.close);if(Math.abs(edge-dist)<.1*ha)edge=d>0?x.high:x.low;if(p.maxZoneAtr>0&&Math.abs(edge-dist)>p.maxZoneAtr*ha)edge=dist+d*p.maxZoneAtr*ha;const z={top:Math.max(edge,dist),btm:Math.min(edge,dist),knownAt:b.time,dir:d};if(d>0)hBull=z;else hBear=z;}
        if(hBull&&hb[j].close<hBull.btm)hBull=null;if(hBear&&hb[j].close>hBear.top)hBear=null;
      }hBucket=null;}if(!hBucket)hBucket={key:bucket,bars:[]};hBucket.bars.push(b);
    }
    const kzActive=p.seconds<=3600;
    let inKz=false;
    for(const s of sessions){const inside=kzActive&&minute>=s.from&&minute<s.to;inKz ||= inside;
      if(s.active&&!inside){setKey(s.name+' H',s.high,1,i);setKey(s.name+' L',s.low,-1,i);s.endKnownAt=b.time;}
      if(inside&&!s.active){s.high=b.high;s.low=b.low;s.start=i;s.startTime=b.time;}else if(inside){s.high=Math.max(s.high,b.high);s.low=Math.min(s.low,b.low);}s.active=inside;
    }
    for(let j=pools.length-1;j>=0;j--){const x=pools[j];if(x.side>0?b.high>x.price:b.low<x.price){pools.splice(j,1);if(x.side>0?b.close<x.price:b.close>x.price){const sw={index:i,name:x.hits>1?(x.side>0?'EQH':'EQL'):(x.side>0?'swing high':'swing low'),level:x.price,poolKnownAt:x.knownAt};if(x.side>0)lastBuy=sw;else lastSell=sw;emit('SWEEP',i,{side:x.side,...sw});mark(i,sw.name+' sweep',-x.side,'showSweeps');}}}
    for(const x of keys)if(!x.taken&&(x.side>0?b.high>x.price:b.low<x.price)){x.taken=true;if(x.side>0?b.close<x.price:b.close>x.price){const sw={index:i,name:x.name,level:x.price,poolKnownAt:x.knownAt};if(x.side>0)lastBuy=sw;else lastSell=sw;emit('SWEEP',i,{side:x.side,...sw});mark(i,x.name+' sweep',-x.side,'showSweeps');}}
    for(const d of [1,-1]){const pivot=confirmedPivot(bars,i,p.poolLength,d);if(pivot){const old=pools.find(x=>x.side===d&&Math.abs(x.price-pivot.price)<=p.equalTolerance*a);if(old){old.hits++;old.price=d>0?Math.max(old.price,pivot.price):Math.min(old.price,pivot.price);old.knownAt=b.time+p.seconds;}else pools.push({price:pivot.price,side:d,dir:d,hits:1,knownAt:b.time+p.seconds});trim(pools,p.maxPools);}}
    if(kzActive&&minute<300&&mo!=null&&dailyBias&&(!judas||!judas.done)){
      const d=dailyBias;if(d>0?b.low<mo:b.high>mo){if(!judas||judas.dir!==d)judas={dir:d,extreme:d>0?b.low:b.high};else judas.extreme=d>0?Math.min(judas.extreme,b.low):Math.max(judas.extreme,b.high);}
      const asia=sessions[0];if(judas&&asia.startTime!=null&&b.time-asia.startTime<=86400&&(d>0?judas.extreme<asia.low&&b.close>mo:judas.extreme>asia.high&&b.close<mo)){judas.done=true;emit('JUDAS',i,{dir:d,extreme:judas.extreme,midnight:mo});}
    }
    const ex=stepStructure(ext,bars,i,p.external,p.breakConfirmation),it=stepStructure(internal,bars,i,p.internal,p.breakConfirmation);
    for(const swing of ex.swings)emit('SWING',i,{classification:swing.kind,pivotIndex:swing.idx,level:swing.price});
    for(const [name,e]of [['External',ex],['Internal',it]])if(e.ev){emit(Math.abs(e.ev)===2?'CHOCH':'BOS',i,{layer:name,dir:Math.sign(e.ev),level:e.pivot.price,pivotIndex:e.pivot.idx,pivotKnownAt:bars[e.pivot.knownIndex].time+p.seconds});if(name==='External'||p.showInternal==='On')mark(i,`${name==='External'?'':'i'}${Math.abs(e.ev)===2?'CHoCH':'BOS'}`,Math.sign(e.ev),'showStructure');}
    if(ext.hi&&seenHi!==ext.hi.idx){seenHi=ext.hi.idx;rHi=ext.hi.price;}if(ext.lo&&seenLo!==ext.lo.idx){seenLo=ext.lo.idx;rLo=ext.lo.price;}if(rHi!=null&&b.high>rHi)rHi=b.high;if(rLo!=null&&b.low<rLo)rLo=b.low;
    const chUp=ex.ev===2||it.ev===2,chDn=ex.ev===-2||it.ev===-2;
    const timeOk=!kzActive||p.timeFilter==='Off'||(p.timeFilter==='Killzones'?inKz:[[180,240],[600,660],[840,900]].some(([s,e])=>minute>=s&&minute<e));
    const warm=i>=Math.max(50,p.zoneAtr,2*p.external+1),biasOk=d=>p.biasFilter==='Off'||(p.biasFilter==='With bias only'?dailyBias===d:dailyBias*d>=0);
    const armUp=warm&&timeOk&&biasOk(1)&&chUp&&!chDn&&lastSell&&lastSell.index!==usedSell&&i-lastSell.index<=p.sweepWindow;
    const armDn=warm&&timeOk&&biasOk(-1)&&chDn&&!chUp&&lastBuy&&lastBuy.index!==usedBuy&&i-lastBuy.index<=p.sweepWindow;
    if(p.obOn==='On'){
      for(let j=obs.length-1;j>=0;j--){const z=obs[j];if(i<=z.born)continue;const beyond=z.dir>0?b.close<z.btm:b.close>z.top;const broken=z.breaker?beyond:p.obInvalidation==='50%'?(z.dir>0?b.close<z.eq:b.close>z.eq):p.obInvalidation==='Wick'?(z.dir>0?b.low<z.btm:b.high>z.top):beyond;
        if(broken){if(p.breakers==='On'&&!z.breaker&&beyond){z.breaker=true;z.setup=false;z.pb=null;z.dir=-z.dir;z.touched=false;z.born=i;z.score=score(z.dir,z.top,z.btm,false,false);emit('BREAKER',i,{zoneId:z.id,dir:z.dir});}else{z.alive=false;obs.splice(j,1);}}
        else if(!z.touched&&b.low<=z.top&&b.high>=z.btm){z.touched=true;if(!z.breaker&&(z.dir>0?b.close<b.open:b.close>b.open))z.pb={index:i,top:b.high,btm:b.low};if(z.setup){z.setup=false;z.entered=true;}emit('OB_TOUCH',i,{zoneId:z.id,dir:z.dir});}
      }trim(obs,p.maxOB);
      const e=p.obFrom==='External'?ex:it;if(e.ev){const d=Math.sign(e.ev),count=Math.max(1,Math.min(i-e.pivot.idx,300));let xi=i-1;for(let j=i-1;j>=i-count;j--)if(d>0?bars[j].low<bars[xi].low:bars[j].high>bars[xi].high)xi=j;
        let src=null;for(let j=xi;j>=Math.max(i-count,xi-2);j--)if(d>0?bars[j].close<bars[j].open:bars[j].close>bars[j].open){src=j;break;}
        if(src!=null){const x=bars[src],dist=d>0?bars[xi].low:bars[xi].high;let prox=d>0?(p.obEdge==='Body'?Math.max(x.open,x.close):x.high):(p.obEdge==='Body'?Math.min(x.open,x.close):x.low);if(Math.abs(prox-dist)<.1*a)prox=d>0?x.high:x.low;if(p.maxZoneAtr>0&&Math.abs(prox-dist)>p.maxZoneAtr*a)prox=dist+d*p.maxZoneAtr*a;
          let imb=false,pre=false,gone=false;for(let j=xi+1;j<=i;j++){imb ||= fvg(j,d);if(gone&&(d>0?bars[j].low<=prox:bars[j].high>=prox)){pre=true;}gone ||= d>0?bars[j].low>prox:bars[j].high<prox;}
          const top=Math.max(prox,dist),btm=Math.min(prox,dist),sw=d>0?lastSell:lastBuy,sc=score(d,top,btm,imb,!!sw&&Math.abs(sw.index-xi)<=2);
          if((imb||p.requireObFvg==='Off')&&(sc>=p.minScore||(d>0?armUp:armDn))&&top-btm>=p.tick&&!overlaps(obs,d,top,btm)){const z=newZone(top,btm,d,i,false,sc,pre);z.origin=src;obs.push(z);emit('OB_CREATE',i,{zoneId:z.id,dir:d,top,btm,originIndex:src,score:sc});trim(obs,p.maxOB);}
        }
      }
    }
    for(const arr of [rbs,pbs])for(let j=arr.length-1;j>=0;j--){const z=arr[j];if(z.dir>0?b.close<z.btm:b.close>z.top){z.alive=false;arr.splice(j,1);}else if(i>z.born&&b.low<=z.top&&b.high>=z.btm)z.touched=true;}
    for(const z of obs)if(z.pb&&i>z.pb.index){if(i-z.pb.index>3)z.pb=null;else if(z.dir>0?b.close>z.pb.top:b.close<z.pb.btm){if(z.pb.top-z.pb.btm>=p.tick){pbs.push({...newZone(z.pb.top,z.pb.btm,z.dir,i),kind:'PB'});emit('PB_CREATE',i,{dir:z.dir,top:z.pb.top,btm:z.pb.btm});}z.pb=null;}}
    for(const d of [1,-1]){const pivot=confirmedPivot(bars,i,p.external,d);if(pivot){const x=bars[pivot.idx],edge=d>0?Math.max(x.open,x.close):Math.min(x.open,x.close),top=d>0?x.high:edge,btm=d>0?edge:x.low;if(top-btm>=.5*(x.high-x.low)&&top-btm>=p.tick&&!overlaps(obs,-d,top,btm)){rbs.push({...newZone(top,btm,-d,i),kind:'RB'});emit('RB_CREATE',i,{dir:-d,top,btm});}}}trim(rbs,3);trim(pbs,3);
    if(p.fvgOn==='On'){
      for(let j=fvgs.length-1;j>=0;j--){const z=fvgs[j];if(i<=z.born)continue;if(!z.touched&&b.low<=z.top&&b.high>=z.btm){z.touched=true;if(z.setup){if(z.dir>0?b.close>=z.btm:b.close<=z.top)z.entered=true;z.setup=false;}}
        const filled=z.dir>0?b.low<=(p.fill==='Touch'?z.top:p.fill==='50%'?z.eq:z.btm):b.high>=(p.fill==='Touch'?z.btm:p.fill==='50%'?z.eq:z.top);
        if(filled){z.alive=false;fvgs.splice(j,1);}else if(p.shrink==='On'){if(z.dir>0&&b.low<z.top)z.top=b.low;if(z.dir<0&&b.high>z.btm)z.btm=b.high;}
      }
      for(const d of [1,-1])if(fvg(i,d)){const z=newZone(d>0?b.low:bars[i-2].low,d>0?bars[i-2].high:b.high,d,i,true);fvgs.push(z);emit('FVG_CREATE',i,{zoneId:z.id,dir:d,top:z.top,btm:z.btm});trim(fvgs,p.maxFVG);}
    }
    let sig=null;
    if(set){if(i>set.expire)drop('expired',i);else if(set.dir>0?chDn:chUp)drop('opposite CHoCH',i);else if(set.zone.entered){const hi=hActive?hHi:rHi,lo=hActive?hLo:rLo,d=set.dir;let reason='';if(p.entryFilter==='Discount / Premium'){if(hi==null||lo==null||hi<=lo)reason='PD filter not ready';else if(d>0?b.close>=(hi+lo)/2:b.close<=(hi+lo)/2)reason='entry outside '+(d>0?'discount':'premium');}else if(p.entryFilter==='OTE (≥ 62%)'){const range=set.legHi-set.legLo;if(!(range>0))reason='OTE not ready';else if(!(d>0?b.close<=set.legHi-.618*range&&b.close>set.legLo:b.close>=set.legLo+.618*range&&b.close<set.legHi))reason='entry outside OTE';}
        if(!reason)sig={...set,distal:d>0?set.zone.btm:set.zone.top,zone:{...set.zone},rangeHigh:hi,rangeLow:lo};decisions.push({index:i,time:b.time,knownAt:b.time+p.seconds,setupId:set.id,accepted:!reason,reason,close:b.close});if(reason)emit('ENTRY_REJECT',i,{reason,setupId:set.id});set=null;
      }else if(!set.zone.alive||!set.zone.setup)drop('zone broken',i);}
    if(armUp||armDn){const d=armUp?1:-1,sw=armUp?lastSell:lastBuy;let displacement=false;for(let j=i;j>=Math.max(2,sw.index+1);j--)displacement ||= fvg(j,d);if(i===sw.index)displacement=fvg(i,d);
      const choose=(arr,since)=>arr.findLast(z=>z.dir===d&&!z.breaker&&!z.touched&&z.born>=since);
      let z=null;if(displacement||p.displacement==='Off'){const f=p.fvgOn==='On'&&p.entryArray!=='OB only'?choose(fvgs,sw.index):null,o=p.obOn==='On'&&p.entryArray!=='FVG only'?choose(obs,i):null;z=p.entryArray.startsWith('FVG')?f||o:o||f;}
      if(z){if(set)drop('replaced',i);const leg=bars.slice(sw.index,i+1),legLo=Math.min(...leg.map(x=>x.low)),legHi=Math.max(...leg.map(x=>x.high));if(z.fvg)z.score=score(d,z.top,z.btm,true,true);z.setup=true;const s={id:`setup-${i}-${d}`,dir:d,zone:z,armIndex:i,armKnownAt:b.time+p.seconds,expire:i+p.ttl,legLo,legHi,sweep:{...sw},displacement};set=s;setups.push({...s,zone:{...z}});if(d>0)usedSell=sw.index;else usedBuy=sw.index;emit('SETUP_ARM',i,{setupId:s.id,dir:d,sweepIndex:sw.index,zoneId:z.id,displacement});mark(i,'Setup '+(d>0?'↑':'↓'),d,'showSetups');}
      else emit('ARM_REJECT',i,{dir:d,reason:!displacement&&p.displacement==='On'?'no displacement':'no fresh entry zone'});
    }
    if(active){const result=manageVirtualTrade(active,b,i,p);if(result)finish(i,result);}
    arrays.buy[i]=0;arrays.sell[i]=0;
    if(sig&&warm){const plan=buildTradePlan(b,p,ra[i],sig,[...pools,...keys]);if(!plan.ok)emit('PLAN_REJECT',i,{setupId:sig.id,reason:plan.reason});else{
        if(active&&active.dir!==sig.dir)finish(i,{reason:'REVERSAL',price:b.close});
        if(!active){const t={...plan,id:`trade-${i}-${sig.dir}`,entryIndex:i,signalTime:b.time,decisionKnownAt:b.time+p.seconds,virtualEntryTime:b.time+p.seconds,setupId:sig.id,evidence:{...sig,zone:{...sig.zone}},ambiguities:[],result:'OPEN'};active=t;display=t;trades.push(t);breaks[i]=true;emit('ENTRY',i,{tradeId:t.id,setupId:sig.id,dir:sig.dir,entry:t.entry,stop:t.sl,targets:t.targets});arrays[sig.dir>0?'buy':'sell'][i]=1;mark(i,(sig.dir>0?'BUY':'SELL')+' · ICT-SE',sig.dir,'showTrades');}
        else emit('PLAN_REJECT',i,{setupId:sig.id,reason:'same-direction position already open'});
      }}
    if(display){arrays.entry[i]=display.entry;arrays.stop[i]=display.sl;[arrays.tp1[i],arrays.tp2[i],arrays.tp3[i]]=display.targets;}
    arrays.equilibrium[i]=rHi!=null&&rLo!=null?(rHi+rLo)/2:null;arrays.htfHigh[i]=hHi;arrays.htfLow[i]=hLo;arrays.midnight[i]=mo;
    for(const d of [1,-1]){const z=[...obs,...fvgs].findLast(x=>x.dir===d&&!x.breaker);arrays[d>0?'bullZoneLow':'bearZoneLow'][i]=z?.btm??null;arrays[d>0?'bullZoneHigh':'bearZoneHigh'][i]=z?.top??null;}
    barStates.push({time:b.time,knownAt:b.time+p.seconds,external:ext.trend,internal:internal.trend,htf:ht.trend,dailyBias,setupId:set?.id??null,positionId:active?.id??null});
  }
  const closed=trades.filter(t=>t.exitTime!=null);return {...arrays,breaks,markers:markers.slice(-150),events,trades,setups,decisions,barStates,version:ENGINE_VERSION,parameters:p,
    keys:keys.map(k=>({...k})),range:{high:rHi,low:rLo,dir:ext.trend},
    zones:[...obs,...fvgs,...rbs,...pbs].map(z=>({...z})),htfZones:[hBull,hBear].filter(Boolean),stats:{trades:trades.length,closed:closed.length,authorWins:closed.filter(t=>t.authorWin).length,ambiguousTrades:trades.filter(t=>t.ambiguities.length).length,open:trades.length-closed.length}};
}
