// Inversion Fair Value Gaps (IFVG) — Titania implementation.
// A fair value gap (3-candle imbalance, at least `minAtr` × ATR14 wide) that price later CLOSES
// through flips role: a bullish FVG closed below becomes a bearish IFVG (resistance), a bearish FVG
// closed above becomes a bullish IFVG (support). The IFVG ends when price closes back through it.
const bull = '#089981', bear = '#f23645';

function atrSeries(bars, k) {
  let a = null, sum = 0;
  return bars.map((b, i) => {
    const tr = i ? Math.max(b.high - b.low, Math.abs(b.high - bars[i - 1].close), Math.abs(b.low - bars[i - 1].close)) : b.high - b.low;
    if (i < k) { sum += tr; if (i === k - 1) a = sum / k; } else a = (a * (k - 1) + tr) / k;
    return a;
  });
}

export default {
  name: 'Fair Value Gaps + Inversion FVGs (IFVG) · Titania',
  overlay: true,
  inputs: [
    { key: 'keep', label: 'IFVGs to keep', type: 'int', default: 5, min: 1, max: 100 },
    { key: 'trigger', label: 'Inversion on', type: 'select', default: 'Close', options: ['Close', 'Wick'] },
    { key: 'minAtr', label: 'Min gap (× ATR14)', type: 'float', default: 0.25, min: 0, max: 10 },
    { key: 'maxAge', label: 'FVG max age before inversion (bars)', type: 'int', default: 200, min: 5, max: 5000 },
    { key: 'signals', label: 'Retest signals', type: 'select', default: 'On', options: ['On', 'Off'] },
    { key: 'fvgs', label: 'Also show open FVGs (grey boxes)', type: 'select', default: 'On', options: ['On', 'Off'] },
    { key: 'keepFvg', label: 'Open FVGs to keep', type: 'int', default: 6, min: 1, max: 100 },
  ],
  outputs: [{ key: 'value', label: 'Drawing layer', color: '#7c4dff' }],
  calc(bars, p) {
    const n = bars.length;
    const value = new Array(n).fill(NaN);
    const atr = atrSeries(bars, 14);
    const open = [], inv = [];
    for (let j = 2; j < n; j++) {
      const a = atr[j] || 0, c = bars[j];
      if (c.low > bars[j - 2].high && c.low - bars[j - 2].high >= p.minAtr * a)
        open.push({ dir: 1, from: j - 1, top: c.low, bottom: bars[j - 2].high, born: j });
      if (c.high < bars[j - 2].low && bars[j - 2].low - c.high >= p.minAtr * a)
        open.push({ dir: -1, from: j - 1, top: bars[j - 2].low, bottom: c.high, born: j });
      for (let k = open.length - 1; k >= 0; k--) {
        const g = open[k];
        if (g.born >= j) continue;
        if (j - g.born > p.maxAge) { open.splice(k, 1); continue; }
        const below = p.trigger === 'Close' ? c.close < g.bottom : c.low < g.bottom;
        const above = p.trigger === 'Close' ? c.close > g.top : c.high > g.top;
        if (g.dir > 0 && below) { inv.push({ ...g, dir: -1, at: j }); open.splice(k, 1); }
        else if (g.dir < 0 && above) { inv.push({ ...g, dir: 1, at: j }); open.splice(k, 1); }
      }
    }
    const zones = [], lines = [], labels = [], markers = [];
    if (p.fvgs === 'On') {
      // Gaps still open at the latest bar (not inverted, not aged out), drawn as grey boxes.
      for (const g of open.slice(-Math.max(1, p.keepFvg | 0))) {
        zones.push({ start: g.from, end: n - 1, top: g.top, bottom: g.bottom, color: '#9598a1', alpha: 0.16, text: 'FVG' });
      }
    }
    for (const g of inv.slice(-Math.max(1, p.keep | 0))) {
      let end = n - 1, signalled = false;
      for (let j = g.at + 1; j < n; j++) {
        const c = bars[j];
        if ((g.dir < 0 && c.close > g.top) || (g.dir > 0 && c.close < g.bottom)) { end = j; break; }
        if (p.signals === 'On' && !signalled) {
          if (g.dir < 0 && c.high >= g.bottom && c.close < g.bottom) {
            signalled = true; markers.push({ time: c.time, position: 'aboveBar', shape: 'arrowDown', color: bear, text: 'IFVG' });
          } else if (g.dir > 0 && c.low <= g.top && c.close > g.top) {
            signalled = true; markers.push({ time: c.time, position: 'belowBar', shape: 'arrowUp', color: bull, text: 'IFVG' });
          }
        }
      }
      const color = g.dir > 0 ? bull : bear;
      zones.push({ start: g.at, end, top: g.top, bottom: g.bottom, color, alpha: 0.18, text: g.dir > 0 ? 'IFVG ▲' : 'IFVG ▼' });
      lines.push({ start: g.at, end, price: (g.top + g.bottom) / 2, color, dashed: true });
    }
    return { value, markers, luxStudy: { id: 'ict-ifvg', zones, lines, labels, barCount: n } };
  },
};
