import {VolumeProfile} from './volume-profile.js';
export class FluxBlockOverlay extends VolumeProfile{
  constructor(pane,data){super(pane);this.data=data;}
  draw(ctx,size){const d=this.data,p=d.parameters,ts=this.pane.chart.timeScale();ctx.save();ctx.font='10px -apple-system, Segoe UI, sans-serif';
    for(const z of d.zones){const left=ts.logicalToCoordinate(z.knownIndex),end=ts.logicalToCoordinate(z.active?d.lastIndex+p.extension:z.invalidIndex),top=this.series.priceToCoordinate(z.top),bot=this.series.priceToCoordinate(z.bottom);if(left==null||end==null||top==null||bot==null||bot<0||top>size.height||end<0||left>size.width)continue;
      const x=Math.max(0,left),right=Math.min(size.width,end),w=right-x,h=bot-top;if(w<=0||h<=0)continue;const bull=z.isBull,color=bull?'#00897b':'#d32f2f',fraction=z.bullPct/100;
      ctx.fillStyle=z.active?(bull?'rgba(0,137,123,.11)':'rgba(211,47,47,.11)'):'rgba(120,120,120,.08)';ctx.fillRect(x,top,w,h);ctx.strokeStyle=color;ctx.lineWidth=1;ctx.strokeRect(x,top,w,h);
      if(p.delta==='On'){
        ctx.fillStyle='rgba(0,137,123,.32)';if(p.style==='Vertical')ctx.fillRect(x,top,w*fraction,h);else ctx.fillRect(x,top,w,h*fraction);
        ctx.fillStyle='rgba(211,47,47,.28)';if(p.style==='Vertical')ctx.fillRect(x+w*fraction,top,w*(1-fraction),h);else ctx.fillRect(x,top+h*fraction,w,h*(1-fraction));
        if(p.threeD==='On'){const dx=3*p.depth,dy=-2*p.depth;ctx.fillStyle=bull?'rgba(0,137,123,.18)':'rgba(211,47,47,.18)';ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x+dx,top+dy);ctx.lineTo(right+dx,top+dy);ctx.lineTo(right,top);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(right,top);ctx.lineTo(right+dx,top+dy);ctx.lineTo(right+dx,bot+dy);ctx.lineTo(right,bot);ctx.closePath();ctx.fill();ctx.stroke();}
      }
      const vol=z.totalVol>=1000000?(z.totalVol/1000000).toFixed(1)+'M':z.totalVol>=1000?(z.totalVol/1000).toFixed(1)+'K':Math.round(z.totalVol).toString();
      const label=`Flux ${bull?'Bull':'Bear'} OB · ${z.session}`;ctx.fillStyle='rgba(255,255,255,.93)';ctx.fillRect(x+2,top-13,Math.min(w,ctx.measureText(label).width+6),13);ctx.fillStyle=color;ctx.fillText(label,x+4,top-3);
      if(p.delta==='On'){const text=z.hasDelta?`Vol ${vol} · up ${z.bullPct}% / other ${z.bearPct}%`:'No source volume';ctx.fillStyle='#37474f';ctx.fillText(text,x+4,bot+11);}
    }
    ctx.restore();
  }
}
