// Adds the "ICT Backtest" layout (the reference TradingView indicator stack) to seed/state.json.
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'seed', 'state.json');
const s = JSON.parse(fs.readFileSync(file, 'utf8'));
const stack = [
  'custom:flux-order-blocks', 'custom:market-structure-sd', 'zigzag', 'custom:lux-buyside-sellside',
  'custom:ict-sessions', 'custom:quarterly-divider', 'custom:ict-mss', 'custom:ict-ifvg', 'custom:ict-rejection-blocks',
].map((id, k) => ({ uid: `ictbt-${k}`, id, params: id === 'zigzag' ? { deviation: 0.5, depth: 10 } : {} }));
s.layoutLibrary['ict-backtest'] = {
  name: 'ICT Backtest (Titania)',
  view: {
    layout: '1',
    panes: [{ symbol: 'TBT:AAPL_20170817', tf: '5m', type: 'candles', indicators: stack, compare: [], log: false, ictTradeSetups: [] }],
  },
};
fs.writeFileSync(file, JSON.stringify(s, null, 2));
console.log('layouts:', Object.keys(s.layoutLibrary).join(', '));
