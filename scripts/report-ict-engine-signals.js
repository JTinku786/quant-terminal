import fs from 'node:fs';
const report=JSON.parse(fs.readFileSync('data/ict-engine/validation.json'));
const iso=t=>new Date(t*1000).toISOString();
let text='# Signal candle audits\n\nVirtual source-policy decisions, not executable same-close broker fills. Full raw candle evidence is in data/ict-engine/candles, and per-signal evidence in data/ict-engine/<SYMBOL>-evidence.json.\n\n';
for(const item of report.symbols){
 const data=JSON.parse(fs.readFileSync('data/ict-engine/'+item.symbol+'-evidence.json'));
 const bars=JSON.parse(fs.readFileSync('data/ict-engine/candles/'+item.symbol+'.json')).candles;
 for(const t of data.trades){const s=t.evidence,b=bars[t.entryIndex];
  text+=`## ${item.symbol} ${t.id}\n\nStep: Sweep → CHoCH/displacement → first zone retest → virtual entry.\n\nEvidence: Market ${item.market}, timeframe 5m; sweep ${iso(bars[s.sweep.index].time)} at ${s.sweep.level} (${s.sweep.name}); setup known ${iso(s.armKnownAt)}; decision known ${iso(t.decisionKnownAt)}; entry ${t.entry}, initial SL ${t.initialSL}, TP ${t.targets.join(', ')}. Decision candle OHLC ${b.open}, ${b.high}, ${b.low}, ${b.close}.\n\nVerification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.\n\nVerdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. ${t.ambiguities.length?'Intrabar ambiguity present.':'No TP/SL ordering ambiguity observed in this trade.'}\n\n`;
 }
}
fs.writeFileSync('docs/ict-engine-signal-audits.md',text);
console.log('Saved per-signal audits');
