// Chart annotations are derived from entry decisions, never from hypothetical skipped setups.
export function buildTradeSetups(dataset, result) {
  return result.decisions.filter(d=>d.result==='ENTERED').map(d=>{
    const e=dataset.events.find(e=>e.id===d.id), t=result.trades.find(t=>t.id===d.id);
    return {id:d.id,symbol:'CSV:REV_'+dataset.symbol,tf:'5m',entryTime:d.time,entry:d.entry,
      side:e.side,stop:e.stop,target:e.target,rr:d.plannedRR,
      exit:t?{time:t.exitTime,barTime:t.exitBarTime??(t.exitReason.includes('observed at')?t.exitTime-300:t.exitTime),
        price:t.exitPrice,reason:t.exitReason,r:t.realizedR}:null};
  });
}

export function visibleTradeSetups(setups, symbol, tf, knownAt) {
  return (setups||[]).filter(t=>t.symbol===symbol && tf===t.tf && t.entryTime<=knownAt).map(t=>{
    const exit=t.exit && t.exit.time<=knownAt?t.exit:null;
    return {...t,exit,endTime:Math.max(t.entryTime+3600,exit?.time??Math.min(knownAt,t.entryTime+86400))};
  });
}

export function entryPreviewBars(bars, replay) {
  if (!replay) return bars;
  const shown=bars.slice(0,replay.index+1);
  if (replay.entryPreview && shown.length) {
    const b=shown.at(-1);
    shown[shown.length-1]={...b,high:b.open,low:b.open,close:b.open,volume:0};
  }
  return shown;
}
