import test from 'node:test';
import assert from 'node:assert/strict';
import indicator from '../custom/next-candle-predictor.js';
import {ta} from '../public/lib/indicators.js';
const bars=Array.from({length:350},(_,i)=>{const c=100+i*.04+Math.sin(i/7)*4;return {time:1700000000+i*300,open:c-.3,high:c+1,low:c-1,close:c,volume:100+i%19};});
test('directional scores normalize and stay in bounds after warmup',()=>{
 const r=indicator.calc(bars,{},ta);assert.ok(r.nextCandle.history.length>100);
 for(const h of r.nextCandle.history){assert.equal(h.lp+h.sp,100);assert.ok(h.lp>=0&&h.lp<=100);assert.ok(h.lc>=0&&h.lc<=8);assert.ok(h.sc>=0&&h.sc<=8);}
 assert.ok(Number.isNaN(r.longPct.at(-1)));assert.equal(r.nextCandle.lastIndex,bars.length-2);
});
test('future candles cannot change historical scores or signals',()=>{
 const a=indicator.calc(bars.slice(0,200),{latest:'All completed'},ta),b=indicator.calc(bars,{latest:'All completed'},ta);
 for(const key of ['longPct','shortPct','buy','sell','longSetup','shortSetup','trendUp','trendDown'])assert.deepEqual(a[key],b[key].slice(0,200));
});
test('forming candle changes have no effect in default mode',()=>{
 const a=indicator.calc(bars,{},ta),changed=structuredClone(bars);Object.assign(changed.at(-1),{close:999,high:1000,volume:999999});
 assert.deepEqual(a,indicator.calc(changed,{},ta));
});
test('zero volume suppresses strong setups and has an explicit status',()=>{
 const r=indicator.calc(bars.map(b=>({...b,volume:0})),{},ta);
 assert.equal(r.nextCandle.last.volumeAvailable,false);assert.ok(r.nextCandle.history.every(x=>!x.long&&!x.short));
});
test('short histories are a warmup rather than fabricated probabilities',()=>{
 assert.equal(indicator.calc(bars.slice(0,50),{},ta).nextCandle.last,null);
});
