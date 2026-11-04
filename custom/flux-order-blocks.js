// This file is subject to MPL 2.0: https://mozilla.org/MPL/2.0/
// Original © fluxchart. JavaScript adaptation from Order Blocks Volume Delta 3D.
// https://www.tradingview.com/script/EtDoAmOi-Order-Blocks-Volume-Delta-3D-Flux-Charts/
const fluxDefaults={swing:5,invalidation:'Wick',nearest:3,extension:10,hideInvalid:'On',retests:'On',delta:'On',depth:3,threeD:'On',style:'Vertical',latest:'Exclude latest',seconds:300};
function fluxPivot(bars,i,k,high){const j=i-k;if(j<k)return null;const field=high?'high':'low',v=bars[j][field];for(let x=j-k;x<=i;x++)if(x!==j&&(high?(bars[x][field]>v||(x>j&&bars[x][field]===v)):(bars[x][field]<v||(x>j&&bars[x][field]===v))))return null;return {index:j,price:v};}
function fluxPoc(bars,from,to,bins=40){
  if(from==null||to<=from||from<0||to>=bars.length)return null;
  let min=Infinity,max=-Infinity;for(let j=from;j<=to;j++){min=Math.min(min,bars[j].low);max=Math.max(max,bars[j].high);}if(!(max>min))return null;
  const step=(max-min)/bins,counts=Array(bins).fill(0);let best=0,bestCount=0;
  for(let j=from;j<=to;j++){const start=Math.max(0,Math.min(bins-1,Math.floor((bars[j].low-min)/step))),end=Math.max(0,Math.min(bins-1,Math.floor((bars[j].high-min)/step)));for(let k=start;k<=end;k++)counts[k]++;}
  for(let k=0;k<bins;k++)if(counts[k]>bestCount){bestCount=counts[k];best=k;}
  const price=min+(best+.5)*step;let total=0,bull=0,bear=0,touches=0;
  for(let j=from;j<=to;j++){const b=bars[j];if(b.low<=price&&b.high>=price){touches++;const v=Number.isFinite(b.volume)?Math.max(0,b.volume):0;total+=v;if(b.close>b.open)bull+=v;else if(b.close<b.open)bear+=v;}}
  return {price,touches,total,bull,bear,bin:best,step,min,max,bestCount};
}
function fluxAnchor(bars,from,to,poc,bull){let best=null,extreme=null;for(let j=to;j>=from;j--){const b=bars[j];extreme=extreme==null?(bull?b.low:b.high):bull?Math.min(extreme,b.low):Math.max(extreme,b.high);if(b.low<=poc&&b.high>=poc&&(bull?b.low===extreme:b.high===extreme))best=j;}if(best==null)return null;for(let j=best+1;j<=to;j++)if(bull?bars[j].low>bars[j-1].high:bars[j].high<bars[j-1].low)return null;return best;}
function fluxSession(time){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(time*1000)).filter(x=>x.type!=='literal').map(x=>[x.type,+x.value]));const m=parts.hour*60+parts.minute;return m>=1200?'Asia':m>=120&&m<300?'London':m>=420&&m<600?'NY AM':m>=810&&m<960?'NY PM':'Other hours';}
function runFlux(bars,params={}){
  const p={...fluxDefaults,...params};if(!Number.isInteger(p.swing)||p.swing<1||p.swing>100)throw Error('Swing length must be 1–100');
  const n=p.latest==='All completed'?bars.length:Math.max(0,bars.length-1),obs=[],events=[],markers=[],history=[];
  const out=Object.fromEntries(['bullBlock','bearBlock','bullRetest','bearRetest'].map(k=>[k,Array(bars.length).fill(0)]));
  let hi=null,lo=null,pending=null,lastBull=-Infinity,lastBear=-Infinity;
  for(let i=0;i<n;i++){
    const b=bars[i];if(!['time','open','high','low','close'].every(k=>Number.isFinite(b[k]))||(i&&b.time<=bars[i-1].time)||b.high<Math.max(b.open,b.close)||b.low>Math.min(b.open,b.close)||b.low>b.high)throw Error('Invalid or unordered OHLC');
    const ph=fluxPivot(bars,i,p.swing,true),pl=fluxPivot(bars,i,p.swing,false);if(ph)hi=ph;if(pl)lo=pl;
    const now={bear:lo&&i>lo.index&&i>0&&b.close<lo.price&&bars[i-1].close>=lo.price,bull:hi&&i>hi.index&&i>0&&b.close>hi.price&&bars[i-1].close<=hi.price,fromBear:lo?.index,fromBull:hi?.index};
    if(pending)for(const bull of [false,true])if(pending[bull?'bull':'bear']){
      const from=pending[bull?'fromBull':'fromBear'],to=i-1,poc=fluxPoc(bars,from,to);
      if(poc?.touches){const anchor=fluxAnchor(bars,from,to,poc.price,bull);if(anchor!=null){const x=bars[anchor];if(!obs.some(z=>z.active&&x.high>=z.bottom&&x.low<=z.top)){
        const z={id:`flux-${to}-${bull?1:-1}`,leftIndex:anchor,leftTime:x.time,createdIndex:to,createdTime:bars[to].time,knownIndex:i,knownAt:b.time,top:x.high,bottom:x.low,isBull:bull,active:true,retested:false,bullVol:poc.bull,bearVol:poc.bear,totalVol:poc.total,hasDelta:poc.total>0,bullPct:poc.total>0?Math.round(100*poc.bull/poc.total):50,poc:poc.price,fromIndex:from,session:fluxSession(b.time)};
        z.bearPct=100-z.bullPct;obs.unshift(z);history.push({...z});events.push({kind:'CREATE',index:i,knownAt:b.time,...z});out[bull?'bullBlock':'bearBlock'][i]=1;
        for(let j=obs.length-1;j>=0;j--)if(obs[j].leftIndex<Math.max(0,i-4999))obs.splice(j,1);
        while(obs.length>50){let j=obs.findLastIndex(z=>!z.active);obs.splice(j<0?obs.length-1:j,1);}
      }}}
      if(bull)hi=null;else lo=null;
    }
    for(const z of obs)if(z.active){const prior=bars[i-1];let invalid=false;if(p.invalidation==='Wick')invalid=z.isBull?b.low<z.bottom:b.high>z.top;else if(prior)invalid=z.isBull?prior.close<z.bottom:prior.close>z.top;
      if(invalid){z.active=false;z.invalidIndex=p.invalidation==='Wick'?i:i-1;z.invalidKnownAt=b.time+(p.invalidation==='Wick'?p.seconds:0);events.push({kind:'INVALIDATE',id:z.id,index:i,knownAt:z.invalidKnownAt,invalidIndex:z.invalidIndex});}
      if(prior){const retest=z.isBull?prior.open>z.top&&prior.close>z.top&&prior.low<=z.top&&prior.low>=z.bottom:prior.open<z.bottom&&prior.close<z.bottom&&prior.high>=z.bottom&&prior.high<=z.top;
        if(retest&&i-1>z.createdIndex){z.retested=true;z.retestIndex=i-1;const last=z.isBull?lastBull:lastBear;if(i-1-last>=4){events.push({kind:'RETEST',id:z.id,index:i,barIndex:i-1,knownAt:b.time,isBull:z.isBull,top:z.top,bottom:z.bottom});out[z.isBull?'bullRetest':'bearRetest'][i]=1;if(z.isBull)lastBull=i-1;else lastBear=i-1;if(p.retests==='On')markers.push({time:prior.time,position:z.isBull?'belowBar':'aboveBar',shape:z.isBull?'arrowUp':'arrowDown',color:z.isBull?'#00897b':'#d32f2f',text:'Flux retest'});}}
      }
    }
    pending=now;
  }
  const price=bars[Math.max(0,n-1)]?.close??0,distance=z=>price>z.top?price-z.top:price<z.bottom?z.bottom-price:0;
  const selected=[true,false].flatMap(bull=>obs.filter(z=>z.isBull===bull&&(p.hideInvalid==='Off'||z.active)).map((z,order)=>({z,order})).sort((a,b)=>distance(a.z)-distance(b.z)||a.order-b.order).slice(0,p.nearest).map(x=>({...x.z})));
  return {...out,markers:markers.slice(-100),fluxBlocks:{zones:selected,parameters:p,lastIndex:n-1,created:history.length,active:obs.filter(z=>z.active).length},events,history};
}
const fluxIndicator={name:'Flux Charts · Order Blocks Volume Delta 3D (local)',overlay:true,
  inputs:[{key:'swing',label:'Swing length',type:'int',default:5,min:1,max:100},{key:'invalidation',label:'Invalidation',type:'select',default:'Wick',options:['Wick','Close']},{key:'nearest',label:'Nearest blocks per side',type:'int',default:3,min:1,max:20},{key:'extension',label:'Extend by candles',type:'int',default:10,min:0,max:100},{key:'hideInvalid',label:'Hide invalidated blocks',type:'select',default:'On',options:['On','Off']},{key:'retests',label:'Retest labels',type:'select',default:'On',options:['On','Off']},{key:'delta',label:'Candle-direction volume estimate',type:'select',default:'On',options:['On','Off']},{key:'threeD',label:'3D faces',type:'select',default:'On',options:['On','Off']},{key:'depth',label:'3D depth',type:'int',default:3,min:1,max:5},{key:'style',label:'Volume split style',type:'select',default:'Vertical',options:['Vertical','Horizontal']},{key:'latest',label:'Candle availability',type:'select',default:'Exclude latest',options:['Exclude latest','All completed']}],
  outputs:[{key:'bullBlock',label:'Bullish block event',hidden:true,color:'#00897b'},{key:'bearBlock',label:'Bearish block event',hidden:true,color:'#d32f2f'},{key:'bullRetest',label:'Bullish retest event',hidden:true,color:'#00897b'},{key:'bearRetest',label:'Bearish retest event',hidden:true,color:'#d32f2f'}],
  calc(bars,p){return runFlux(bars,{...p,seconds:p.chartSeconds||300});},
};

export default fluxIndicator;
