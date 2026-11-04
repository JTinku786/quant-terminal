import test from 'node:test';import assert from 'node:assert/strict';import {calculate,classify} from '../custom/ict-liquidity-sfp.js';
const b=(i,c,h=c+1,l=c-1)=>({time:1700000000+i*300,open:c,close:c,high:h,low:l,volume:100});
test('source classification priority distinguishes sweep, SFP and breakout',()=>{
 assert.equal(classify(10,b(2,9,11),b(1,11),true),'SFP');
 assert.equal(classify(10,b(2,12,13),b(1,11),true),'MSS');
 assert.equal(classify(10,b(2,9,11),b(1,9),true),'X');
 assert.equal(classify(10,b(2,11,12,9),b(1,9),false),'SFP');
 assert.equal(classify(10,b(2,8,9,7),b(1,9),false),'MSS');
 assert.equal(classify(10,b(2,11,12,9),b(1,11),false),'X');
});
test('pivot is unavailable until right-side confirmation and no line begins at historical pivot',()=>{
 const bars=[b(0,10),b(1,12),b(2,15),b(3,12),b(4,11)];
 assert.equal(calculate(bars.slice(0,4),{period:2,latest:'All completed'}).liquiditySfp.levels.length,0);
 const r=calculate(bars,{period:2,latest:'All completed'}).liquiditySfp.levels;
 assert.equal(r.length,1);assert.equal(r[0].pivotIndex,2);assert.equal(r[0].knownIndex,4);
});
test('historical event arrays do not change when future candles arrive',()=>{
 const bars=Array.from({length:200},(_,i)=>b(i,100+Math.sin(i/3)*7));
 const a=calculate(bars.slice(0,100),{period:2,latest:'All completed'}),r=calculate(bars,{period:2,latest:'All completed'});
 for(const key of ['sweepHigh','sweepLow','sfpHigh','sfpLow','breakHigh','breakLow'])assert.deepEqual(a[key],r[key].slice(0,100));
});
test('forming candle is ignored and active levels are capped per side',()=>{
 const bars=Array.from({length:200},(_,i)=>b(i,100+Math.sin(i/3)*7)),copy=structuredClone(bars);copy.at(-1).high=999;
 assert.deepEqual(calculate(bars,{period:2,maxActive:2}),calculate(copy,{period:2,maxActive:2}));
 const levels=calculate(bars,{period:2,maxActive:2}).liquiditySfp.levels.filter(x=>x.active);for(const high of [true,false])assert.ok(levels.filter(x=>x.high===high).length<=2);
});
test('new confirmed pivots evict the oldest active target first, not the nearest',()=>{
 const highs=[105,108,120,108,105,105,108,118,108,105,105,108,116,108,105,105,108,114,108,105];
 for(const high of [true,false]){
  const bars=highs.map((h,i)=>b(i,100,high?h:101,high?99:200-h));
  const before=calculate(bars.slice(0,18),{period:2,maxActive:2,latest:'All completed'}).liquiditySfp.levels.filter(x=>x.active&&x.high===high);
  assert.deepEqual(before.map(x=>x.pivotIndex),[7,12]);
  const after=calculate(bars,{period:2,maxActive:2,latest:'All completed'}).liquiditySfp.levels.filter(x=>x.active&&x.high===high);
  assert.deepEqual(after.map(x=>x.pivotIndex),[12,17]);
 }
});
