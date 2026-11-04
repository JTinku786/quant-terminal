# Requested TradingView indicators

Retrieved October 24, 2026 from each public Source code tab. These are separate author implementations, not interchangeable strategy definitions.

| Indicator | Author | Original source | Local status |
|---|---|---|---|
| ICT Structure Engine | WillyAlgoTrader | research/ict-structure-engine/original-v6.3.0.pine | Adaptation installed on 5m; 20-symbol candle validation passed; full TradingView parity unverified |
| Market Structure — ZigZag, Break of Structure & Order Blocks | The_Forex_Steward | research/forex-steward-market-structure/original.pine | Original retrieved; not converted or installed locally |
| Buyside & Sellside Liquidity | LuxAlgo | research/luxalgo-liquidity/original.pine | Original retrieved; not converted or installed locally |
| Order Blocks Volume Delta 3D | fluxchart | research/flux-order-blocks-volume-delta/original.pine | Local adaptation installed on 5m, all sessions; chart-candle volume estimate; see flux-order-blocks.md |

Original pages:

- https://www.tradingview.com/script/4Y1T9TrB-ICT-Structure-Engine-WillyAlgoTrader/
- https://in.tradingview.com/script/NXgQEbZi-Market-Structure-ZigZag-Break-of-Structure-Order-Blocks/
- https://in.tradingview.com/script/Qk4vBbfL-Buyside-Sellside-Liquidity-LuxAlgo/
- https://in.tradingview.com/script/EtDoAmOi-Order-Blocks-Volume-Delta-3D-Flux-Charts/

Original licence/attribution headers are retained. The_Forex_Steward and fluxchart sources carry MPL 2.0 notices; LuxAlgo carries CC BY-NC-SA 4.0. No public redistribution or commercial deployment was performed.

Flux volume delta uses up/down candle volume, including optional lower-timeframe candles. Its POC anchor uses price-bin touch counts rather than actual traded volume at price. Neither proves bid/ask aggressor flow, especially on spot forex provider volume. Existing source snapshots are 5m; lower-timeframe delta cannot be invented from them.

See ict-structure-engine.md for conversion scope and ict-engine-validation.md for first-indicator validation. No validation outcome for the first indicator applies to these three newly retrieved scripts.
