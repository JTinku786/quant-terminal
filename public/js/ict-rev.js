import { api, download, esc, fmtPrice } from './api.js';
import { replayRev } from '../lib/ict-rev.js';
import { tradesCsv } from '../lib/backtest.js';
import { buildTradeSetups } from '../lib/ict-trade-visuals.js';

export async function renderIctRev(el, app) {
  el.innerHTML='<div style="padding:16px">Loading original strategy data…</div>';
  try {
    const manifest=await api.get('/ict/manifest.json');
    if (!el.isConnected) return;
    const preferred=app.state.ictRevSymbol || 'NZDUSD';
    el.innerHTML=`<section style="padding:14px;min-width:720px">
      <h3 style="margin:0 0 8px">REV-k1_reclaim3-OTE62-2R-MARKET</h3>
      <p>Stored-signal replay · Forex 1H setups · Original 5m execution candles · Independent pair test</p>
      <div style="display:flex;gap:10px;align-items:end;flex-wrap:wrap">
        <label>Pair <select class="in" id="revPair">${manifest.symbols.map(s=>`<option ${s.symbol===preferred?'selected':''}>${esc(s.symbol)}</option>`).join('')}</select></label>
        <label>From (UTC) <input class="in" type="datetime-local" id="revFrom"></label>
        <label>To, exclusive (UTC) <input class="in" type="datetime-local" id="revTo"></label>
        <label>Risk per trade % <input class="in" style="width:80px" id="revRisk" type="number" min="0.01" max="100" step="0.1" value="0.5"></label>
        <label>Spread (bps) <input class="in" style="width:80px" id="revSpread" type="number" min="0" step="0.1" value="1"></label>
        <label>Slippage / side (bps) <input class="in" style="width:80px" id="revSlip" type="number" min="0" step="0.1" value="0.1"></label>
        <button class="btn" id="revRun">Run replay test</button>
        <button class="btn" id="revChart">Show original chart + indicator</button>
        <button class="btn" id="revCsv">Export trades</button>
        <button class="btn" id="revEvidence">Export full evidence</button>
      </div>
      <p style="font-size:12px;opacity:.8">1 basis point (bp) = 0.01%. Spread and slippage are estimates. Original stops and targets stay fixed; minimum market R:R is 0.786. A target marked 2R is relative to the planned OTE entry, so market-entry returns can differ.</p>
      <div id="revResult" aria-live="polite"></div>
      <details style="margin-top:14px"><summary>Coverage and test limits</summary><p>Snapshot: ${esc(manifest.start)} to ${esc(manifest.end)}. Refreshed ${esc(manifest.exportedAt)}.</p><ul>${manifest.limitations.map(x=>`<li>${esc(x)}</li>`).join('')}<li>A strict 5m close beyond the stop schedules an exit at the next available candle open. The disaster stop is another 1R beyond the strategy stop. Missing data and ambiguous target/disaster-stop candles make a trade unresolved.</li><li>Changing spread or slippage tests execution sensitivity. It does not rebuild the original signals, tune k1/OTE settings or establish an untouched holdout.</li><li>No broker connections or orders are made from this tab.</li></ul></details>
    </section>`;
    const $=id=>el.querySelector('#'+id);
    let dataset,result;
    const date=t=>new Date(t*1000).toISOString().slice(0,16);
    const format=t=>new Date(t*1000).toISOString().replace('T',' ').slice(0,19)+' UTC';
    async function load() {
      $('revResult').textContent='Loading saved candles…';
      dataset=await api.get('/ict/'+encodeURIComponent($('revPair').value)+'.json');
      $('revFrom').value=date(dataset.start); $('revTo').value=date(dataset.end);
      app.state.ictRevSymbol=dataset.symbol; app.persist(); run();
    }
    function run() {
      try {
        result=replayRev(dataset,{from:Date.parse($('revFrom').value+'Z')/1000,to:Date.parse($('revTo').value+'Z')/1000,
          riskPct:Number($('revRisk').value),spreadBps:Number($('revSpread').value),slippageBps:Number($('revSlip').value)});
        const st=result.stats;
        const issues=result.unresolved.length || result.open;
        const entered=new Map(result.decisions.filter(x=>x.result==='ENTERED').map(x=>[x.id,x]));
        const trades=new Map(result.trades.map(x=>[x.id,x]));
        const reasons={}; for(const d of result.decisions) reasons[d.result]=(reasons[d.result]||0)+1;
        $('revResult').innerHTML=`<p><b>${issues?'PARTIAL — open or unresolved trades remain':'Replay complete for this saved window'}</b> · ${st.missingBars} missing source candles · ${result.unresolved.length} unresolved · ${result.open?1:0} open</p>
          <div style="display:flex;gap:24px;flex-wrap:wrap;padding:10px 0"><span>Closed trades <b>${st.totalTrades}</b></span><span>Win rate <b>${st.winRatePct??'—'}%</b></span><span>Closed net R <b>${st.totalR.toFixed(2)}</b></span><span>Average R <b>${st.avgR?.toFixed(2)??'—'}</b></span><span>Closed P&amp;L <b>$${st.netProfit.toFixed(2)}</b></span><span>Observed drawdown <b>${st.maxDrawdownPct}%</b></span></div>
          <p style="font-size:12px">${result.notes.map(esc).join(' ')}</p>
          <details><summary>Entry decisions (${result.decisions.length} signals)</summary><ul>${Object.entries(reasons).map(([k,v])=>`<li>${esc(k)}: ${v}</li>`).join('')}</ul></details>
          <div style="max-height:235px;overflow:auto;margin-top:10px"><table style="width:100%;text-align:left"><thead><tr><th>Discovery (UTC)</th><th>Side</th><th>Planned OTE</th><th>Market estimate</th><th>Stop</th><th>Target</th><th>Result</th><th>Net R</th><th>Evidence</th></tr></thead><tbody>${result.decisions.map(d=>{
            const e=dataset.events.find(x=>x.id===d.id),t=trades.get(d.id);
            return `<tr><td>${format(d.time)}</td><td>${e.side===1?'BUY':'SELL'}</td><td>${fmtPrice(e.ote)}</td><td>${entered.has(e.id)?fmtPrice(entered.get(e.id).entry):'—'}</td><td>${fmtPrice(e.stop)}</td><td>${fmtPrice(e.target)}</td><td>${esc(t?.exitReason||result.unresolved.find(x=>x.id===e.id)?.reason||d.result)}</td><td>${t?.realizedR.toFixed(2)??'—'}</td><td><button class="btn small" data-proof="${esc(e.id)}">Why?</button>${entered.has(e.id)?` <button class="btn small" data-entry="${esc(e.id)}">At entry</button> <button class="btn small" data-trade="${esc(e.id)}">Entry + exit</button>`:''}</td></tr>`;
          }).join('')}</tbody></table></div><pre id="revProof" style="white-space:pre-wrap;max-height:230px;overflow:auto"></pre>`;
        $('revResult').onclick=e=>{
          const entryId=e.target.closest('[data-entry]')?.dataset.entry;
          const tradeId=e.target.closest('[data-trade]')?.dataset.trade;
          if(entryId||tradeId) {showChart(entryId||tradeId,!!entryId);return;}
          const id=e.target.closest('[data-proof]')?.dataset.proof;
          if(id) $('revProof').textContent=JSON.stringify({signal:dataset.events.find(x=>x.id===id),decision:result.decisions.find(x=>x.id===id),trade:trades.get(id),unresolved:result.unresolved.find(x=>x.id===id)},null,2);
        };
      } catch(e) { $('revResult').textContent='Could not run: '+e.message; }
    }
    $('revPair').onchange=()=>load().catch(e=>{$('revResult').textContent=e.message;});
    $('revRun').onclick=run;
    $('revCsv').onclick=()=>{if(result) download(`REV-${dataset.symbol}-trades.csv`,tradesCsv(result.trades));};
    $('revEvidence').onclick=()=>{if(result) download(`REV-${dataset.symbol}-evidence.json`,JSON.stringify({manifest,snapshotSHA256:dataset.snapshotSHA256,result},null,2),'application/json');};
    async function showChart(selectedId=null, atEntry=false) {
      try {
        const pane=app.active;
        if(!pane) throw new Error('Select a chart first');
        pane.cfg.symbol='CSV:REV_'+dataset.symbol; pane.cfg.tf='5m'; pane.cfg.compare=[];
        pane.cfg.type='candles';
        pane.cfg.indicators=pane.cfg.indicators.filter(x=>!x.id.startsWith('custom:ict-rev-'));
        pane.cfg.ictTradeSetups=buildTradeSetups(dataset,result);
        app.settings.bars=20000;
        await pane.load();
        pane.render(false);
        const selected=pane.cfg.ictTradeSetups.find(t=>t.id===selectedId)||pane.cfg.ictTradeSetups.at(-1);
        if(selected) {
          const index=pane.bars.findIndex(b=>b.time===selected.entryTime);
          if(atEntry && index>=1) pane.startReplay(index,{entryPreview:true});
          const end=selected.exit?.barTime??selected.entryTime+3600;
          const endIndex=pane.bars.findIndex(b=>b.time>=end);
          pane.chart.timeScale().setVisibleLogicalRange({from:Math.max(0,index-45),to:atEntry?index+35:Math.max(index+35,endIndex+18)});
          if(atEntry) document.querySelector('#bottom').classList.add('collapsed');
        }
        app.syncToolbar(); app.persist();
        app.toast(atEntry?'Entry instant: only the opening price is shown. Green = target, red = stop. Step forward to reveal candles.':'Buy/sell entries, R:R boxes and known TP/SL exits are marked. These are replay estimates.');
      } catch(e) {app.toast(e.message,'err');}
    }
    $('revChart').onclick=()=>showChart();
    await load();
  } catch(e) {el.textContent='ICT snapshot unavailable: '+e.message;}
}
