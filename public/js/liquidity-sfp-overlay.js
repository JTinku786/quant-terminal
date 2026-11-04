import {VolumeProfile} from './volume-profile.js';
export class LiquiditySfpOverlay extends VolumeProfile{
 constructor(pane,data){super(pane);this.data=data;}
 draw(ctx,size){if(!this.series)return;const ts=this.pane.chart.timeScale(),colors={'Asia':'#e3c64c','London':'#35bdae','NY AM':'#f4a64b','NY PM':'#d37cda','Outside':'#9ca7b7'};ctx.save();ctx.font='10px Segoe UI, sans-serif';
 for(const l of this.data.levels){const x=ts.logicalToCoordinate(l.knownIndex),z=ts.logicalToCoordinate(l.active?this.data.lastIndex+15:l.end),y=this.series.priceToCoordinate(l.price);if([x,z,y].some(v=>v==null)||y<0||y>size.height||z<0||x>size.width)continue;
 ctx.strokeStyle=l.kind==='SFP'?'#d988ff':l.kind==='X'?'#f0b90b':l.kind==='MSS'?'#65b5ff':colors[l.session];ctx.lineWidth=l.active?2:1;ctx.setLineDash(l.kind==='X'?[2,4]:l.kind==='SFP'?[6,4]:[]);ctx.beginPath();ctx.moveTo(Math.max(0,x),y);ctx.lineTo(Math.min(size.width,z),y);ctx.stroke();
 if(l.active){const label=`${l.high?'High':'Low'} ${l.price.toPrecision(6)} · ${l.session}`,w=ctx.measureText(label).width+8,left=Math.max(0,Math.min(size.width-w,z-w));ctx.fillStyle='#131722';ctx.fillRect(left,y-16,w,14);ctx.fillStyle=colors[l.session];ctx.fillText(label,left+4,y-5);}
 }ctx.restore();}
}
