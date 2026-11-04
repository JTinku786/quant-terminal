import fs from 'node:fs';
const root='http://127.0.0.1:3777';
const core=fs.readFileSync('public/lib/luxalgo-suite.js','utf8').replace(/export (function|const) /g,'$1 ');
const strategy=fs.readFileSync('public/lib/liquidity-pullback.js','utf8').replace(/^import .*;\r?\n/,'').replace(/export function /g,'function ');
const inputs=[{key:'wait',label:'Candles allowed after area contact',type:'int',min:1,max:3,default:3},{key:'rr',label:'Reward / risk (minimum 1.7)',type:'float',min:1.7,max:20,default:1.7},{key:'stopMode',label:'Stop location',type:'select',options:['Farther','Initial','Swing'],default:'Farther'},{key:'touchMode',label:'Area contact',type:'select',options:['Touch','Sweep'],default:'Touch'},{key:'visible',label:'Positions shown',type:'int',min:1,max:50,default:8}];
const code=core+'\n'+strategy+'\nexport default '+`{name:'Liquidity Displacement Pullback · experimental',overlay:true,inputs:${JSON.stringify(inputs)},outputs:[{key:'value',label:'Positions',color:'#00d6a0'}],calc(bars,p){return liquidityTradeDrawing(bars,runLiquidityPullback(bars,p),p.visible??8);}};`;
fs.writeFileSync('custom/liquidity-pullback.js',code);
const r=await fetch(root+'/api/custom',{method:'POST',headers:{'Content-Type':'application/json','x-qt':'1'},body:JSON.stringify({name:'liquidity-pullback',code})});if(!r.ok)throw Error(await r.text());console.log(await r.text());
