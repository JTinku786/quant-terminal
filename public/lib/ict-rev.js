// Stored k1 signals -> causal 5m market-entry replay. No broker connectivity.
import { stats } from './backtest.js';

export function replayRev(dataset, options = {}) {
  const s = { initialCapital: 10000, riskPct: 0.5, feeBps: 0, spreadBps: 1,
    slippageBps: 0.1, minRR: 0.786, disasterStop: true,
    from: dataset.start, to: dataset.end, ...options };
  for (const k of ['initialCapital','riskPct','feeBps','spreadBps','slippageBps','minRR','from','to']) {
    if (!Number.isFinite(s[k]) || s[k] < 0) throw new Error(`Invalid ${k}`);
  }
  if (s.initialCapital <= 0 || s.riskPct <= 0 || s.riskPct > 100 || s.from >= s.to)
    throw new Error('Check capital, risk and date range');
  if (s.from < dataset.start || s.to > dataset.end) throw new Error('Dates exceed the saved snapshot');
  const bars = dataset.candles.filter(b => b.time >= s.from && b.time + 300 <= s.to);
  const events = dataset.events.filter(e => e.time >= s.from && e.time < s.to).sort((a,b)=>a.time-b.time || a.id.localeCompare(b.id));
  const expected = dataset.expected.filter(t=>t >= s.from && t+300 <= s.to);
  const byTime = new Map(bars.map(b=>[b.time,b]));
  if (byTime.size !== bars.length) throw new Error('Duplicate candle timestamps');
  for (let i=0;i<bars.length;i++) {
    const b=bars[i];
    if (i && bars[i-1].time >= b.time) throw new Error('Candles must be sorted');
    if (![b.time,b.open,b.high,b.low,b.close].every(Number.isFinite) || b.open<=0 || b.low>Math.min(b.open,b.close) || b.high<Math.max(b.open,b.close)) throw new Error('Invalid original candle');
  }
  const missing = new Set(expected.filter(t=>!byTime.has(t)));
  const eventMap = new Map();
  for (const e of events) { const a=eventMap.get(e.time)||[]; a.push(e); eventMap.set(e.time,a); }
  let cash=s.initialCapital, pos=null, locked=false;
  const trades=[], decisions=[], equity=[], unresolved=[], used=new Set();
  if (bars.length) equity.push({time:bars[0].time-1,value:s.initialCapital});
  const half=s.spreadBps/20000, slip=s.slippageBps/10000, fee=s.feeBps/10000;
  const close = (b, raw, reason, i, observedAt=b.time) => {
    const price=raw*(1-pos.side*slip);
    const pnl=pos.side*(price-pos.entry)*pos.qty - fee*pos.qty*(pos.entry+price);
    cash += pnl;
    trades.push({ id:pos.event.id, side:pos.side===1?'long':'short', entryTime:pos.time,
      exitTime:observedAt, exitBarTime:b.time, entryPrice:pos.entry, exitPrice:price, qty:pos.qty, pnl,
      pnlPct:pnl/(pos.qty*pos.entry)*100, bars:i-pos.index+1, realizedR:pnl/pos.riskCash,
      stop:pos.stop, target:pos.target, entryReason:'Market estimate after native discovery', exitReason:reason });
    pos=null;
  };
  for (let i=0;i<expected.length;i++) {
    const t=expected[i], b=byTime.get(t);
    if (!b) {
      if (pos) { unresolved.push({id:pos.event.id, reason:'MISSING_5M_WHILE_OPEN', time:t}); pos=null; locked=true; }
      for (const e of eventMap.get(t)||[]) decisions.push({id:e.id,time:t,result:'MISSING_ENTRY_CANDLE'});
      continue;
    }
    if (pos?.pendingStop) close(b,b.open*(1-pos.side*half),'5m close stop → next available open',i);
    for (const e of eventMap.get(t)||[]) {
      let reason=e.reasons.join(', ');
      if (!reason && locked) reason='UNRESOLVED_EARLIER_TRADE';
      if (!reason && pos) reason='PAIR_ALREADY_OPEN';
      if (!reason && used.has(e.setupKey)) reason='DUPLICATE_SETUP';
      const entry=b.open*(1+e.side*half)*(1+e.side*slip);
      const risk=(entry-e.stop)*e.side, reward=(e.target-entry)*e.side;
      if (!reason && (![entry,e.stop,e.target,e.time].every(Number.isFinite) || ![1,-1].includes(e.side) || risk<=0 || reward<=0)) reason='INVALID_MARKET_GEOMETRY';
      if (!reason && reward/risk < s.minRR) reason='MARKET_RR_BELOW_MINIMUM';
      if (!reason && cash<=0) reason='NO_CAPITAL';
      if (reason) { decisions.push({id:e.id,time:t,result:reason}); continue; }
      const riskCash=cash*s.riskPct/100;
      pos={event:e,side:e.side,entry,time:t,index:i,stop:e.stop,target:e.target,
        disaster:e.stop-e.side*risk,qty:riskCash/risk,riskCash};
      used.add(e.setupKey);
      decisions.push({id:e.id,time:t,result:'ENTERED',entry,plannedRR:reward/risk});
    }
    if (pos) {
      const q=x=>x*(1-pos.side*half);
      const tp=pos.side===1 ? q(b.high)>=pos.target : q(b.low)<=pos.target;
      const disaster=s.disasterStop && (pos.side===1 ? q(b.low)<=pos.disaster : q(b.high)>=pos.disaster);
      const gapTP=pos.side===1 ? q(b.open)>=pos.target : q(b.open)<=pos.target;
      const gapSL=s.disasterStop && (pos.side===1 ? q(b.open)<=pos.disaster : q(b.open)>=pos.disaster);
      if (gapTP) close(b,q(b.open),'Target gap at open',i);
      else if (gapSL) close(b,q(b.open),'Disaster stop gap at open',i);
      else if (tp && disaster) { unresolved.push({id:pos.event.id,time:t,reason:'AMBIGUOUS_TARGET_AND_DISASTER_STOP'}); pos=null; locked=true; }
      else if (tp) close(b,pos.target,'Target touch (observed at 5m close)',i,t+300);
      else if (disaster) close(b,pos.disaster,'Disaster stop touch (observed at 5m close)',i,t+300);
      else if (pos.side===1 ? b.close<pos.stop-(b.epsilon||0) : b.close>pos.stop+(b.epsilon||0)) pos.pendingStop=true;
    }
    const mtm=pos ? pos.side*(b.close*(1-pos.side*half)-pos.entry)*pos.qty - pos.qty*pos.entry*fee : 0;
    equity.push({time:t,value:cash+mtm});
  }
  // An off-grid discovery is not moved to a later bar or backdated.
  const seen=new Set(decisions.map(d=>d.id));
  for (const e of events) if (!seen.has(e.id)) decisions.push({id:e.id,time:e.time,result:'NO_EXACT_COMPLETED_SOURCE_BAR'});
  const st=stats(bars,trades,equity,{initialCapital:s.initialCapital,feePct:s.feeBps/100,slippagePct:s.slippageBps/100,spreadPct:s.spreadBps/100});
  st.netProfit = Number((cash-s.initialCapital).toFixed(2));
  st.netProfitPct = Number(((cash/s.initialCapital-1)*100).toFixed(2));
  st.totalR=trades.reduce((n,t)=>n+t.realizedR,0);
  st.avgR=trades.length?st.totalR/trades.length:null;
  st.missingBars=missing.size;
  st.incomplete=unresolved.length>0;
  return {stats:st,trades,decisions,equity,unresolved,open:pos?{id:pos.event.id,time:pos.time,entry:pos.entry,pendingStop:!!pos.pendingStop}:null,
    settings:s, mode:'STORED_SIGNAL_REPLAY', portfolio:'Independent pair; no account-wide caps',
    notes:['Closed P&L excludes any open/unresolved trade. Drawdown includes mark-to-market values up to known coverage.',
      'Stop fills use the next available open after the confirming close; no same-close market fill is assumed.',
      'A target touch occurs before a close-based stop. Two resting exits in one candle remain ambiguous.',
      'This is replay of stored signals, not a fresh detector backtest or broker P&L.']};
}

