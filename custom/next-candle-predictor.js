// Local JavaScript adaptation of Next Candle Predictor V4.1 by
// Ceyhun C. Canbazoglu / PredictaFutures, published at:
// https://www.tradingview.com/script/YoDyGsjT/
// Directional scores are rule-based confluence, not probabilities.
// Estimated pressure uses candle position and volume, not bid/ask delta.
export function calculate(bars, params, ta) {
  const p = {atrLength:14, stFactor:3, stPeriod:10, minConfluence:5,
    minVolumeRatio:0.8, adxThreshold:25, latest:'Exclude latest',
    showTable:'On', showProjection:'On', showTrendFill:'On', ...params};
  const n = p.latest === 'All completed' ? bars.length : Math.max(0,bars.length-1);
  const b = bars.slice(0,n), close=b.map(x=>x.close), volume=b.map(x=>Number.isFinite(x.volume)?x.volume:NaN);
  const trendAtr=ta.atr(b,p.stPeriod), atr=ta.atr(b,p.atrLength);
  const e8=ta.ema(close,8), e21=ta.ema(close,21), e50=ta.ema(close,50);
  const rsi=ta.rsi(close,14), macd=ta.macd(close,12,26,9), adx=ta.dmi(b,14,14).adx;
  const k=b.map((x,i)=>{if(i<13)return NaN;const w=b.slice(i-13,i+1), hi=Math.max(...w.map(y=>y.high)),lo=Math.min(...w.map(y=>y.low));return hi>lo?100*(x.close-lo)/(hi-lo):NaN;});
  const kd=ta.sma(k,3), vs=ta.sma(volume,20), body=ta.sma(b.map(x=>Math.abs(x.close-x.open)),5);
  const delta=b.map((x,i)=>x.high>x.low?volume[i]*(2*x.close-x.low-x.high)/(x.high-x.low):0*volume[i]), de=ta.ema(delta,10);
  const keys=['trendUp','trendDown','longPct','shortPct','buy','sell','longSetup','shortSetup','trendChange'];
  const out=Object.fromEntries(keys.map(key=>[key,Array(bars.length).fill(NaN)]));
  const markers=[], points=[], history=[];
  let upper=NaN,lower=NaN,direction=1,prevLong=false,prevShort=false;
  for(let i=0;i<n;i++) {
    const x=b[i], rawUp=(x.high+x.low)/2+p.stFactor*trendAtr[i],rawLo=(x.high+x.low)/2-p.stFactor*trendAtr[i];
    const pu=Number.isFinite(upper)?upper:rawUp,pl=Number.isFinite(lower)?lower:rawLo,old=direction;
    lower=i&&close[i-1]>pl?Math.max(rawLo,pl):rawLo;
    upper=i&&close[i-1]<pu?Math.min(rawUp,pu):rawUp;
    direction=old===-1?(x.close<lower?1:-1):(x.close>upper?-1:1);
    const up=direction===-1,line=up?lower:upper,changed=i>0&&direction!==old;
    if(Number.isFinite(line)){out[up?'trendUp':'trendDown'][i]=line;points.push({i,line,up,middle:(x.open+x.close)/2});}
    // Full 100-observation ATR rank warmup; never use future observations.
    const window=atr.slice(Math.max(0,i-99),i+1);
    if(window.length<100||!window.every(Number.isFinite)||![rsi[i],k[i],kd[i],adx[i],vs[i],de[i]].every(Number.isFinite))continue;
    const rank=100*window.filter(v=>v<=atr[i]).length/100,regime=rank>75?'HIGH':rank<25?'LOW':'MEDIUM',mult=rank>75?.85:rank<25?1.15:1;
    const volumeAvailable=window.length===100&&Number.isFinite(volume[i])&&vs[i]>0;
    const vr=volumeAvailable?volume[i]/vs[i]:1, dm=delta[i]>de[i], bullish=delta[i]>0,bearish=delta[i]<0;
    const m=macd.macd[i],s=macd.signal[i],h=macd.hist[i],r=rsi[i],st=k[i],sd=kd[i],a=adx[i];
    const vol=vr>2?100:vr>1.5?80:vr>1?60:vr>.8?45:25,ax=a>35?100:a>30?85:a>25?70:a>20?50:30;
    const L=[up?(e8[i]>e21[i]?(e21[i]>e50[i]?100:80):60):0,
      m>s&&h>0?100:m>s?70:h>0?50:20,bullish&&dm?100:bullish?75:delta[i]>-Math.abs(de[i])?40:20,
      r<30?100:r<40?85:r<50?70:r<60?50:25,st>sd?(st<20?100:st<50?85:65):25,ax,vol];
    const S=[!up?(e8[i]<e21[i]?(e21[i]<e50[i]?100:80):60):0,
      m<s&&h<0?100:m<s?70:h<0?50:20,bearish&&!dm?100:bearish?75:delta[i]<Math.abs(de[i])?40:20,
      r>70?100:r>60?85:r>50?70:r>40?50:25,st<sd?(st>80?100:st>50?85:65):25,ax,vol];
    const weights=[.23,.18,.15,.12,.12,.10,.10],score=v=>Math.round(Math.min(100,Math.max(0,v.reduce((t,z,j)=>t+z*weights[j],0)*mult)));
    const ls=score(L),ss=score(S),lp=ls+ss?Math.round(100*ls/(ls+ss)):50,sp=100-lp;
    const count=v=>v.filter(Boolean).length;
    const lc=count([up,e8[i]>e21[i],m>s,st>sd,vr>=p.minVolumeRatio,a>p.adxThreshold,r>50,bullish]);
    const sc=count([!up,e8[i]<e21[i],m<s,st<sd,vr>=p.minVolumeRatio,a>p.adxThreshold,r<50,bearish]);
    const threshold=a>30?55:a>25?60:a>20?65:70;
    const long=volumeAvailable&&up&&lp>=threshold&&lc>=p.minConfluence&&vr>=p.minVolumeRatio&&r>50&&bullish;
    const short=volumeAvailable&&!up&&sp>=threshold&&sc>=p.minConfluence&&vr>=p.minVolumeRatio&&r<50&&bearish;
    const buy=volumeAvailable&&i>0&&e8[i]>e21[i]&&e8[i-1]<=e21[i-1]&&up&&bullish;
    const sell=volumeAvailable&&i>0&&e8[i]<e21[i]&&e8[i-1]>=e21[i-1]&&!up&&bearish;
    for(const [key,value] of Object.entries({longPct:lp,shortPct:sp,buy:+buy,sell:+sell,longSetup:+(long&&!prevLong),shortSetup:+(short&&!prevShort),trendChange:+changed}))out[key][i]=value;
    const mark=(text,bull,color,shape='arrowUp')=>markers.push({time:x.time,position:bull?'belowBar':'aboveBar',shape:bull?shape:shape==='arrowUp'?'arrowDown':shape,color,text});
    if(buy)mark('BUY',true,'#089981');if(sell)mark('SELL',false,'#f23645');
    if(long&&!prevLong)mark('◆ Strong',true,'#f0b90b','circle');if(short&&!prevShort)mark('◆ Strong',false,'#f0b90b','circle');
    if(changed)mark(up?'Trend up':'Trend down',up,up?'#089981':'#f23645','circle');
    const snapshot={i,time:x.time,close:x.close,atr:atr[i],body:body[i],regime,lp,sp,lc,sc,long,short,L,S,rsi:r,adx:a,vr,delta:delta[i],up,volumeAvailable};
    history.push(snapshot);prevLong=long;prevShort=short;
  }
  return {...out,markers,nextCandle:{points,last:history.at(-1)||null,history,parameters:p,lastIndex:n-1}};
}
export default {
  name:'Next Candle Predictor · PredictaFutures',overlay:true,
  inputs:[{key:'atrLength',label:'ATR period',type:'int',default:14,min:5,max:50},{key:'stFactor',label:'Trend factor',type:'float',default:3,min:1,max:5},{key:'stPeriod',label:'Trend ATR period',type:'int',default:10,min:5,max:30},
    {key:'minConfluence',label:'Minimum confluence / 8',type:'int',default:5,min:3,max:8},{key:'minVolumeRatio',label:'Minimum relative volume',type:'float',default:.8,min:.5,max:2},{key:'adxThreshold',label:'ADX threshold',type:'int',default:25,min:15,max:40},
    ...['showTable','showProjection','showTrendFill'].map(key=>({key,label:{showTable:'Analysis table',showProjection:'Scenario candles',showTrendFill:'Trend fill'}[key],type:'select',default:'On',options:['On','Off']})),
    {key:'latest',label:'Candle availability',type:'select',default:'Exclude latest',options:['Exclude latest','All completed']}],
  outputs:[{key:'trendUp',label:'Up trend',color:'#089981',lineWidth:2},{key:'trendDown',label:'Down trend',color:'#f23645',lineWidth:2},
    ...['longPct','shortPct','buy','sell','longSetup','shortSetup','trendChange'].map(key=>({key,label:key,hidden:true}))],
  calc:calculate,
};
