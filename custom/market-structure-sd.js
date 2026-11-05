// Market Structure — Major BoS, Supply/Demand and Inflection zones · Titania implementation.
// Major swings (confirmed `swing` bars later, no look-ahead). A close beyond the last major swing is a
// "Major BoS" (with trend) or "MSS" (against it). The last opposite candle before the breaking move is
// the origin zone: Demand for an up-break, Supply for a down-break; an MSS origin is an Inflection zone.
// Zones end when a candle closes through them.
const bull = '#089981', bear = '#f23645', inflection = '#7c4dff';

function confirmedPivots(bars, L) {
  const hs = [], ls = [];
  for (let i = L; i < bars.length - L; i++) {
    let h = true, l = true;
    for (let k = 1; k <= L; k++) {
      if (bars[i - k].high >= bars[i].high || bars[i + k].high > bars[i].high) h = false;
      if (bars[i - k].low <= bars[i].low || bars[i + k].low < bars[i].low) l = false;
    }
    if (h) hs.push({ i, price: bars[i].high, known: i + L });
    if (l) ls.push({ i, price: bars[i].low, known: i + L });
  }
  return { hs, ls };
}

export default {
  name: 'Market Structure · Major BoS, Supply/Demand & Inflection · Titania',
  overlay: true,
  inputs: [
    { key: 'swing', label: 'Major swing length', type: 'int', default: 10, min: 2, max: 60 },
    { key: 'keepBreaks', label: 'Breaks to keep', type: 'int', default: 12, min: 1, max: 200 },
    { key: 'keepZones', label: 'Zones to keep', type: 'int', default: 6, min: 1, max: 100 },
    { key: 'lookback', label: 'Origin search (bars)', type: 'int', default: 30, min: 3, max: 500 },
  ],
  outputs: [{ key: 'value', label: 'Drawing layer', color: '#2962ff' }],
  calc(bars, p) {
    const n = bars.length, L = Math.max(2, p.swing | 0);
    const value = new Array(n).fill(NaN);
    const { hs, ls } = confirmedPivots(bars, L);
    const breaks = [];
    let hi = 0, li = 0, lastHigh = null, lastLow = null, trend = 0;
    for (let j = 0; j < n; j++) {
      while (hi < hs.length && hs[hi].known <= j) lastHigh = hs[hi++];
      while (li < ls.length && ls[li].known <= j) lastLow = ls[li++];
      const c = bars[j].close;
      if (lastHigh && c > lastHigh.price) {
        breaks.push({ dir: 1, type: trend < 0 ? 'MSS' : 'Major BoS', from: lastHigh.i, at: j, price: lastHigh.price });
        trend = 1; lastHigh = null;
      } else if (lastLow && c < lastLow.price) {
        breaks.push({ dir: -1, type: trend > 0 ? 'MSS' : 'Major BoS', from: lastLow.i, at: j, price: lastLow.price });
        trend = -1; lastLow = null;
      }
    }
    const zones = [], lines = [], labels = [];
    const zoneList = [];
    for (const b of breaks) {
      // origin = last opposite-colour candle before the break, searching back from the break bar
      let o = -1;
      for (let k = b.at - 1; k >= Math.max(0, b.at - p.lookback); k--) {
        const bar = bars[k];
        if (b.dir > 0 ? bar.close < bar.open : bar.close > bar.open) { o = k; break; }
      }
      if (o < 0) continue;
      const top = bars[o].high, bottom = bars[o].low;
      let end = n - 1, broken = false;
      for (let j = b.at + 1; j < n; j++) {
        if ((b.dir > 0 && bars[j].close < bottom) || (b.dir < 0 && bars[j].close > top)) { end = j; broken = true; break; }
      }
      zoneList.push({ o, end, top, bottom, broken, dir: b.dir, kind: b.type === 'MSS' ? 'Inflection' : b.dir > 0 ? 'Demand' : 'Supply' });
    }
    for (const b of breaks.slice(-Math.max(1, p.keepBreaks | 0))) {
      lines.push({ start: b.from, end: b.at, price: b.price, color: b.type === 'MSS' ? inflection : '#2962ff', dashed: false, text: b.type });
    }
    for (const z of zoneList.slice(-Math.max(1, p.keepZones | 0))) {
      const color = z.kind === 'Inflection' ? inflection : z.dir > 0 ? bull : bear;
      zones.push({ start: z.o, end: z.end, top: z.top, bottom: z.bottom, color, alpha: z.broken ? 0.07 : 0.16, text: z.kind });
    }
    return { value, luxStudy: { id: 'market-structure-sd', zones, lines, labels, barCount: n } };
  },
};
