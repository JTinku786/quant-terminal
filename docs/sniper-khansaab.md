# Sniper Entry/Exit by KhanSaab V.02 Community

Adapted locally from the public community Pine source inspected November 3, 2026:
https://www.tradingview.com/script/HBDcHSB7-Sniper-Entry-Exit-with-SL-TP-by-KhanSaab-V-02/
Original source attribution: © KhanSaab 2026, all rights reserved.

Includes EMA 9/21 crossover labels with alternating state, EMA 50, retest markers, EMA ribbon, highlighted candle bodies and a bull/bear score panel. It runs in this dashboard as JavaScript. Exact parity with TradingView is not established.

The title and descriptive marketing discuss SL/TP and a larger dashboard, but the inspected community source contains neither SL/TP calculations nor a trade-management state machine. None were invented here. Buy/sell outputs are chart signals, not orders, fills or exit instructions.

Practical gaps:

- EMA/RSI/MACD/ADX are lagging. Default mode excludes the forming chart candle; a label becomes actionable only after confirmation. It does not promise entry at the labelled candle's close.
- A price gap can cross an EMA; spread, slippage, fees, broker latency and liquidity can make execution materially different. This study does not simulate any of them or claim a performance edge.
- The seven-point bull and bear scores are separate rule counts, not complementary probabilities. No complete score is shown without all required data.
- Previous 5m RSI uses an actual confirmed 5-minute context and the prior RSI sample, mirroring the source's `close[1]` intent. On other chart timeframes the dashboard requests 5m data; missing, stale or insufficient coverage is labelled unavailable. Higher-timeframe intrabar mapping is a local causal interpretation, not verified Pine parity. Alerts/backtests without this auxiliary feed have unavailable scores, while EMA crossover signals still calculate.
- VWAP uses volume-weighted typical price and a user-selected calendar-day timezone reset. Exchange session templates, futures overnight sessions and partial-history session completeness are not reconstructed. Select the appropriate timezone and treat this as an approximation where the session differs.
- Zero/missing volume disables complete scores. Forex volume is provider-specific and is not exchange-wide volume.
- Signal bodies are black and retests orange; the original chart wicks remain. Native chart markers replace Pine labels. Panel defaults to bottom left to coexist with Next Candle Predictor.
- No broker route, live trading or external notifications are enabled. This addition has not been published to GitHub; source redistribution rights must be reviewed separately.
