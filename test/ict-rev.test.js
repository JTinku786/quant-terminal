import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { replayRev, makeRevIndicator } from '../public/lib/ict-rev.js';
import { buildTradeSetups, visibleTradeSetups, entryPreviewBars } from '../public/lib/ict-trade-visuals.js';

const base=1800000000;
const bar=(i,o=100,h=101,l=99,c=100)=>({time:base+i*300,open:o,high:h,low:l,close:c,volume:1});
const event=(over={})=>({id:'one',setupKey:'setup-one',time:base+300,side:1,ote:98,stop:95,target:110,reasons:[],...over});
const data=(bars,events=[event()])=>({symbol:'TEST',start:base,end:base+bars.length*300,
  candles:bars,events,expected:Array.from({length:bars.length},(_,i)=>base+i*300)});
const opts={spreadBps:0,slippageBps:0,disasterStop:false};

test('market entry waits until discovery; original target remains fixed instead of moving to 2R',()=>{
  const d=data([bar(0,98,120,97,100),bar(1),bar(2,100,111,99,109)]);
  const r=replayRev(d,opts);
  assert.equal(r.trades.length,1); assert.equal(r.trades[0].entryTime,base+300);
  assert.equal(r.trades[0].entryPrice,100); assert.equal(r.trades[0].exitPrice,110);
  assert.equal(r.trades[0].realizedR,2); assert.equal(r.trades[0].exitTime,base+900);
});
test('wick through stop does not exit; close breach schedules next-open fill',()=>{
  const d=data([bar(0),bar(1,100,101,90,96),bar(2,96,97,92,94),bar(3,93,94,92,93)]);
  const r=replayRev(d,opts);
  assert.equal(r.trades.length,1); assert.equal(r.trades[0].exitTime,base+900);
  assert.equal(r.trades[0].exitPrice,93); assert.equal(r.trades[0].realizedR,-1.4);
});
test('target touch precedes a stop confirmed only at candle close',()=>{
  const r=replayRev(data([bar(0),bar(1,100,112,92,94)]),opts);
  assert.equal(r.trades[0].exitPrice,110);
});
test('two resting exits in one candle are unresolved; no invented path',()=>{
  const r=replayRev(data([bar(0),bar(1,100,112,89,100)]),{...opts,disasterStop:true});
  assert.equal(r.trades.length,0); assert.equal(r.unresolved[0].reason,'AMBIGUOUS_TARGET_AND_DISASTER_STOP');
});
test('missing source candle while open blocks later trades on the same pair',()=>{
  const d=data([bar(0),bar(1),bar(2),bar(3),bar(4)], [event(),event({id:'two',setupKey:'two',time:base+900})]);
  d.candles=d.candles.filter(b=>b.time!==base+600);
  const r=replayRev(d,opts);
  assert.equal(r.unresolved[0].reason,'MISSING_5M_WHILE_OPEN');
  assert.equal(r.decisions[1].result,'UNRESOLVED_EARLIER_TRADE');
});
test('policy exclusion, market RR, duplicate setup and open-position gates apply',()=>{
  let d=data([bar(0),bar(1),bar(2)]);
  d.events=[event({reasons:['EXCLUDED_SESSION']})];
  assert.equal(replayRev(d,opts).decisions[0].result,'EXCLUDED_SESSION');
  d.events=[event({target:102})];
  assert.equal(replayRev(d,opts).decisions[0].result,'MARKET_RR_BELOW_MINIMUM');
  d.events=[event(),event({id:'two',time:base+600})];
  assert.equal(replayRev(d,opts).decisions[1].result,'PAIR_ALREADY_OPEN');
});
test('open trades stay open at the right edge, rather than being fabricated exits',()=>{
  const r=replayRev(data([bar(0),bar(1)]),opts);
  assert.equal(r.trades.length,0); assert.ok(r.open);
});
test('spread and slippage reduce R; invalid sensitivity and date settings fail',()=>{
  const d=data([bar(0),bar(1),bar(2,100,112,99,109)]);
  const clean=replayRev(d,opts),friction=replayRev(d,{...opts,spreadBps:2,slippageBps:1});
  assert.ok(friction.trades[0].realizedR<clean.trades[0].realizedR);
  assert.throws(()=>replayRev(d,{riskPct:NaN}));
  assert.throws(()=>replayRev(d,{from:base-1}));
});
test('chart output is causal under truncation and refuses mismatched candle prices',()=>{
  const d=data([bar(0),bar(1),bar(2)], [event()]);
  const indicator=makeRevIndicator(d),full=indicator.calc(d.candles),prefix=indicator.calc(d.candles.slice(0,1));
  assert.equal(full.ote[0],null); assert.equal(full.ote[1],98);
  assert.equal(prefix.markers.length,0); assert.deepEqual(prefix.ote,full.ote.slice(0,1));
  assert.equal(indicator.calc([bar(1,200,201,199,200)]).ote[0],null);
});
test('future outcomes cannot change already completed trades',()=>{
  const bars=[bar(0),bar(1),bar(2,100,111,99,109),bar(3)];
  const a=replayRev(data(bars),opts);
  const b=replayRev(data([...bars,bar(4,100,1000,1,500)]),opts);
  assert.deepEqual(a.trades,b.trades);
});
test('risk boxes use the modeled fill and original stop/target; only entered setups are drawn',()=>{
  const d=data([bar(0),bar(1),bar(2,100,111,99,109)], [event(),event({id:'skip',time:base,reasons:['EXCLUDED_SESSION']})]);
  const r=replayRev(d,opts), boxes=buildTradeSetups(d,r);
  assert.equal(boxes.length,1); assert.equal(boxes[0].entry,100);
  assert.equal(boxes[0].stop,95); assert.equal(boxes[0].target,110);assert.equal(boxes[0].rr,2);
  assert.equal(boxes[0].exit.barTime,base+600);
});
test('entry preview reveals the open only, with no mutation of original candles',()=>{
  const bars=[bar(0),bar(1,100,200,50,180)];
  const shown=entryPreviewBars(bars,{index:1,entryPreview:true});
  assert.deepEqual([shown[1].open,shown[1].high,shown[1].low,shown[1].close,shown[1].volume],[100,100,100,100,0]);
  assert.equal(bars[1].high,200);
  assert.deepEqual(entryPreviewBars(bars,{index:1}),bars);
});
test('entry view hides future exit and its duration; full view shows exits only once known',()=>{
  const d=data([bar(0),bar(1),bar(2,100,111,99,109)]),r=replayRev(d,opts),boxes=buildTradeSetups(d,r);
  assert.equal(visibleTradeSetups(boxes,'CSV:REV_TEST','5m',base).length,0);
  const entry=visibleTradeSetups(boxes,'CSV:REV_TEST','5m',base+300)[0];
  assert.equal(entry.exit,null); assert.equal(entry.endTime,entry.entryTime+3600);
  assert.equal(visibleTradeSetups(boxes,'CSV:REV_TEST','5m',base+899)[0].exit,null);
  assert.ok(visibleTradeSetups(boxes,'CSV:REV_TEST','5m',base+900)[0].exit);
  assert.equal(visibleTradeSetups(boxes,'US:AAPL','5m',base+900).length,0);
  assert.equal(visibleTradeSetups(boxes,'CSV:REV_TEST','1h',base+900).length,0);
});
test('every installed snapshot runs deterministically and never fills before discovery',()=>{
  const root=new URL('../public/ict/',import.meta.url);
  if (!fs.existsSync(root)) return;
  const manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',root)));
  for (const {symbol} of manifest.symbols) {
    const d=JSON.parse(fs.readFileSync(new URL(symbol+'.json',root)));
    const r=replayRev(d),again=replayRev(d);
    assert.deepEqual(r,again);
    for(const t of r.trades) {
      const e=d.events.find(e=>e.id===t.id);
      assert.equal(t.entryTime,e.time); assert.ok(t.exitTime>=t.entryTime);
      assert.ok(e.reasons.length===0);
    }
    const prefix=replayRev(d,{to:d.start+7*86400});
    assert.deepEqual(prefix.trades,r.trades.filter(t=>t.exitTime<=d.start+7*86400));
  }
});
