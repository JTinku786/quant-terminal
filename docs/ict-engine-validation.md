# ICT Structure Engine local validation

Status: PASS. Source v6.3.0; local-0.1.0-source-6.3.0.

Window: 2026-09-24T04:00:00.000Z inclusive to 2026-10-24T04:00:00.000Z exclusive (September 24 through October 23, New York). 35 earlier calendar days initialize state.

| Symbol | Market | 5m bars | Setups | Trades | Closed | TP1 wins* | Ambiguous | Checks |
|---|---|---:|---:|---:|---:|---:|---:|---|
|NZDUSD|forex|6251|16|5|5|3|2|PASS|
|EURUSD|forex|6251|26|14|14|5|2|PASS|
|GBPUSD|forex|6252|20|5|5|3|0|PASS|
|USDJPY|forex|6250|21|10|10|6|4|PASS|
|AUDUSD|forex|6252|29|9|9|5|1|PASS|
|USDCAD|forex|6252|22|7|7|6|2|PASS|
|USDCHF|forex|6237|18|7|7|4|0|PASS|
|EURJPY|forex|6246|33|7|7|3|1|PASS|
|GBPJPY|forex|6252|25|3|3|2|1|PASS|
|AUDJPY|forex|6250|19|5|5|3|1|PASS|
|EURGBP|forex|6252|17|3|3|1|0|PASS|
|CHFJPY|forex|6231|29|5|5|4|1|PASS|
|SPY|us|1716|7|2|2|2|0|PASS|
|QQQ|us|1716|3|0|0|0|0|PASS|
|AAPL|us|1716|6|1|1|0|0|PASS|
|MSFT|us|1716|6|1|1|0|0|PASS|
|JPM|us|1716|9|0|0|0|0|PASS|
|XOM|us|1716|7|1|1|0|0|PASS|
|IBM|us|1716|10|3|3|1|0|PASS|
|GS|us|1716|3|3|3|2|0|PASS|

*Author definition: reached TP1 before eventual closure. This is not net profitability.

## What was checked

Independent Python implementation of source structure and FVG formulas; every sweep against its raw candle; every entry against stored setup/sweep/zone/risk evidence; prefix replay at every entry and ten other cutoffs per symbol. Prefix replay checks events, state, plotted entry/SL/targets, and HTF levels do not change when future data is appended.

## Limits

- Local adaptation, not certified TradingView signal parity.
- NY calendar days and locally constructed HTF buckets differ from some exchange sessions.
- Virtual entries use signal close; actual market fills require the next available price plus costs.
- Author win means TP1 touched; same-bar TP/SL order remains unknown.
- Not a broker backtest; no spread, commissions, partial exits or real-money execution.

Missing and overnight candle gaps are retained; no candles are invented. Gap counts include normal market closures. Complete HTF buckets only. No native TradingView output export was available for exact full-engine parity.

Source hash: a5815e7e4ba0a4447f4f56c4d7ee9236b2a140c565a54c2af41bec82f1cd8ee0

Engine hash: bd40f5d92c6346287830bb6cf77fea5b945921de56e24a98cf87a67bf50fc2d0
