import {runLuxStudy} from './luxalgo-suite.js';
export function liquidityTimeline(bars) {
 const timeline=bars.map(()=>[]);
 const sources={'liquidity-swings':{length:14,filter:'Count',threshold:0},'buyside-sellside':{length:7,margin:6.9,zoneMargin:2.3,visible:3},'liquidity-sweeps':{length:5,maxBars:300},'liquidity-pools':{contacts:2,gap:5,confirm:10}};
 for(const [source,p] of Object.entries(sources))runLuxStudy(source,bars,{...p,mode:'Historical',onAreas:(i,areas)=>{for(const a of areas)timeline[i].push({...a,id:source+':'+a.id,source});}});
 return timeline;
}
export function displacementDirections(bars,length=5){
 return bars.map((b,i)=>{if(i<length-1)return 0;const body=Math.abs(b.close-b.open),mean=bars.slice(i-length+1,i+1).reduce((s,x)=>s+Math.abs(x.close-x.open),0)/length;
 return body>mean&&b.high-Math.max(b.open,b.close)<body*.36&&Math.min(b.open,b.close)-b.low<body*.36?(b.close>b.open?1:-1):0;});
}
export function runLiquidityPullback(bars,params={},areas=liquidityTimeline(bars)){
 const wait=Math.max(1,Math.min(3,Number(params.wait??3))),rr=Math.max(1.7,Number(params.rr??1.7)),stopMode=params.stopMode??'Farther',touchMode=params.touchMode??'Touch',dirs=displacementDirections(bars),trades=[],signals=[],rejections=[];
 let candidates=[],pending=null,position=null,previousTouches=new Set();
 for(let i=0;i<bars.length;i++){
  const b=bars[i];
  // Orders were decided at the previous close. Only this open is used to fill.
  if(pending){const {side,stop}=pending,risk=side*(b.open-stop);if(risk>0){position={...pending,entryIndex:i,entryTime:b.time,entry:b.open,target:b.open+side*risk*rr,risk,rr};trades.push(position);}else rejections.push({index:i,reason:'Open beyond stop',...pending});pending=null;}
  if(position){const t=position,stopHit=t.side===1?b.low<=t.stop:b.high>=t.stop,targetHit=t.side===1?b.high>=t.target:b.low<=t.target;
   if(stopHit||targetHit){const gapStop=t.side===1?b.open<t.stop:b.open>t.stop;const price=stopHit?(gapStop?b.open:t.stop):t.target;t.exit={index:i,time:b.time,price,reason:stopHit?'SL':'TP',r:t.side*(price-t.entry)/t.risk,ambiguous:stopHit&&targetHit};position=null;}
  }
  const next=[],ready=[];
  for(const c of candidates){c.low=Math.min(c.low,b.low);c.high=Math.max(c.high,b.high);
   if(c.first==null){if(i-c.contactIndex>wait)continue;if(dirs[i]===c.side){c.first=i;c.initialLow=b.low;c.initialHigh=b.high;}next.push(c);}
   else {const age=i-c.first;if(age>2)continue;if(dirs[i]===-c.side&&b.close>=c.initialLow&&b.close<=c.initialHigh){const initial=c.side===1?c.initialLow:c.initialHigh,leg=c.side===1?c.low:c.high;const stop=stopMode==='Initial'?initial:stopMode==='Swing'?leg:c.side===1?Math.min(initial,leg):Math.max(initial,leg);ready.push({...c,stop,pullbackIndex:i,decisionIndex:i});}else next.push(c);}
  }
  candidates=next;
  if(ready.length&&!position){ready.sort((a,b)=>b.contactIndex-a.contactIndex);const sides=new Set(ready.map(c=>c.side));if(sides.size===1){pending=ready[0];signals.push({...pending});candidates=[];}else rejections.push({index:i,reason:'Conflicting long and short confirmations'});}
  const touched=new Set(),bySide=new Map();
  for(const a of areas[i]||[]){if(a.knownIndex>i)throw Error('Future liquidity area');const intersects=b.high>=a.bottom&&b.low<=a.top,breach=a.side===1?b.high>a.top:b.low<a.bottom;const contact=touchMode==='Sweep'?intersects&&breach:intersects;if(!contact)continue;touched.add(a.id);if(previousTouches.has(a.id))continue;const side=-a.side;if(!bySide.has(side))bySide.set(side,[]);bySide.get(side).push({...a});}
  if(!position&&!pending)for(const [side,evidence]of bySide){candidates.push({side,contactIndex:i,contactTime:b.time,evidence,low:b.low,high:b.high,first:null});}
  previousTouches=touched;
 }
 return {trades,signals,rejections,parameters:{wait,rr,stopMode,touchMode},open:position,pending};
}
export function liquidityTradeDrawing(bars,result,visible=8){
 const zones=[],lines=[],labels=[],markers=[];
 for(const t of result.trades.slice(-visible)){const end=t.exit?.index??Math.min(bars.length-1,t.entryIndex+30),color=t.side===1?'#00d6a0':'#ff5364',tag=t.side===1?'BUY / LONG':'SELL / SHORT';
  zones.push({start:t.entryIndex,end,top:Math.max(t.entry,t.stop),bottom:Math.min(t.entry,t.stop),color:'#f23645',alpha:.19},{start:t.entryIndex,end,top:Math.max(t.entry,t.target),bottom:Math.min(t.entry,t.target),color:'#089981',alpha:.19});
  for(const [price,text,c]of [[t.entry,tag+' '+t.entry.toFixed(4),color],[t.stop,'SL '+t.stop.toFixed(4),'#ff5364'],[t.target,'TP '+t.target.toFixed(4)+' | 1:'+t.rr,'#00d6a0']])lines.push({start:t.entryIndex,end:Math.max(end,t.entryIndex+2),price,text,color:c,dashed:price!==t.entry});
  markers.push({time:t.entryTime,position:t.side===1?'belowBar':'aboveBar',shape:t.side===1?'arrowUp':'arrowDown',color,text:tag});
  labels.push({index:t.first,price:t.side===1?bars[t.first].low:bars[t.first].high,text:'D1',color},{index:t.pullbackIndex,price:bars[t.pullbackIndex].close,text:'Pullback D2',color:'#f5c451'});
  if(t.exit)markers.push({time:t.exit.time,position:t.side===1?'aboveBar':'belowBar',shape:'circle',color:t.exit.reason==='TP'?'#00d6a0':'#ff5364',text:t.exit.reason+(t.exit.ambiguous?' (?)':'')});
 }
 // One marker per bar avoids duplicate times in the chart marker API.
 const grouped=new Map();for(const m of markers){const old=grouped.get(m.time);grouped.set(m.time,old?{...m,text:old.text+' / '+m.text}:m);}
 return {value:bars.map(()=>null),markers:[...grouped.values()].sort((a,b)=>a.time-b.time),luxStudy:{id:'liquidity-pullback',zones,lines,labels},strategyResult:result};
}
