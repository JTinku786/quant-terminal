import fs from 'node:fs';import {validateIndicator} from '../public/lib/indicators.js';import {fluxIndicator} from '../public/lib/flux-order-blocks.js';
validateIndicator(fluxIndicator);
const code=fs.readFileSync('public/lib/flux-order-blocks.js','utf8').replace(/export (const|function) /g,'$1 ')+'\nexport default fluxIndicator;\n';
const base='http://127.0.0.1:3777';const registered=await fetch(base+'/api/custom',{method:'POST',headers:{'Content-Type':'application/json','x-qt':'1'},body:JSON.stringify({name:'flux-order-blocks',code})});if(!registered.ok)throw Error(await registered.text());console.log(await registered.json());
const state=await(await fetch(base+'/api/state')).json();fs.mkdirSync('data/layouts',{recursive:true});fs.writeFileSync('data/layouts/before-flux-'+Date.now()+'.json',JSON.stringify(state,null,2));
const pane=state.panes.find(p=>p.tf==='5m');if(!pane)throw Error('5m pane missing');
pane.indicators=pane.indicators.filter(x=>x.id!=='custom:flux-order-blocks');
// Keep the earlier strategy's signals but use Flux for the visible OB boxes.
for(const ind of pane.indicators)if(ind.id==='custom:ict-structure-engine')ind.params={...ind.params,showZones:'Off'};
pane.indicators.push({uid:'flux-all-sessions-5m',id:'custom:flux-order-blocks',params:{latest:'All completed',swing:5,nearest:3,threeD:'On',delta:'On'}});
pane.ictRole='5m · Flux OB, all sessions + ICT-SE';state.active=state.panes.indexOf(pane);
const r=await fetch(base+'/api/state',{method:'PUT',headers:{'Content-Type':'application/json','x-qt':'1'},body:JSON.stringify(state)});if(!r.ok)throw Error(await r.text());fs.writeFileSync('data/layouts/ict-flux-all-sessions.json',JSON.stringify(state,null,2));console.log('Flux added to 5m, no session filter. Quarterly daily + 1h VP retained.');
