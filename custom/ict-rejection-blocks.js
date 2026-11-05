// ICT Rejection Blocks — Titania implementation.
// At a confirmed swing high, a long upper wick is a bearish rejection block: from the highest body
// price up to the high. At a swing low, a long lower wick is a bullish block: from the low up to the
// lowest body price. A block shows once the swing is confirmed (no look-ahead) and ends when a candle
// closes through it.
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
  name: 'ICT Rejection Blocks · Titania',
  overlay: true,
  inputs: [
    { key: 'swing', label: 'Swing length', type: 'int', default: 3, min: 1, max: 30 },
    { key: 'wickBody', label: 'Wick ≥ body ×', type: 'float', default: 1, min: 0, max: 20 },
    { key: 'minAtr', label: 'Min wick (× ATR14)', type: 'float', default: 0.3, min: 0, max: 10 },
    { key: 'keep', label: 'Blocks to keep', type: 'int', default: 6, min: 1, max: 100 },
    { key: 'maxBars', label: 'Max length (bars)', type: 'int', default: 300, min: 5, max: 5000 },
  ],
  outputs: [{ key: 'value', label: 'Drawing layer', color: '#f23645' }],
  calc(bars, p) {
    const n = bars.length, L = Math.max(1, p.swing | 0);
    const value = new Array(n).fill(NaN);
    const atr = atrSeries(bars, 14);
    const blocks = [];
    for (let i = L; i < n - L; i++) {
      const b = bars[i];
      let h = true, l = true;
      for (let k = 1; k <= L; k++) {
        if (bars[i - k].high >= b.high || bars[i + k].high > b.high) h = false;
        if (bars[i - k].low <= b.low || bars[i + k].low < b.low) l = false;
      }
      const body = Math.abs(b.close - b.open), a = atr[i] || 0;
      const upper = b.high - Math.max(b.open, b.close), lower = Math.min(b.open, b.close) - b.low;
      if (h && upper >= p.wickBody * body && upper >= p.minAtr * a && upper > 0)
        blocks.push({ dir: -1, from: i, known: i + L, top: b.high, bottom: Math.max(b.open, b.close) });
      if (l && lower >= p.wickBody * body && lower >= p.minAtr * a && lower > 0)
        blocks.push({ dir: 1, from: i, known: i + L, top: Math.min(b.open, b.close), bottom: b.low });
    }
    const zones = [], lines = [], labels = [], markers = [];
    for (const blk of blocks.slice(-Math.max(1, p.keep | 0) * 4)) {
      let end = Math.min(n - 1, blk.known + (p.maxBars | 0)), broken = false, tested = false;
      for (let j = blk.known; j < n && j <= end; j++) {
        const c = bars[j].close;
        if (blk.dir < 0 && c > blk.top) { end = j; broken = true; break; }
        if (blk.dir > 0 && c < blk.bottom) { end = j; broken = true; break; }
        if (!tested && j > blk.known && ((blk.dir < 0 && bars[j].high >= blk.bottom) || (blk.dir > 0 && bars[j].low <= blk.top))) {
          tested = true;
          markers.push({ time: bars[j].time, position: blk.dir < 0 ? 'aboveBar' : 'belowBar', shape: 'circle', color: blk.dir < 0 ? bear : bull, text: 'RB test' });
        }
      }
      blk.end = end; blk.broken = broken;
    }
    for (const blk of blocks.slice(-Math.max(1, p.keep | 0))) {
      const color = blk.dir > 0 ? bull : bear;
      zones.push({ start: blk.from, end: blk.end, top: blk.top, bottom: blk.bottom, color, alpha: blk.broken ? 0.08 : 0.18, text: 'RB' });
      lines.push({ start: blk.from, end: blk.end, price: blk.dir > 0 ? blk.top : blk.bottom, color, dashed: true });
    }
    return { value, markers: markers.slice(-50), luxStudy: { id: 'ict-rejection-blocks', zones, lines, labels, barCount: n } };
  },
};
