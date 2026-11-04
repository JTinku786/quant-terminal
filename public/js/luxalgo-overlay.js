import {VolumeProfile} from './volume-profile.js';
export class LuxAlgoOverlay extends VolumeProfile {
 constructor(pane,data){super(pane);this.data=data;}
 autoscaleInfo(from,to){
  if(this.data.id!=='liquidity-pullback')return null;
  const prices=this.data.lines.filter(l=>l.end>=from&&l.start<=to).map(l=>l.price);
  return prices.length?{priceRange:{minValue:Math.min(...prices),maxValue:Math.max(...prices)}}:null;
 }
 draw(ctx,size){const ts=this.pane.chart.timeScale(),range=ts.getVisibleLogicalRange();if(!range||!this.series)return;const x=i=>ts.logicalToCoordinate(i),y=price=>this.series.priceToCoordinate(price);ctx.save();ctx.font='10px -apple-system, Segoe UI, sans-serif';
  for(const z of this.data.zones.slice(-500)){if(z.end<range.from||z.start>range.to)continue;const xa=x(z.start),xb=x(z.end),ya=y(z.top),yb=y(z.bottom);if([xa,xb,ya,yb].some(v=>v==null))continue;const color=z.color||'#089981',alpha=z.alpha??.20;ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.fillRect(xa,ya,xb-xa,yb-ya);ctx.globalAlpha=1;if(z.text){ctx.fillStyle=color;ctx.fillText(z.text,Math.max(3,xa+3),ya-3);}}
  for(const l of this.data.lines.slice(-500)){if(l.hidden||l.price==null||l.end<range.from||l.start>range.to)continue;const xa=x(l.start),xb=x(l.end),yy=y(l.price);if(xa==null||xb==null||yy==null)continue;ctx.strokeStyle=l.color||'#089981';ctx.lineWidth=1;ctx.setLineDash(l.dashed?[3,3]:[]);ctx.beginPath();ctx.moveTo(xa,yy);ctx.lineTo(xb,yy);ctx.stroke();ctx.setLineDash([]);if(l.text){ctx.fillStyle=l.color||'#089981';ctx.font=(l.small?'9':'10')+'px -apple-system, Segoe UI, sans-serif';ctx.fillText(l.text,Math.max(2,(xa+xb)/2),yy-3);}}
  for(const l of this.data.labels.slice(-500)){if(l.index<range.from||l.index>range.to)continue;const xx=x(l.index),yy=y(l.price);if(xx==null||yy==null)continue;ctx.fillStyle=l.color||'#089981';ctx.font=(l.size||10)+'px -apple-system, Segoe UI, sans-serif';ctx.fillText(l.text,xx,yy-4);}
  ctx.restore();
 }
}
