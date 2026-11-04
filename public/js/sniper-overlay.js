import {VolumeProfile} from './volume-profile.js';
export class SniperOverlay extends VolumeProfile{
 constructor(pane,data){super(pane);this.data=data;this._view.zOrder=()=> 'top';}
 draw(ctx,size){if(!this.series)return;const {points,last,parameters:p}=this.data,ts=this.pane.chart.timeScale(),px=i=>ts.logicalToCoordinate(i),py=v=>this.series.priceToCoordinate(v);ctx.save();
 if(p.ribbon==='On')for(let j=1;j<points.length;j++){const a=points[j-1],b=points[j],x=px(a.i),z=px(b.i),ys=[py(a.fast),py(b.fast),py(b.mid),py(a.mid)];if(x==null||z==null||ys.some(y=>y==null)||z<0||x>size.width)continue;ctx.fillStyle=b.fast>b.mid?'rgba(8,153,129,.18)':'rgba(242,54,69,.18)';ctx.beginPath();ctx.moveTo(x,ys[0]);ctx.lineTo(z,ys[1]);ctx.lineTo(z,ys[2]);ctx.lineTo(x,ys[3]);ctx.closePath();ctx.fill();}
 // Overlay bodies only; the original chart's wicks/borders remain visible.
 for(const b of points){if(!b.signal&&!b.retest)continue;const x=px(b.i),next=px(b.i+1),o=py(b.open),c=py(b.close);if([x,next,o,c].some(v=>v==null)||x<0||x>size.width)continue;const w=Math.max(2,Math.abs(next-x)*.65);ctx.fillStyle=b.signal?'#111111':'#ff9800';ctx.fillRect(x-w/2,Math.min(o,c),w,Math.max(2,Math.abs(o-c)));ctx.strokeStyle=b.close>=b.open?'#089981':'#f23645';ctx.strokeRect(x-w/2,Math.min(o,c),w,Math.max(2,Math.abs(o-c)));}
 if(p.table==='On'){
 const w=Math.min(320,size.width-24),h=195,x=p.position.endsWith('right')?size.width-w-12:12,y=p.position.startsWith('Bottom')?Math.max(12,size.height-h-48):12;
 ctx.fillStyle='#131722';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#515764';ctx.strokeRect(x,y,w,h);
 ctx.beginPath();ctx.rect(x+6,y+4,w-12,h-8);ctx.clip();ctx.font='11px Segoe UI, sans-serif';ctx.textBaseline='middle';
 const text=(s,xx,yy,max)=>{s=String(s);while(ctx.measureText(s).width>max&&s.length>1)s=s.slice(0,-2)+'…';ctx.fillText(s,xx,yy);};
 ctx.fillStyle='#f0b90b';text('SNIPER V.02 · KhanSaab Community',x+10,y+17,w-20);
 const rows=[['BULL SCORE',last?.ready?`${Math.round(last.bull)}%`:'Waiting for data'],['BEAR SCORE',last?.ready?`${Math.round(last.bear)}%`:'Waiting for data'],['MARKET BIAS',last?.ready?last.bias:'Not scored'],['PREVIOUS 5m RSI',Number.isFinite(last?.five)?last.five.toFixed(1):'No matching 5m bars'],['VWAP SESSION',p.timezone.replace('America/New_York','New York').replace('Asia/Kolkata','India')]];
 rows.forEach(([k,v],i)=>{ctx.fillStyle=i===0?'#30c8ac':i===1?'#ff6b79':'#d1d4dc';text(k,x+10,y+43+i*23,135);text(v,x+150,y+43+i*23,w-160);});
 ctx.fillStyle='#9299a9';text('Completed candles · lagging signals',x+10,y+166,w-20);text('Community source: no SL/TP engine',x+10,y+182,w-20);
 }
 ctx.restore();}
}
