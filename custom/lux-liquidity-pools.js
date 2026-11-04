// © LuxAlgo. Adapted from the six original scripts in research/luxalgo-suite/.
// Attribution-NonCommercial-ShareAlike 4.0: https://creativecommons.org/licenses/by-nc-sa/4.0/
// Private local research adaptation. Source algorithms, not the unrelated ICT-SE engine.
const LUX_IDS=['liquidity-swings','buyside-sellside','liquidity-sweeps','liquidity-pools','smc','ict-concepts'];
const bull='#089981',bear='#f23645';
const volume=b=>Number.isFinite(b?.volume)?b.volume:0;
function atr(bs,k){let a=null,sum=0;return bs.map((b,i)=>{const tr=i?Math.max(b.high-b.low,Math.abs(b.high-bs[i-1].close),Math.abs(b.low-bs[i-1].close)):b.high-b.low;if(i<k){sum+=tr;if(i===k-1)a=sum/k;}else a=(a*(k-1)+tr)/k;return a;});}
function pivot(bs,i,left,right,high){const j=i-right;if(j<left)return null;const field=high?'high':'low',v=bs[j][field];for(let x=j-left;x<=i;x++)if(x!==j&&(high?(bs[x][field]>v||(x>j&&bs[x][field]===v)):(bs[x][field]<v||(x>j&&bs[x][field]===v))))return null;return {index:j,price:v};}
function output(){return {zones:[],lines:[],labels:[],events:[],markers:[],plots:{}};}
function zone(o,z){o.zones.push(z);return z;}
function line(o,start,end,price,text,color,extra={}){const x={start,end,price,text,color,...extra};o.lines.push(x);return x;}
function event(o,kind,index,extra={}){o.events.push({kind,index,...extra});}
function swings(bs,p){const o=output(),k=p.length??14,sides=[null,null];for(let i=0;i<bs.length;i++)for(let s=0;s<2;s++){
 const high=s===0,ph=pivot(bs,i,k,k,high),old=sides[s];
 if(ph){if(old&&!old.crossed)old.level.end=i-k;const b=bs[ph.index],top=high?b.high:p.area==='Full Range'?b.high:Math.min(b.open,b.close),bottom=high?(p.area==='Full Range'?b.low:Math.max(b.open,b.close)):b.low;
  const z={start:ph.index,end:ph.index,top,bottom,color:high?bear:bull,alpha:.10,knownIndex:i};zone(o,z);
  const level=line(o,ph.index,i+3,high?top:bottom,'',high?bear:bull,{hidden:true});sides[s]={top,bottom,origin:ph.index,count:0,vol:0,crossed:false,area:z,level,confirmed:i};event(o,'PIVOT',i,{side:high?1:-1,pivotIndex:ph.index,top,bottom});
 }else if(old){const look=bs[i-k];if(look&&look.low<old.top&&look.high>old.bottom){old.count++;old.vol+=volume(look);}if(high?bs[i].close>old.top:bs[i].close<old.bottom){if(!old.crossed){old.level.end=i;old.level.dashed=true;}old.crossed=true;}
  old.area.end=old.crossed?old.origin:i+3;if(!old.crossed)old.level.end=i+3;const target=p.filter==='Volume'?old.vol:old.count;
  if(target>(p.threshold??0)){old.level.hidden=false;if(!old.accum)old.accum=zone(o,{start:old.origin,end:old.origin+old.count,top:old.top,bottom:old.bottom,color:high?bear:bull,alpha:.30,knownIndex:i});old.accum.end=old.origin+old.count;
   if(!old.label){old.label={index:old.origin,price:high?old.top:old.bottom,color:high?bear:bull,text:'',size:9,knownIndex:i};o.labels.push(old.label);}old.label.text=formatVolume(old.vol);
  }
 }
 }return o;}
