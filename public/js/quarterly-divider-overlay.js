import {VolumeProfile} from './volume-profile.js';
export class QuarterlyDividerOverlay extends VolumeProfile {
  constructor(pane,data){super(pane);this.data=data;}
  draw(ctx,size){
    const scale=this.pane.chart.timeScale(),range=scale.getVisibleLogicalRange();if(!range)return;
    ctx.save();ctx.strokeStyle=this.data.color;ctx.fillStyle=this.data.color;ctx.lineWidth=Math.max(1,Math.min(5,this.data.width));ctx.font='11px -apple-system, Segoe UI, sans-serif';
    for(const e of this.data.events){if(e.index<range.from-1||e.index>range.to+1)continue;const x=scale.logicalToCoordinate(e.index);if(x==null)continue;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,size.height);ctx.stroke();
      if(this.data.labels){const w=ctx.measureText(e.label).width+8,left=Math.max(0,Math.min(size.width-w,x+4));ctx.fillStyle='rgba(255,255,255,.94)';ctx.fillRect(left,size.height-19,w,16);ctx.fillStyle=this.data.color;ctx.fillText(e.label,left+4,size.height-7);}}
    ctx.restore();
  }
}
