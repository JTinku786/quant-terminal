import {VolumeProfile} from './volume-profile.js';
export class IctEngineOverlay extends VolumeProfile {
  constructor(pane,data){super(pane);this.data=data;this._view.zOrder=()=> 'top';}
  draw(ctx,size){
    if(!this.series)return;const d=this.data,ts=this.pane.chart.timeScale(),range=ts.getVisibleLogicalRange();if(!range)return;
    ctx.save();ctx.font='10px -apple-system, Segoe UI, sans-serif';
    if(d.parameters.showZones!=='Off')for(const z of d.zones){const x=ts.logicalToCoordinate(z.born),y1=this.series.priceToCoordinate(z.top),y2=this.series.priceToCoordinate(z.btm);if(x==null||y1==null||y2==null)continue;const left=Math.max(0,x),w=size.width-left;const bull=z.dir>0;ctx.fillStyle=z.fvg?(bull?'rgba(41,98,255,.08)':'rgba(255,152,0,.08)'):(bull?'rgba(0,150,100,.07)':'rgba(220,50,50,.07)');ctx.fillRect(left,y1,w,y2-y1);ctx.strokeStyle=bull?'#00897b':'#d26969';ctx.setLineDash(z.breaker?[5,4]:z.touched?[1,3]:[]);ctx.strokeRect(left,y1,w,y2-y1);ctx.setLineDash([]);ctx.fillStyle=ctx.strokeStyle;ctx.fillText((z.setup?'SETUP ':'')+(z.fvg?'FVG':z.kind|| (z.breaker?'Breaker':'OB')),left+3,y1+11);}
    const trade=d.trades.at(-1);if(trade&&d.parameters.showTrades!=='Off'){
      const values=[['ENTRY',trade.entry,'#37474f'],['SL',trade.sl,'#d32f2f'],...trade.targets.map((p,k)=>['TP'+(k+1),p,'#00897b'])];
      ctx.textAlign='right';for(const [name,price,color]of values){const y=this.series.priceToCoordinate(price);if(y==null||y<12||y>size.height-8)continue;const rr=name.startsWith('TP')?' · '+(trade.dir*(price-trade.entry)/trade.risk).toFixed(2)+'R':'';const text=name+' '+price.toFixed(d.parameters.tick<.001?5:2)+rr;const width=ctx.measureText(text).width+8;ctx.fillStyle='rgba(255,255,255,.92)';ctx.fillRect(size.width-width,y-12,width,13);ctx.fillStyle=color;ctx.fillText(text,size.width-3,y-2);}}
    ctx.textAlign='left';ctx.fillStyle='rgba(255,255,255,.94)';ctx.fillRect(5,size.height-47,Math.min(size.width-10,320),42);ctx.fillStyle='#37474f';ctx.fillText('ICT-SE local · WillyAlgoTrader source adaptation',9,size.height-34);ctx.fillText(`Virtual trades ${d.stats.trades} · TP1 wins ${d.stats.authorWins} · ambiguous ${d.stats.ambiguousTrades}`,9,size.height-21);ctx.fillText('NY day / local HTF clock · parity not certified',9,size.height-8);ctx.restore();
  }
}