function clusteredLiquidity(bs,p,ict=false){const o=output(),k=p.length??(ict?5:7),as=atr(bs,10),zz=[],levels=[[],[]],start=p.mode==='Historical'?0:Math.max(0,bs.length-501),margin=ict?(p.margin??4):10/(p.margin??6.9),max=p.visible??(ict?2:3);
 for(let i=0;i<bs.length;i++){
  for(const d of [1,-1]){const v=pivot(bs,i,k,1,d>0);if(!v)continue;const last=zz[0];if(!last||last.dir!==d){zz.unshift({dir:d,index:v.index,price:v.price});if(zz.length>50)zz.pop();}else if(d>0?v.price>last.price:v.price<last.price){last.index=v.index;last.price=v.price;}
   if(i<start||as[i]==null)continue;const width=as[i]/margin;let count=0,origin=0,price=0,min=0,maxPrice=1e7;
   for(const x of zz)if(x.dir===d){if(d>0?x.price>v.price+width:x.price<v.price-width)break;if(x.price>v.price-width&&x.price<v.price+width){count++;origin=x.index;price=x.price;min=Math.max(min,x.price);maxPrice=Math.min(maxPrice,x.price);}}
   if(count>2){const arr=levels[d>0?0:1],old=arr[0],top=(min+maxPrice)/2+width,bottom=(min+maxPrice)/2-width;
    if(old&&old.start===origin){old.top=top;old.bottom=bottom;old.end=i+10;}
    else {const z={start:origin,end:i+10,top,bottom,price,color:ict?(d>0?'#fa451c':'#1ce4fa'):(d>0?'#4caf50':bear),alpha:0,dir:d,knownIndex:i,broken:false,breached:false,text:d>0?'Buyside liquidity':'Sellside liquidity'};arr.unshift(z);event(o,'LIQUIDITY_CREATE',i,{side:d,price,top,bottom,origin,count});if(arr.length>max)arr.pop();}
   }
  }
  for(const arr of levels)for(const z of arr){const b=bs[i],d=z.dir;if(ict){if(!z.broken){z.end=i+3;if(d>0?b.close>z.bottom:b.close<z.top)z.partial=true;if(z.partial){z.alpha=.10;if(d>0?b.close>z.top:b.close<z.bottom){z.broken=true;z.end=i;}}}}
   else if(!z.breached){if(d>0?b.high>z.top:b.low<z.bottom){z.breached=true;z.breachIndex=i;z.breachTop=d>0?Math.min(z.price+(p.zoneMargin??2.3)*as[i],b.high):z.price;z.breachBottom=d>0?z.price:Math.max(z.price-(p.zoneMargin??2.3)*as[i],b.low);z.end=i+1;event(o,'LIQUIDITY_BREACH',i,{side:d,price:z.price});}}
   else if(!z.broken){const m=(p.zoneMargin??2.3)*as[i];if(b.low>z.price-m&&b.high<z.price+m){z.end=i+1;if(d>0)z.breachTop=Math.max(b.high,z.breachTop);else z.breachBottom=Math.min(b.low,z.breachBottom);}else z.broken=true;}
  }
 }
 for(const arr of levels)for(const z of arr){o.zones.push({...z});if(!ict&&z.breached)o.zones.push({...z,start:z.breachIndex-1,top:z.breachTop,bottom:z.breachBottom,alpha:.27,text:''});if(!ict||!z.partial)o.lines.push({start:z.start,end:ict?z.end:z.breached?z.end:bs.length-1,price:z.price,text:z.text,color:z.color,dashed:true});}
 o.zz=zz;return o;
}
function sweeps(bs,p){const o=output(),k=p.length??5,points=[[],[]],boxes=[];for(let i=0;i<bs.length;i++){
 for(const d of [1,-1]){const x=pivot(bs,i,k,k,d>0);if(x)points[d>0?0:1].unshift({...x,dir:d});}
 for(const arr of points)for(let j=arr.length-1;j>=0;j--){const x=arr[j],b=bs[i],d=x.dir;if(d>0?b.close>x.price:b.close<x.price)x.mitigated=true;
  if(!x.wick&&(d>0?b.high>x.price&&b.close<x.price:b.low<x.price&&b.close>x.price)){const z={start:i-1,end:i+1,top:d>0?b.high:x.price,bottom:d>0?x.price:b.low,color:d>0?bear:bull,alpha:.25,dir:d,knownIndex:i};boxes.push(z);line(o,x.index,i,x.price,'Sweep',z.color,{dashed:true});event(o,'SWEEP',i,{side:d,level:x.price,pivotIndex:x.index,top:z.top,bottom:z.bottom});x.wick=true;}
  if(i-x.index>2000||x.mitigated)arr.splice(j,1);
 }
 if(p.extend!=='Off')for(const z of boxes)if(!z.broken&&i-z.start-1<=(p.maxBars??300)){z.end=i;if(z.dir<0?bs[i].close<z.bottom:bs[i].close>z.top)z.broken=true;}
 }o.zones=boxes;return o;}
