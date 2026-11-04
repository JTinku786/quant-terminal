// Adaptation of wut_trader's ICT Liquidity Sweep/Swing Fail Pattern V.1.
// Source https://www.tradingview.com/script/e0Zbp2mn/
// Source internal title: SMC Target Liquidity V.35 (Manual Distance Control).
export function classify(level,bar,previous,isHigh){
 if(!previous)return null;
 if(isHigh){if(bar.close<level&&previous.close>level)return 'SFP';if(bar.close>level&&previous.close>level&&bar.close>previous.close)return 'MSS';if(bar.high>=level&&bar.close<level)return 'X';}
 else{if(bar.close>level&&previous.close<level)return 'SFP';if(bar.close<level&&previous.close<level&&bar.close<previous.close)return 'MSS';if(bar.low<=level&&bar.close>level)return 'X';}
 return null;
}
export function calculate(bars,params={}){
 const p={period:10,maxActive:5,timezone:'UTC-4',showX:'On',showSfp:'On',showMss:'On',latest:'Exclude latest',...params};
 const n=p.latest==='All completed'?bars.length:Math.max(0,bars.length-1),levels=[],events=[],markers=[];
 const out=Object.fromEntries(['sweepHigh','sweepLow','sfpHigh','sfpLow','breakHigh','breakLow'].map(k=>[k,Array(bars.length).fill(0)]));
 const zone=p.timezone==='UTC-4'?'Etc/GMT+4':p.timezone==='UTC-5'?'Etc/GMT+5':p.timezone;
 const fmt=new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const session=t=>{const parts=Object.fromEntries(fmt.formatToParts(new Date(t*1000)).map(x=>[x.type,x.value])),m=+parts.hour*60+(+parts.minute);return m>=810&&m<960?'NY PM':m>=510&&m<660?'NY AM':m>=120&&m<300?'London':m>=1200?'Asia':'Outside';};
 for(let i=0;i<n;i++){
  const pivot=i-p.period;
  if(pivot>=p.period)for(const high of [false,true]){
   const key=high?'high':'low',price=bars[pivot][key];let ok=true;
   for(let j=pivot-p.period;j<=i;j++)if(j!==pivot&&(high?(j<pivot?bars[j][key]>price:bars[j][key]>=price):(j<pivot?bars[j][key]<price:bars[j][key]<=price))){ok=false;break;}
   if(ok){levels.push({id:`${pivot}-${high}`,price,high,pivotIndex:pivot,knownIndex:i,knownAt:bars[i].time,session:session(bars[pivot].time),active:true});const active=levels.filter(x=>x.active&&x.high===high);if(active.length>p.maxActive){active[0].active=false;active[0].expired=true;active[0].end=i;}}
  }
  for(const l of levels)if(l.active){const kind=classify(l.price,bars[i],bars[i-1],l.high);if(!kind)continue;l.active=false;l.kind=kind;l.end=i;
   const event={...l,index:i,time:bars[i].time};events.push(event);
   const key=(kind==='X'?'sweep':kind==='SFP'?'sfp':'break')+(l.high?'High':'Low');out[key][i]=1;
   const show=p[kind==='X'?'showX':kind==='SFP'?'showSfp':'showMss']==='On';
   if(show)markers.push({time:bars[i].time,position:l.high?'aboveBar':'belowBar',shape:'circle',color:kind==='X'?'#f0b90b':kind==='SFP'?'#d988ff':'#65b5ff',text:kind==='MSS'?'Break (MSS*)':kind});
  }
 }
 // Retired history has its own rendering cap; never drop a still-active target.
 const visible=levels.filter(x=>!x.active&&!x.expired).slice(-300).concat(levels.filter(x=>x.active));
 return {...out,markers:markers.slice(-200),liquiditySfp:{levels:visible,events,parameters:p,lastIndex:n-1}};
}
export default {name:'ICT Target Liquidity · Sweep / SFP · wut_trader',overlay:true,
 inputs:[{key:'period',label:'Pivot confirmation bars each side',type:'int',default:10,min:2,max:100},{key:'maxActive',label:'Active levels per side',type:'int',default:5,min:1,max:20},{key:'timezone',label:'Session timezone',type:'select',default:'UTC-4',options:['UTC-4','UTC-5','America/New_York','Asia/Bangkok']},...['showX','showSfp','showMss'].map(key=>({key,label:{showX:'Sweep X labels',showSfp:'SFP labels',showMss:'Breakout labels (source MSS)'}[key],type:'select',default:'On',options:['On','Off']})),{key:'latest',label:'Candle availability',type:'select',default:'Exclude latest',options:['Exclude latest','All completed']}],
 outputs:['sweepHigh','sweepLow','sfpHigh','sfpLow','breakHigh','breakLow'].map(key=>({key,label:key,hidden:true})),calc:calculate};
