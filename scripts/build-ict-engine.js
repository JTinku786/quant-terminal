import fs from 'node:fs';
const module=fs.readFileSync('public/lib/ict-structure-engine.js','utf8').replace(/export (const|function) /g,'$1 ');
const settings={
 external:['External swing bars',3,50],internal:['Internal swing bars',2,10],poolLength:['Liquidity swing bars',2,30],
 zoneAtr:['Zone ATR period',5,200],riskAtr:['Risk ATR period',5,50],htfLength:['HTF swing bars',2,30],sweepWindow:['Sweep to CHoCH window',1,100],ttl:['Retest expiry bars',1,300],
 minGap:['Minimum FVG / ATR',0,2],equalTolerance:['Equal-level tolerance / ATR',.01,1],maxZoneAtr:['Maximum OB / ATR',0,5],tick:['Minimum price tick',.000001,100],
 stopMode:['Stop method',['Wick-Anchored','Zone-Anchored','Sweep-Anchored','ATR']],preset:['Risk preset',['Balanced','Conservative','Aggressive','Scalping']],tpMode:['Targets',['R-Multiples','Liquidity','Std Deviations']],
 entryArray:['Entry zone',['FVG first','OB first','FVG only','OB only']],entryFilter:['Entry location',['Discount / Premium','OTE (≥ 62%)','Off']],timeFilter:['Setup time',['Killzones','Silver Bullet','Off']],biasFilter:['Daily bias filter',['Off','With bias only','Not against bias']],
 breakConfirmation:['Break confirmation',['Close','Wick']],obFrom:['OB source',['External','Internal']],obEdge:['OB edge',['Body','Wick']],obInvalidation:['OB invalidation',['Close','Wick','50%']],fill:['FVG filled at',['Full','50%','Touch']],
 latest:['Candle availability',['Exclude latest','All completed']],
};
const defs=(await import('../public/lib/ict-structure-engine.js')).engineDefaults;
for(const k of ['htf','obOn','fvgOn','breakers','requireObFvg','shrink','displacement','be','showInternal','showStructure','showSweeps','showSetups','showTrades','showZones'])settings[k]=[k.replace(/([A-Z])/g,' $1'),['On','Off']];
const inputs=Object.entries(settings).map(([key,[label,min,max]])=>({key,label,default:defs[key],...(Array.isArray(min)?{type:'select',options:min}:{type:Number.isInteger(defs[key])?'int':'float',min,max})}));
const outputs=[['entry','Entry','#37474f'],['stop','Stop','#d32f2f'],['tp1','TP1','#00897b'],['tp2','TP2','#00897b'],['tp3','TP3','#00897b'],['equilibrium','Equilibrium','#9e9e9e']].map(([key,label,color])=>({key,label,color}));
outputs.push({key:'buy',label:'Buy signal (0/1)',color:'#00897b',hidden:true},{key:'sell',label:'Sell signal (0/1)',color:'#d32f2f',hidden:true});
const code=module+'\nexport default '+`{name:'ICT-SE · WillyAlgoTrader (local adaptation)',overlay:true,inputs:${JSON.stringify(inputs)},outputs:${JSON.stringify(outputs)},calc(bars,p){const result=runStructureEngine(bars,{...p,seconds:p.chartSeconds||300});if(p.showTrades==='Off')for(const k of ['entry','stop','tp1','tp2','tp3'])result[k]=bars.map(()=>null);return {...result,ictEngine:result};}};\n`;
fs.writeFileSync('custom/ict-structure-engine.js',code);
console.log('Built standalone local custom indicator');
