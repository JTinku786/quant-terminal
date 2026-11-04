# Venky Mama — local six-indicator layout

The new **Venky Mama · LuxAlgo 6** layout is separate from **Old ICT / Flux layout**. Switch between them using Saved layouts in the top toolbar. Switching saves chart appearance and indicator settings without restoring old paper-account or watchlist state. An additional exact pre-change state backup is data/layouts/old-ict-flux-before-luxalgo-2026-10-28.json.

## Data authority

The default chart is RELIANCE 5m, imported from the existing candles_5m database in a read-only transaction. No original trading-project files or database rows were changed. Conflicting duplicate OHLC rows would be excluded; none were found. There are 4,455 completed candles in this snapshot. The stored source tag is yfinance: this means historical database data originally collected from that provider, not a new external feed replacing the database. The local CSV chart is a **snapshot**, not a live database subscription; its latest candle is October 28, 2026 05:45 America/New_York.

## Photo settings

Exact captured settings are data/luxalgo-suite/photo-settings.json. The six adapters are:

1. Liquidity Swings — lookback 14, Wick Extremity, intrabar precision off, Count > 0, tiny labels.
2. Buyside/Sellside — length 7, margin 6.9, both sides, zone margins 2.3, voids off, Present, three levels per side.
3. Liquidity Sweeps — length 5, Only Wicks, extend on, 300-bar maximum.
4. Liquidity Pools — two contacts, five bars between contacts, ten confirmation bars, volume labels on/Small, candle fill off.
5. SMC — Historical/Colored, internal and swing structure All, confluence off, internal labels tiny/swing small, swing points off/50, strong-weak highs/lows on; internal OB off, swing OB five, ATR filter, High/Low mitigation; equal levels on/3/0.1/tiny; FVG, MTF levels and premium-discount off.
6. ICT Concepts — Present, structure length 5, MSS/BOS/displacement on; VI off; body-based OB length 10, one each side, polarity-history labels off; liquidity on/margin 4/two boxes; FVG/BPR, NWOG/NDOG, Fibonacci and every killzone off.

These are JavaScript adaptations of each original script's enabled photo preset. The source-specific definitions are retained (for example SMC leg detection is not replaced by a symmetric generic pivot). Rendering uses local canvas boxes, lines and labels rather than Pine drawing objects. It is **not a promise of pixel-identical TradingView output**. Modules disabled in the supplied photos were not ported or silently switched on. Those unsupported modules are not offered as working switches. Intrabar precision is disabled as supplied; no unavailable lower-timeframe candles are invented.

The original source files, author attribution and CC BY-NC-SA 4.0 notices are retained in research/luxalgo-suite and generated custom files. This was a private local installation, not public or commercial publication.

## TradingView comparison

Signed-in account saitejareddy_ds was verified. The original Venky Mama chart was preserved; a separate **Venky Mama - local validation** copy was created at https://in.tradingview.com/chart/vlU5F7S8/ for RELIANCE 5m. Its six indicator legend settings match the photo preset. Its CSV is data/luxalgo-suite/tradingview-reliance.csv.

The CSV exposes ICT displacement UP/DN plots, but does not expose the other scripts' boxes/lines as numeric series. On identical TradingView candles, the local displacement calculation matches all **560/560** tested UP/DN values, excluding a 20-bar warmup and the newest bar. This proves that calculation comparison only, not every drawing of all six indicators.

Database versus TradingView at 300 matching timestamps: **261 OHLC matches, 39 OHLC mismatches; 49 exact volume matches, 251 volume mismatches**. Float rounding tolerance for prices is 0.0001. On their respective feeds the displacement outputs agree on 594/600 comparisons, with six differences. No database prices or volumes were overwritten to force agreement.

Thus **full six-indicator TradingView parity remains unverified**. Differences in volume directly affect Swings and Pools labels; differences in highs/lows can affect pivots, sweeps, order blocks and structure. Source-runtime drawing state and history length also require separate comparison. Do not treat the all-six local checks as proof of full TradingView parity.

## Verification

Seven targeted tests cover delayed pivots, wick sweeps, pool confirmation, displacement rules, incomplete newest bars and timestamp ordering. Each study is checked on all 4,455 database candles, and historical event prefixes are replayed at four cutoffs. The independent TradingView displacement series comparison passes. Full install offline tests, provider checks and smoke test also pass. See luxalgo-suite-validation.md and data/luxalgo-suite/validation.json for exact evidence and code hashes.