export function makeRevIndicator(dataset) {
  const saved=new Map(dataset.candles.map(b=>[b.time,b]));
  return {name:`REV k1 ${dataset.symbol} · original 5m`,overlay:true,inputs:[],
    outputs:[{key:'ote',label:'Planned OTE62',color:'#a78bfa'},
      {key:'stop',label:'5m close stop',color:'#ef5350'}, {key:'target',label:'Original 2R target',color:'#26a69a'}],
    calc(bars) {
      const out={ote:[],stop:[],target:[],markers:[]};
      const events=dataset.events.filter(e=>!e.reasons.length).sort((a,b)=>a.time-b.time);
      let current=null,j=0;
      for (const b of bars) {
        const original=saved.get(b.time);
        const same=original && ['open','high','low','close'].every(k=>Math.abs(original[k]-b[k])<1e-10);
        while (j<events.length && events[j].time<=b.time) {
          current=events[j++];
          if (same && current.time===b.time) out.markers.push({time:b.time,position:current.side===1?'belowBar':'aboveBar',
            shape:current.side===1?'arrowUp':'arrowDown',color:current.side===1?'#26a69a':'#ef5350',text:'REV setup known'});
        }
        for (const key of ['ote','stop','target']) out[key].push(same && current?current[key]:null);
      }
      return out;
    }};
}
