import test from 'node:test';import assert from 'node:assert/strict';
import ind from '../custom/sniper-khansaab.js';import {ta} from '../public/lib/indicators.js';
const bars=Array.from({length:200},(_,i)=>{const c=100+Math.sin(i/9)*5;return {time:1700000100+i*300,open:c-.1,high:c+1,low:c-1,close:c,volume:100+i%13};});
test('EMA crossover signals match crossover math and do not imply fills',()=>{const r=ind.calc(bars,{chartSeconds:300},ta),fast=ta.ema(bars.map(x=>x.close),9),mid=ta.ema(bars.map(x=>x.close),21);for(let i=1;i<bars.length-1;i++){assert.equal(r.buy[i],+(fast[i]>mid[i]&&fast[i-1]<=mid[i-1]));assert.equal(r.sell[i],+(fast[i]<mid[i]&&fast[i-1]>=mid[i-1]));}assert.equal(r.sl,undefined);assert.equal(r.tp,undefined);});
test('default ignores forming bar; prefix signals remain causal',()=>{const a=ind.calc(bars.slice(0,120),{chartSeconds:300,latest:'All completed'},ta),b=ind.calc(bars,{chartSeconds:300,latest:'All completed'},ta);for(const k of ['buy','sell','retest','bullScore','bearScore'])assert.deepEqual(a[k],b[k].slice(0,120));const c=structuredClone(bars);c.at(-1).close=999;assert.deepEqual(ind.calc(bars,{chartSeconds:300},ta),ind.calc(c,{chartSeconds:300},ta));});
test('score needs actual confirmed previous 5m RSI, never chart RSI substituted',()=>{const r=ind.calc(bars,{chartSeconds:900},ta);assert.ok(r.sniper.history.every(x=>!x.ready));const five=ind.calc(bars,{chartSeconds:300},ta);assert.equal(five.sniper.last.five,ta.rsi(bars.slice(0,-1).map(x=>x.close),14).at(-2));assert.ok(five.sniper.last.ready);});
test('missing 5m intervals and zero volume disable complete scores',()=>{const gap=structuredClone(bars);gap.at(-2).time+=300*5;gap.at(-1).time+=300*5;assert.equal(ind.calc(gap,{chartSeconds:300},ta).sniper.last.ready,false);assert.equal(ind.calc(bars.map(x=>({...x,volume:0})),{chartSeconds:300},ta).sniper.last.ready,false);});
test('VWAP resets on selected calendar session and uses typical-price volume',()=>{const b=[{time:Date.parse('2026-11-02T23:55:00Z')/1000,open:10,high:12,low:8,close:10,volume:10},{time:Date.parse('2026-11-03T00:00:00Z')/1000,open:20,high:22,low:18,close:20,volume:20}];assert.deepEqual(ind.calc(b,{timezone:'UTC',latest:'All completed'},ta).vwap,[10,20]);});
test('daily bars use the final confirmed intraday context before market closure',()=>{
 const day=Date.parse('2026-11-02T00:00:00Z')/1000;
 const five=bars.slice(0,70).map((b,i)=>({...b,time:day+14*3600+i*300}));
 const daily=bars.slice(0,70).map((b,i)=>({...b,time:day-(69-i)*86400}));
 const r=ind.calc(daily,{latest:'All completed',chartSeconds:86400,fiveMinuteBars:five},ta);
 assert.equal(r.sniper.last.five,ta.rsi(five.map(b=>b.close),14).at(-2));assert.ok(r.sniper.last.ready);
 const next=ind.calc([...daily,{...daily.at(-1),time:day+86400}],{latest:'All completed',chartSeconds:86400,fiveMinuteBars:five},ta);
 assert.equal(next.sniper.last.ready,false);
});