function pools(bs,p){const o=output();if(!bs.length)return o;const data=(b,i)=>({h:b.high,t:Math.max(b.open,b.close),b:Math.min(b.open,b.close),l:b.low,index:i});let hst=data(bs[0],0),lst=hst,hCount=0,lCount=0,lastH=0,lastL=0,bsH=0,bsL=0,hiVol=0,loVol=0,hZone=null,lZone=null;const highs=[],lows=[],snap=[];
 for(let i=0;i<bs.length;i++){const b=bs[i],cur=data(b,i),prev=snap[i-1],prev2=snap[i-2];if(b.high>hst.h&&(cur.t>hst.h||cur.t<hst.t)){if(hCount>1){lst=cur;loVol=0;lCount=0;}hst=cur;hiVol=0;hCount=1;lastH=i;}if(b.low<lst.l&&(cur.b<lst.l||cur.b>lst.b)){if(lCount>1){hst=cur;hiVol=0;hCount=0;}lst=cur;loVol=0;lCount=1;lastL=i;}
  const hWick=b.high>hst.t&&cur.t<=hst.t,lWick=b.low<lst.b&&cur.b>=lst.b;if(prev?.hWick&&prev.hstT===prev2?.hstT&&bsH>(p.gap??5)){hCount++;lastH=i-1;}if(prev?.lWick&&prev.lstB===prev2?.lstB&&bsL>(p.gap??5)){lCount++;lastL=i-1;}const oldBsH=bsH,oldBsL=bsL;bsH=Math.abs(lastH-i);bsL=Math.abs(lastL-i);hst.h=Math.max(hst.h,b.high);lst.l=Math.min(lst.l,b.low);const range=b.high-b.low;if(range>0){hiVol+=Math.max(b.high-hst.t,0)/range*volume(b);loVol+=Math.max(lst.b-b.low,0)/range*volume(b);}
  for(const d of [1,-1]){const high=d>0,count=high?hCount:lCount,wait=high?bsH:bsL,oldWait=high?oldBsH:oldBsL,ref=high?hst:lst;let z=high?hZone:lZone;const arr=high?highs:lows;
   if(count>=(p.contacts??2)&&wait>(p.confirm??10)&&oldWait<=(p.confirm??10)&&(high?b.close<ref.t:b.close>ref.b)){
    const top=high?ref.h:ref.b,bottom=high?ref.t:ref.l,vol=high?hiVol:loVol;
    if(z&&ref.index===z.start){z.top=Math.max(top,z.top);z.bottom=high?Math.min(ref.t,z.top):Math.min(bottom,z.bottom);}
    else if(z&&(high?ref.h<=z.top&&ref.t>=z.top:ref.b<=z.top&&ref.l>=z.bottom)){z.end=i;z.vol+=vol;arr.push(z);}
    else if(z&&(high?ref.h>z.top&&ref.t<z.top:(ref.b>z.top&&ref.l<z.top)||(ref.b>z.bottom&&ref.l<z.bottom))){if(high){const prevTop=z.top;z.top=Math.max(ref.t,prevTop);z.bottom=Math.min(ref.h,prevTop);}else{z.top=Math.max(ref.b,z.top);z.bottom=Math.min(ref.l,z.bottom);}z.end=i;z.vol+=vol;arr.push(z);}
    else{z=zone(o,{start:ref.index,end:i,top,bottom,knownIndex:i,color:high?bear:bull,alpha:.20,vol,state:0});arr.push(z);if(high)hZone=z;else lZone=z;event(o,'POOL_CREATE',i,{side:d,top,bottom,origin:ref.index,contacts:count});}
   }
   for(let j=arr.length-1;j>=0;j--){const q=arr[j];if(j===arr.length-1){if(high?b.close<q.bottom:b.close>q.top){q.linePrice=high?q.bottom:q.top;q.lineEnd=i;}if((b.high<q.top&&b.high>q.bottom)||(b.low<q.top&&b.low>q.bottom)||(b.high>=q.top&&b.low<=q.bottom)){q.vol+=(range>0?(Math.min(b.high,q.top)-Math.max(b.low,q.bottom))/range:1)*volume(b);}q.text=p.volumeLabels==='Off'?'':formatVolume(q.vol);}if(high?b.close>q.top:b.close<q.bottom){if(q.state<0){arr.splice(j,1);q.linePrice=null;}q.state--;}else q.state=0;}
  }
  snap.push({hWick,lWick,hstT:hst.t,lstB:lst.b});
 }
 for(const arr of [highs,lows])for(const q of arr)if(q.linePrice!=null)o.lines.push({start:q.start,end:q.lineEnd,price:q.linePrice,color:q.color,text:''});return o;}
