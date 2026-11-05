// ICT Market Structure Shift (MSS) — Titania implementation.
// A swing high/low is confirmed `swing` bars after it forms (no look-ahead). A candle CLOSE beyond the
// most recent unbroken swing is a break: against the current trend = MSS (shift), with it = BOS.
const bull = '#089981', bear = '#f23645';

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

export function structureBreaks(bars, L) {
  const { hs, ls } = confirmedPivots(bars, L);
  const out = [];
  let hi = 0, li = 0, lastHigh = null, lastLow = null, trend = 0;
  for (let j = 0; j < bars.length; j++) {
    while (hi < hs.length && hs[hi].known <= j) lastHigh = hs[hi++];
    while (li < ls.length && ls[li].known <= j) lastLow = ls[li++];
    const c = bars[j].close;
    if (lastHigh && c > lastHigh.price) {
      out.push({ dir: 1, type: trend < 0 ? 'MSS' : 'BOS', from: lastHigh.i, at: j, price: lastHigh.price, swing: lastLow });
      trend = 1; lastHigh = null;
    } else if (lastLow && c < lastLow.price) {
      out.push({ dir: -1, type: trend > 0 ? 'MSS' : 'BOS', from: lastLow.i, at: j, price: lastLow.price, swing: lastHigh });
      trend = -1; lastLow = null;
    }
  }
  return out;
}

export default {
  name: 'ICT Market Structure Shift (MSS) · Titania',
  overlay: true,
  inputs: [
    { key: 'swing', label: 'Swing length', type: 'int', default: 4, min: 1, max: 50 },
    { key: 'show', label: 'Show', type: 'select', default: 'MSS + BOS', options: ['MSS only', 'MSS + BOS'] },
    { key: 'style', label: 'Line style', type: 'select', default: 'Dashed', options: ['Dashed', 'Solid'] },
    { key: 'keep', label: 'Breaks to keep', type: 'int', default: 40, min: 1, max: 500 },
  ],
  outputs: [{ key: 'value', label: 'Drawing layer', color: '#089981' }],
  calc(bars, p) {
    const n = bars.length;
    const value = new Array(n).fill(NaN);
    const breaks = structureBreaks(bars, Math.max(1, p.swing | 0))
      .filter((b) => p.show === 'MSS + BOS' || b.type === 'MSS')
      .slice(-Math.max(1, p.keep | 0));
    const lines = [], labels = [], markers = [];
    for (const b of breaks) {
      const color = b.dir > 0 ? bull : bear;
      lines.push({ start: b.from, end: b.at, price: b.price, color, dashed: p.style === 'Dashed', text: b.type, small: b.type === 'BOS' });
      if (b.type === 'MSS') markers.push({ time: bars[b.at].time, position: b.dir > 0 ? 'belowBar' : 'aboveBar', shape: b.dir > 0 ? 'arrowUp' : 'arrowDown', color, text: 'MSS' });
    }
    return { value, markers, luxStudy: { id: 'ict-mss', zones: [], lines, labels, barCount: n } };
  },
};
