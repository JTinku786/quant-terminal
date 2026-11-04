import {VolumeProfile} from './volume-profile.js';
export class NextCandleOverlay extends VolumeProfile {
  constructor(pane,data){super(pane);this.data=data;this._view.zOrder=()=> 'top';}
  draw(ctx,size){
    if(!this.series)return;
    const {points,last,parameters:p}=this.data,ts=this.pane.chart.timeScale(),px=i=>ts.logicalToCoordinate(i),py=v=>this.series.priceToCoordinate(v);
    ctx.save();
    if(p.showTrendFill==='On')for(let j=1;j<points.length;j++){
      const a=points[j-1],b=points[j];if(a.up!==b.up)continue;
      const x=px(a.i),z=px(b.i),ys=[py(a.line),py(b.line),py(b.middle),py(a.middle)];
      if(x==null||z==null||ys.some(y=>y==null)||z<0||x>size.width)continue;
      ctx.fillStyle=b.up?'rgba(8,153,129,.13)':'rgba(242,54,69,.13)';ctx.beginPath();ctx.moveTo(x,ys[0]);ctx.lineTo(z,ys[1]);ctx.lineTo(z,ys[2]);ctx.lineTo(x,ys[3]);ctx.closePath();ctx.fill();
    }
    ctx.font='11px Segoe UI, sans-serif';
    if(last&&p.showProjection==='On'){
      const x=px(last.i+1),end=px(last.i+8),y=py(last.close);
      if(x!=null&&end!=null&&y!=null&&x<size.width){
        ctx.fillStyle='rgba(252,208,175,.12)';ctx.fillRect(x,0,end-x,size.height);
        ctx.setLineDash([4,4]);ctx.strokeStyle='#787b86';ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,size.height);ctx.stroke();ctx.setLineDash([]);
        const scale=last.regime==='HIGH'?1.5:last.regime==='LOW'?.7:1;
        for(const [offset,pct,bull] of [[3,last.lp,true],[5,last.sp,false]]){
          const left=px(last.i+offset),right=px(last.i+offset+1),tip=last.close+(bull?1:-1)*last.atr*2*scale*pct/100,t=py(tip),wick=py(tip+(bull?1:-1)*last.body*.4);
          if([left,right,t,wick].some(v=>v==null))continue;
          ctx.fillStyle=ctx.strokeStyle=bull?'#089981':'#f23645';ctx.fillRect(left,Math.min(y,t),Math.max(3,right-left),Math.max(2,Math.abs(y-t)));ctx.beginPath();ctx.moveTo((left+right)/2,y);ctx.lineTo((left+right)/2,wick);ctx.stroke();ctx.fillText(`${pct}% scenario`,left-20,bull?wick-7:wick+14);
        }
      }
    }
    if(p.showTable==='On'){
      const w=Math.min(330,size.width-16),x=size.width-w-8,y=12,row=18;
      ctx.fillStyle='#131722';ctx.fillRect(x,y,w,405);ctx.strokeStyle='#787b86';ctx.strokeRect(x,y,w,405);ctx.fillStyle='#f0b90b';ctx.fillText('NEXT CANDLE · DIRECTIONAL SCORES',x+9,y+16);
      if(!last){ctx.fillStyle='#ddd';ctx.fillText('Warming up: needs more completed candles',x+9,y+43);ctx.restore();return;}
      ctx.fillStyle='#aaa';ctx.fillText(`ATR ${last.regime} · ${last.volumeAvailable?'Completed candles':'Volume unavailable'}`,x+9,y+32);
      for(const [j,label,pct,scores,conf,strong,color] of [[0,'LONG',last.lp,last.L,last.lc,last.long,'#089981'],[1,'SHORT',last.sp,last.S,last.sc,last.short,'#f23645']]){
        const top=y+43+j*166;ctx.fillStyle=color;ctx.fillRect(x+1,top,w-2,22);ctx.fillStyle='white';ctx.fillText(`${label} ANALYSIS`,x+8,top+15);ctx.fillText(`${pct}% score`,x+w-86,top+15);
        const labels=['TREND','MACD','EST. PRESSURE','RSI','STOCH','ADX','VOLUME'];
        scores.forEach((v,k)=>{const yy=top+34+k*row;ctx.fillStyle='#d1d4dc';ctx.fillText(labels[k],x+8,yy);ctx.fillStyle='#343842';ctx.fillRect(x+112,yy-8,90,7);ctx.fillStyle=color;ctx.fillRect(x+112,yy-8,.9*v,7);ctx.fillStyle='#b2b5be';const text=k===3?last.rsi.toFixed(0):k===5?last.adx.toFixed(0):k===6?`${last.vr.toFixed(1)}x`:`${v}/100`;ctx.fillText(text,x+215,yy);});
        ctx.fillStyle=strong?color:'#b2b5be';ctx.fillText(`Confluence ${conf}/8 · ${strong?'STRONG SETUP':'WAIT'}`,x+8,top+160);
      }
      ctx.fillStyle='#aaa';ctx.fillText('Scores are not probabilities. OHLCV pressure.',x+8,y+390);
    }
    ctx.restore();
  }
}