function smc(bs,p){const o=output(),a=atr(bs,200),parsedH=[],parsedL=[],states=[{leg:0,trend:0},{leg:0,trend:0},{leg:0,trend:0}],obs=[];let trailingTop=null,trailingLow=null,trailTopIndex=0,trailLowIndex=0,trailStart=0;
 for(let i=0;i<bs.length;i++){const b=bs[i];if(trailingTop==null||b.high>trailingTop){trailingTop=b.high;trailTopIndex=i;}if(trailingLow==null||b.low<trailingLow){trailingLow=b.low;trailLowIndex=i;}const hv=a[i]!=null&&b.high-b.low>=2*a[i];parsedH.push(hv?b.low:b.high);parsedL.push(hv?b.high:b.low);
  for(let s=0;s<3;s++){const state=states[s],k=s===0?(p.swingLength??50):s===1?5:(p.equalBars??3),j=i-k;if(j<0)continue;const window=bs.slice(j+1,i+1),high=b=>b.high,low=b=>b.low;const next=bs[j].high>Math.max(...window.map(high))?0:bs[j].low<Math.min(...window.map(low))?1:state.leg;
   if(next!==state.leg){const d=next===1?-1:1,price=d>0?bs[j].high:bs[j].low,old=d>0?state.hi:state.lo;const pv={price,index:j,crossed:false,prevPrice:old?.price,prevBarLevel:old?.price};if(s===2&&old&&a[i]!=null&&Math.abs(price-old.price)<(p.equalThreshold??.1)*a[i]){line(o,old.index,j,price,d>0?'EQH':'EQL',d>0?bear:bull,{dashed:true,knownIndex:i});event(o,d>0?'EQH':'EQL',i,{price,origin:j});}if(d>0)state.hi=pv;else state.lo=pv;if(s===0){if(d>0){trailingTop=price;trailTopIndex=j;}else{trailingLow=price;trailLowIndex=j;}trailStart=j;}}
   state.leg=next;
  }
  for(const s of [1,0]){const state=states[s],previous=bs[i-1];if(!previous)continue;for(const d of [1,-1]){const pv=d>0?state.hi:state.lo;if(!pv||pv.crossed)continue;const priorLevel=pv.prevBarLevel??pv.price;const crossed=d>0?b.close>pv.price&&previous.close<=priorLevel:b.close<pv.price&&previous.close>=priorLevel;const swingPv=d>0?states[0].hi:states[0].lo;if(!crossed||(s===1&&pv.price===swingPv?.price))continue;
    const text=state.trend===-d?'CHoCH':'BOS';pv.crossed=true;state.trend=d;line(o,pv.index,i,pv.price,text,d>0?bull:bear,{dashed:s===1,small:s===1,knownIndex:i});event(o,text,i,{layer:s===1?'Internal':'Swing',side:d,price:pv.price,origin:pv.index});
    if(s===0&&p.swingOB!=='Off'){let best=pv.index;for(let j=pv.index;j<i;j++)if(d>0?parsedL[j]<parsedL[best]:parsedH[j]>parsedH[best])best=j;const z={start:best,end:i,top:parsedH[best],bottom:parsedL[best],dir:d,color:d>0?'#3179f5':'#f77c80',alpha:.20,knownIndex:i};obs.unshift(z);if(obs.length>100)obs.pop();event(o,'SWING_OB',i,{side:d,top:z.top,bottom:z.bottom,origin:best});}
   }}
  // Preserve previous-bar dynamic levels for crossover with a newly formed pivot next bar.
  for(const s of states)for(const k of ['hi','lo'])if(s[k])s[k].prevBarLevel=s[k].price;
  for(let j=0;j<obs.length;j++){const z=obs[j];if(z.dir>0?b.low<z.bottom:b.high>z.top)obs.splice(j,1);}
 }
 for(const z of obs.slice(0,p.obCount??5))o.zones.push({...z,end:bs.length-1,text:'SMC OB'});
 if(bs.length&&p.strongWeak!=='Off'){line(o,trailTopIndex,bs.length+20,trailingTop,states[0].trend<0?'Strong High':'Weak High',bear);line(o,trailLowIndex,bs.length+20,trailingLow,states[0].trend>0?'Strong Low':'Weak Low',bull);}return o;
}
function ict(bs,p){const o=clusteredLiquidity(bs,{length:p.length??5,margin:p.margin??4,visible:p.visibleLiquidity??2,mode:p.mode??'Present'},true),zz=[],k=p.length??5,start=p.mode==='Historical'?0:Math.max(0,bs.length-501);let trend=0,lastMss=null,lastBos=null,leg=0,top=null,btm=null;const obs=[[],[]],bodies=bs.map(b=>Math.abs(b.close-b.open));o.plots.up=Array(bs.length).fill(null);o.plots.down=Array(bs.length).fill(null);
 for(let i=0;i<bs.length;i++){const b=bs[i];for(const d of [1,-1]){const x=pivot(bs,i,k,1,d>0);if(x){if(!zz[0]||zz[0].dir!==d){zz.unshift({...x,dir:d});if(zz.length>50)zz.pop();}else if(d>0?x.price>zz[0].price:x.price<zz[0].price)Object.assign(zz[0],x);}}
  const ph=zz[zz[2]?.dir===1?2:1],pl=zz[zz[2]?.dir===-1?2:1];let d=0,target=null,isMss=false;
  if(ph?.dir===1&&b.close>ph.price&&trend<1){d=1;target=ph;isMss=true;}else if(pl?.dir===-1&&b.close<pl.price&&trend>-1){d=-1;target=pl;isMss=true;}else if(trend===1&&ph&&b.close>ph.price&&ph.price!==lastBos?.price&&ph.price!==lastMss?.price){d=1;target=ph;}else if(trend===-1&&pl&&b.close<pl.price&&pl.price!==lastBos?.price&&pl.price!==lastMss?.price){d=-1;target=pl;}
  if(d){if(isMss){trend=d;lastMss=target;if(p.mode!=='Historical'){o.lines=o.lines.filter(x=>!x.structure);lastBos=null;}}else lastBos=target;line(o,target.index,i,target.price,isMss?'MSS':'BOS',d>0?'#00e6a1':'#e60400',{knownIndex:i,structure:true,dashed:!isMss});event(o,isMss?'MSS':'BOS',i,{side:d,price:target.price,origin:target.index});}
  if(i>=k-1&&p.displacement!=='Off'){const body=bodies[i],mean=bodies.slice(i-k+1,i+1).reduce((x,y)=>x+y,0)/k,bodyOnly=b.high-Math.max(b.close,b.open)<body*.36&&Math.min(b.close,b.open)-b.low<body*.36;if(i>=start&&body>mean&&bodyOnly){const up=b.close>b.open;if(up)o.plots.up[i]=b.low;else o.plots.down[i]=b.high;o.markers.push({time:b.time,position:up?'belowBar':'aboveBar',shape:'circle',color:up?'#00ff00':'#ff0000',text:''});}}
  const length=p.obLength??10,j=i-length;if(j>=0){const xs=bs.slice(j+1,i+1),next=bs[j].high>Math.max(...xs.map(x=>x.high))?0:bs[j].low<Math.min(...xs.map(x=>x.low))?1:leg;if(next!==leg){const v={price:next===0?bs[j].high:bs[j].low,index:j,crossed:false};if(next===0)top=v;else btm=v;}leg=next;}
  if(i>=start&&i>0)for(const side of [1,-1]){const swing=side>0?top:btm,arr=obs[side>0?0:1];if(swing&&!swing.crossed&&(side>0?b.close>swing.price:b.close<swing.price)){swing.crossed=true;let best=i-1;for(let j=i-1;j>swing.index;j--){const v=p.body==='Off'?(side>0?bs[j].low:bs[j].high):(side>0?Math.min(bs[j].open,bs[j].close):Math.max(bs[j].open,bs[j].close));const old=p.body==='Off'?(side>0?bs[best].low:bs[best].high):(side>0?Math.min(bs[best].open,bs[best].close):Math.max(bs[best].open,bs[best].close));if(side>0?v<=old:v>=old)best=j;}const z={start:best,end:i,top:p.body==='Off'?bs[best].high:Math.max(bs[best].open,bs[best].close),bottom:p.body==='Off'?bs[best].low:Math.min(bs[best].open,bs[best].close),knownIndex:i,dir:side,color:side>0?'#3e89fa':'#ff3131',alpha:.15,breaker:false};arr.unshift(z);event(o,'ICT_OB',i,{side,top:z.top,bottom:z.bottom,origin:best});}
   for(let x=arr.length-1;x>=0;x--){const z=arr[x];if(!z.breaker){if(side>0?Math.min(b.close,b.open)<z.bottom:Math.max(b.close,b.open)>z.top){z.breaker=true;z.breakIndex=i;}}else if(side>0?b.close>z.top:b.close<z.bottom)arr.splice(x,1);}
  }
 }
 for(const arr of obs)for(const z of arr.slice(0,1)){o.zones.push({...z,end:bs.length+10,alpha:z.breaker?.08:.15,color:z.breaker?(z.dir>0?'#4785f9':'#f9ff57'):z.color,text:z.breaker?'ICT Breaker':'ICT OB'});}
 return o;
}
function formatVolume(v){return Math.abs(v)>=1e6?(v/1e6).toFixed(2)+'M':Math.abs(v)>=1e3?(v/1e3).toFixed(2)+'K':v.toFixed(0);}
function runLuxStudy(id,bars,params={}){const count=params.latest==='Exclude latest'?Math.max(0,bars.length-1):bars.length,bs=bars.slice(0,count);for(let i=0;i<bs.length;i++){const b=bs[i];if(!['time','open','high','low','close'].every(k=>Number.isFinite(b[k]))||(i&&b.time<=bs[i-1].time))throw Error('Invalid candle input');}let result;
 switch(id){case 'liquidity-swings':result=swings(bs,params);break;case 'buyside-sellside':result=clusteredLiquidity(bs,params);break;case 'liquidity-sweeps':result=sweeps(bs,params);break;case 'liquidity-pools':result=pools(bs,params);break;case 'smc':result=smc(bs,params);break;case 'ict-concepts':result=ict(bs,params);break;default:throw Error('Unknown LuxAlgo study');}
 return {value:bars.map(()=>null),...result,luxStudy:{id,zones:result.zones,lines:result.lines,labels:result.labels,parameters:params,barCount:bs.length},markers:result.markers};}

export default {name:"Liquidity Pools [LuxAlgo] · local",overlay:true,inputs:[{"key":"contacts","label":"contacts","default":2,"type":"int","min":0,"max":1000000},{"key":"gap","label":"gap","default":5,"type":"int","min":0,"max":1000000},{"key":"confirm","label":"confirm","default":10,"type":"int","min":0,"max":1000000},{"key":"volumeLabels","label":"volume Labels","default":"On","type":"select","options":["On","Off"]},{"key":"labelSize","label":"label Size","default":"Small","type":"select","options":["Tiny","Small","Normal"]},{"key":"latest","label":"Candle availability","type":"select","options":["All completed","Exclude latest"],"default":"Exclude latest"}],outputs:[{key:'value',label:'Drawing layer',color:'#089981'}],calc(bars,p){return runLuxStudy("liquidity-pools",bars,{...{"contacts":2,"gap":5,"confirm":10,"volumeLabels":"On","labelSize":"Small","fillCandles":"Off"},...p});}};
