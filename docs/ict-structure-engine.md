# ICT Structure Engine: local adaptation

Source: [ICT Structure Engine by WillyAlgoTrader](https://www.tradingview.com/script/4Y1T9TrB-ICT-Structure-Engine-WillyAlgoTrader/), published code v6.3.0, retrieved October 24, 2026. Original attribution retained in the local module and custom indicator. The source snapshot is in research/ict-structure-engine/original-v6.3.0.pine. No broker modules or original trading-project files were changed.

This is a JavaScript adaptation, **not certified exact TradingView parity**. TradingView's Pine runtime is not present locally. Passing candle checks establishes the checks below, not profitability or source-runtime equivalence.

## Implemented

Confirmed external/internal pivots; BOS/CHoCH; swing classification in evidence; liquidity pools and equal-level merging; previous day/week and finished-session liquidity; strict wick/close sweeps; ATR-qualified FVGs and shrink/fill; impulse-extreme OBs with opposite candle requirement, scoring, prior-touch handling, invalidation and breakers; auxiliary rejection/propulsion blocks; NY killzone/Silver Bullet setup filters; midnight open, daily bias and Judas confirmation; closed HTF structure/range and HTF OB calculation; one active sweep/CHoCH setup, displacement gate, one setup per sweep, expiry and opposite-shift cancellation; FVG/OB first retest; PD/OTE entry filters; wick/zone/sweep/ATR stop; tick-rounded ordered R/liquidity/leg-extension targets; virtual TP-first management, break-even, reversals and author TP1-win definition.

Chart displays structure/sweep/setup/entry markers, active local zones, equilibrium, entry/SL/TP1–3 and an explicitly labelled virtual-trade summary. Native NY session study remains alongside it. Buy/sell 0/1 outputs are available to local alerts without drawing them on the price scale. No alert or broker connection was enabled by installation.

## Explicit differences and limits

- Daily/weekly references use New York civil dates, not TradingView's exchange-specific daily bars or a forex 17:00 session. Sunday is a separate civil day here. This can change bias, sweeps, setups and targets.
- Local 4H bars anchor at NY midnight for forex, and 09:30 NY for US stocks. Only buckets containing every expected 5-minute bar are included; partial RTH buckets are omitted. TradingView may include shorter exchange-session bars. HTF data is consumed only after closure. This is a conservative local clock adaptation, not an exact provider-session replication.
- With historical imports, select `All completed`. With live data, keep `Exclude latest`. Changing this setting changes when the newest bar is eligible.
- Source virtual entry is the signal candle's close. It is a **decision-price illustration**, not evidence of an executable fill at that price. A deployable backtest must fill at a later available price and model costs; no live execution is provided.
- Same-bar TP/SL collisions reproduce the author's optimistic TP precedence and are flagged in evidence and the summary. The stop moved after TP1 is not hit retroactively. Author “win” means TP1 reached; no net-return claim follows from it.
- The local chart simplifies the original drawings, dashboard, text styling and historical object retention. Active boxes begin at confirmation, rather than drawing zones retrospectively from an older origin candle. Swing classifications and HTF boxes are in evidence; the local overlay does not reproduce every original visual. “SD” targets are leg extensions, not statistical standard deviations.
- The first release exposes the four published presets and principal entry/zone/risk filters. It does not implement every source cosmetic switch, configurable session/timezone, custom preset, configurable SD list or source webhook format. Generic app alerts use buy/sell outputs.
- Data gaps are retained. Candle-derived FVGs follow the source formula even across market closures; no missing candles are invented. Feed identity and source hashes are saved. Results depend on the amount of loaded warmup history.
- No native TradingView event export was available for bar-for-bar full-engine comparison. Complete source parity remains unverified.

## Validation and reproduction

See [20-symbol results](ict-engine-validation.md). The exact evaluation window is September 24, 2026 00:00 NY through October 24, 2026 00:00 NY, exclusive, with 35 additional calendar days for warmup. Inputs are read-only snapshots from the existing canonical candle loader.

`node --test test/ict-structure-engine.test.js` exercises causal pivots, source structure classes, Wilder ATR, FVG qualification, tick rounding, entry-bar exclusion, TP/SL collisions and break-even timing. The independent Python reference compares every external/internal structure event and every FVG against the published formulas. It is not a Pine interpreter.

`node scripts/validate-ict-engine.js` checks all 20 symbols, every sweep candle, every entry's setup/evidence/prices, and prefix stability at every entry plus ten other cutoffs. It saves full JSON evidence and code/data fingerprints. Zero-trade symbols remain zero; no filters are tuned to manufacture trades. Rule audits are Step/Evidence/Verification/Verdict; PASS means those checks pass, not DIAMOND or validated broker execution.

Build custom module: `node scripts/build-ict-engine.js`. Install/save layout: `node scripts/install-ict-engine.js`. Original layout backups are in data/layouts. The volume profile remains only on the 1-hour pane.
