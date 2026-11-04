import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeIctContext,makeIctFvg,makeIctSessions,nyClock} from '../public/lib/ict-studies.js';
import {validateIndicator} from '../public/lib/indicators.js';
const base=1800000000;
const b=(i,o,h,l,c)=>({time:base+i*300,open:o,high:h,low:l,close:c,volume:0});
const completed={lastBar:'All supplied bars completed'};

test('all native ICT definitions pass the terminal custom-indicator contract',()=>{
  for(const d of [makeIctContext(),makeIctFvg(),makeIctFvg(true),makeIctSessions()]) {
    assert.equal(validateIndicator(d).name,d.name);
  }
});
test('confirmed swing appears only after the required right-hand candles close',()=>{
  const bars=[b(0,2,3,1,2),b(1,4,5,2,4),b(2,7,10,3,7),b(3,5,6,2,5),b(4,3,4,1,3),b(5,10,12,8,11)];
  const d=makeIctContext(),r=d.calc(bars,{...completed,swingBars:2});
  assert.deepEqual(r.high.slice(0,4),[null,null,null,null]);assert.equal(r.high[4],10);
  assert.equal(r.events.find(e=>e.kind==='CLOSE_BREAK_UP').time,bars[5].time);
  assert.equal(d.calc(bars.slice(0,5),{swingBars:2}).high[4],null);
});
test('daily/weekly reference levels cannot appear before their source completion',()=>{
  const d=makeIctContext({daily:[{knownAt:base+600,high:20,low:5}],weekly:[{knownAt:base+900,high:30,low:4}]});
  const bars=Array.from({length:5},(_,i)=>b(i,10,11,9,10));
  assert.deepEqual(d.calc(bars,{...completed,reference:'Daily'}).referenceHigh,[null,null,20,20,20]);
  assert.deepEqual(d.calc(bars,{...completed,reference:'Weekly'}).referenceHigh,[null,null,null,30,30]);
});
test('bull and bear FVG use the exact first/third candle bounds and third close availability',()=>{
  const bull=[b(0,9,10,8,9),b(1,10,13,9,12),b(2,13,15,12,14)];
  const r=makeIctFvg().calc(bull,{...completed,seconds:300});
  assert.equal(r.bullLow[1],null);assert.equal(r.bullLow[2],10);assert.equal(r.bullHigh[2],12);
  assert.equal(r.events[0].knownAt,base+900);
  assert.equal(makeIctFvg().calc(bull,{seconds:300}).bullLow[2],null);
  const bear=[b(0,14,15,13,14),b(1,12,14,10,11),b(2,9,10,8,9)];
  const br=makeIctFvg().calc(bear,{...completed,seconds:300});
  assert.equal(br.bearLow[2],10);assert.equal(br.bearHigh[2],13);
});
test('symbol-bound reference levels fail closed on a different chart or missing symbol context',()=>{
  const d=makeIctContext({symbol:'NZDUSD',symbolIdentifiers:['CSV:ICT_NZDUSD_M5'],daily:[{knownAt:base,high:20,low:5}],weekly:[]});
  const bars=[b(0,10,11,9,10)];
  assert.equal(d.calc(bars,{...completed,reference:'Daily'}).referenceHigh[0],null);
  assert.equal(d.calc(bars,{...completed,reference:'Daily',chartSymbol:'US:AAPL'}).referenceHigh[0],null);
  assert.equal(d.calc(bars,{...completed,reference:'Daily',chartSymbol:'CSV:ICT_NZDUSD_M5'}).referenceHigh[0],20);
});
test('FVG gaps do not bridge missing source candles; a full fill stops the active band',()=>{
  const bars=[b(0,9,10,8,9),b(1,10,13,9,12),b(2,13,15,12,14),b(3,12,14,10,11)];
  const r=makeIctFvg().calc(bars,{...completed,seconds:300});assert.equal(r.bullLow[3],null);
  const gap=bars.slice(0,3).map(x=>({...x}));gap[2].time+=300;
  assert.equal(makeIctFvg().calc(gap,{...completed,seconds:300}).events.length,0);
});
test('New York session clock follows daylight saving changes',()=>{
  const summer=Date.parse('2026-10-23T06:00:00Z')/1000,winter=Date.parse('2026-11-03T07:00:00Z')/1000;
  assert.equal(nyClock(summer).minute,120);assert.equal(nyClock(winter).minute,120);
  const d=makeIctSessions();
  for(const time of [summer,winter]) {
    const r=d.calc([{time,open:10,high:11,low:9,close:10}],completed);
    assert.equal(r.markers[0].text,'London 02 NY');
  }
});
test('observed Asia range accumulates only during 20–00 NY; midnight open is known at its open',()=>{
  const stamps=['2026-10-23T00:00:00Z','2026-10-23T00:30:00Z','2026-10-23T04:00:00Z'];
  const bars=stamps.map((x,i)=>({time:Date.parse(x)/1000,open:100+i,high:[105,107,120][i],low:[99,98,90][i],close:102}));
  const r=makeIctSessions().calc(bars,completed);
  assert.deepEqual(r.asiaHigh,[105,107,107]);assert.deepEqual(r.asiaLow,[99,98,98]);assert.equal(r.midnight[2],102);
});
test('adding future candles does not alter past numerical outputs or detection events',()=>{
  const bars=Array.from({length:80},(_,i)=>{const o=100+Math.sin(i/3)*3;return b(i,o,o+1,o-1,o+.2);});
  for(const d of [makeIctContext(),makeIctFvg(),makeIctSessions()]) {
    const full=d.calc(bars,{...completed,swingBars:2,seconds:300});
    for(const n of [12,23,51]) {
      const prefix=d.calc(bars.slice(0,n),{...completed,swingBars:2,seconds:300});
      for(const output of d.outputs)assert.deepEqual(prefix[output.key],full[output.key].slice(0,n));
      if(prefix.events)assert.deepEqual(prefix.events,full.events.filter(e=>e.time<=bars[n-1].time));
    }
  }
});
