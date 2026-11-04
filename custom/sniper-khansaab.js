// JavaScript adaptation of the public Sniper V.02 Community Version.
// Original © KhanSaab 2026. https://www.tradingview.com/script/HBDcHSB7/
// Published community source has no SL/TP engine. No fills are simulated here.
export function calculate(bars,params,ta){
 const p={latest:'Exclude latest',position:'Bottom left',ribbon:'On',table:'On',timezone:'America/New_York',...params};
 const n=p.latest==='All completed'?bars.length:Math.max(0,bars.length-1),b=bars.slice(0,n),c=b.map(x=>x.close),v=b.map(x=>Number.isFinite(x.volume)?x.volume:NaN);
 const fast=ta.ema(c,9),mid=ta.ema(c,21),slow=ta.ema(c,50),rsi=ta.rsi(c,14),macd=ta.macd(c),adx=ta.dmi(b).adx,volAvg=ta.sma(v,20);
 const f=p.chartSeconds===300?b:(p.fiveMinuteBars||[]),fr=ta.rsi(f.map(x=>x.close),14);
 const out=Object.fromEntries(['fast','mid','slow','vwap','buy','sell','retest','bullScore','bearScore'].map(k=>[k,Array(bars.length).fill(NaN)]));
 const fmt=new Intl.DateTimeFormat('en-CA',{timeZone:p.timezone,year:'numeric',month:'2-digit',day:'2-digit'});
 let session='',pv=0,vol=0,state=0,last=null,j=-1;
 const points=[],markers=[],history=[];
 for(let i=0;i<n;i++){
  const x=b[i],day=fmt.format(new Date(x.time*1000));if(day!==session){pv=0;vol=0;session=day;}
  if(Number.isFinite(v[i])&&v[i]>0){pv+=(x.high+x.low+x.close)/3*v[i];vol+=v[i];}
  const vw=vol>0?pv/vol:NaN;
  const buy=i>0&&fast[i]>mid[i]&&fast[i-1]<=mid[i-1]&&state<=0,sell=i>0&&fast[i]<mid[i]&&fast[i-1]>=mid[i-1]&&state>=0;
  if(buy||sell)state=buy?1:-1;
  const retest=state===1?x.low<=fast[i]&&x.low>mid[i]:state===-1&&x.high>=fast[i]&&x.high<mid[i];
  const end=x.time+(p.chartSeconds||0);
  while(j+1<f.length&&f[j+1].time+300<=end)j++;
  // Pine uses RSI(close[1],14): the previous RSI in the confirmed 5m context.
  // A missing 5m interval must not carry an old RSI across a data gap.
  // Higher-timeframe bars end after the market's session closes. Use the last
  // confirmed 5m context inside this bar, not a fictitious bar at midnight.
  const contextInBar=p.chartSeconds>=300?j>=0&&f[j].time>=x.time:j>=0&&f[j].time+300>end-300;
  const five=j>=1&&contextInBar&&f[j].time-f[j-1].time===300?fr[j-1]:NaN;
  const ready=p.chartSeconds>0&&Number.isFinite(five)&&[vw,rsi[i],adx[i],volAvg[i]].every(Number.isFinite)&&volAvg[i]>0;
  const count=a=>a.filter(Boolean).length;
  const bull=ready?100*count([c[i]>vw,rsi[i]>50,macd.macd[i]>macd.signal[i],fast[i]>mid[i],adx[i]>25&&c[i]>fast[i],v[i]>volAvg[i]&&c[i]>x.open,five>50])/7:NaN;
  const bear=ready?100*count([c[i]<vw,rsi[i]<50,macd.macd[i]<macd.signal[i],fast[i]<mid[i],adx[i]>25&&c[i]<fast[i],v[i]>volAvg[i]&&c[i]<x.open,five<50])/7:NaN;
  for(const [key,value] of Object.entries({fast:fast[i],mid:mid[i],slow:slow[i],vwap:vw,buy:+buy,sell:+sell,retest:+retest,bullScore:bull,bearScore:bear}))out[key][i]=value;
  if(buy||sell)markers.push({time:x.time,position:buy?'belowBar':'aboveBar',shape:buy?'arrowUp':'arrowDown',color:buy?'#089981':'#f23645',text:buy?'Sniper BUY':'Sniper SELL'});
  if(retest&&!buy&&!sell)markers.push({time:x.time,position:state===1?'belowBar':'aboveBar',shape:'circle',color:'#ff9800',text:'Retest'});
  last={i,time:x.time,bull,bear,rsi:rsi[i],five,adx:adx[i],ready,bias:ready?(bull-bear>=40?'STRONG BULL':bear-bull>=40?'STRONG BEAR':bull>bear?'MILD BULL':'MILD BEAR'):'DATA INCOMPLETE'};
  points.push({i,fast:fast[i],mid:mid[i],signal:buy||sell,retest,open:x.open,close:x.close});history.push(last);
 }
 return {...out,markers,sniper:{points,last,history,parameters:p}};
}
export default {name:'Sniper Entry/Exit · KhanSaab V.02 Community',overlay:true,
 inputs:[{key:'position',label:'Analysis panel position',type:'select',default:'Bottom left',options:['Top left','Top right','Bottom left','Bottom right']},{key:'timezone',label:'VWAP calendar session timezone',type:'select',default:'America/New_York',options:['America/New_York','Asia/Kolkata','UTC']},...['ribbon','table'].map(key=>({key,label:key==='ribbon'?'EMA ribbon':'Score panel',type:'select',default:'On',options:['On','Off']})),{key:'latest',label:'Candle availability',type:'select',default:'Exclude latest',options:['Exclude latest','All completed']}],
 outputs:[{key:'fast',label:'EMA 9',color:'#089981'},{key:'mid',label:'EMA 21',color:'#f23645'},{key:'slow',label:'EMA 50',color:'#2962ff',lineWidth:2},{key:'vwap',label:'Session VWAP',color:'#b06eff',lineWidth:2},...['buy','sell','retest','bullScore','bearScore'].map(key=>({key,label:key,hidden:true}))],calc:calculate};
