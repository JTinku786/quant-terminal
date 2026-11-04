// Apply a four-timeframe research layout; preserve the preceding layout as a separate backup.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {replayRev} from '../public/lib/ict-rev.js';
import {buildTradeSetups} from '../public/lib/ict-trade-visuals.js';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const base='http://127.0.0.1:3777';
const prepared=JSON.parse(fs.readFileSync(path.join(root,'data/ict-workspace/prepared.json')));
const r=await fetch(base+'/api/state');if(!r.ok)throw new Error('Local app is unavailable');
const state=await r.json();
const backup=path.join(root,'data/ict-workspace',`layout-before-${Date.now()}.json`);
fs.writeFileSync(backup,JSON.stringify(state,null,2));
const snapshot=JSON.parse(fs.readFileSync(path.join(root,'public/ict',prepared.symbol+'.json')));
const trades=buildTradeSetups(snapshot,replayRev(snapshot));
let uid=0;
const indicator=(id,params)=>({uid:`ict-workspace-${++uid}`,id:'custom:'+id,params:{lastBar:'All supplied bars completed',...params}});
const context=(params)=>indicator('ict-context-'+prepared.symbol.toLowerCase(),{swingBars:2,...params});
const fvg=(seconds,mid)=>indicator(mid?'ict-fvg-midpoints':'ict-fvg-zones',{seconds,minBps:0});
const sessions=()=>indicator('ict-sessions',{labels:'On'});
const studies=[
  [context({reference:'Weekly',swings:'On',equilibrium:'On',marks:'Off'}),fvg(86400,true)],
  [context({reference:'Off',swings:'On',equilibrium:'On',marks:'On'}),fvg(3600,false)],
  [context({reference:'Daily',swings:'Off',equilibrium:'Off',marks:'Off'}),fvg(1800,true),sessions()],
  [context({reference:'Daily',swings:'Off',equilibrium:'Off',marks:'On'}),fvg(300,true),sessions()],
];
const panes=prepared.panes.map((p,i)=>({symbol:p.symbol,tf:p.tf,type:'candles',compare:[],log:false,indicators:studies[i],
  ictTradeSetups:i===3?trades.map(t=>({...t,symbol:p.symbol})):[],
  ictRole:['Daily liquidity context','1H structure and FVG','30m setup and session map','5m entry review'][i]}));
const next={...state,layout:'4',panes,active:3,settings:{...state.settings,theme:'light',chartStyle:'ict',bars:20000,utc:false,volume:false,syncSymbol:false,syncCrosshair:true,syncReplay:false},ictWorkspace:prepared};
const applied=await fetch(base+'/api/state',{method:'PUT',headers:{'Content-Type':'application/json','x-qt':'1'},body:JSON.stringify(next)});
if(!applied.ok)throw new Error(await applied.text());
console.log(JSON.stringify({layout:'4',panes:panes.map(p=>({symbol:p.symbol,tf:p.tf,indicators:p.indicators.map(x=>x.id)})),backup},null,2));
