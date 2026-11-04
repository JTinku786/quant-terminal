# ICT Liquidity Sweep / Swing Fail Pattern V.1

Author: wut_trader. Source: https://www.tradingview.com/script/e0Zbp2mn/
The inspected Pine source uses the internal title “SMC Target Liquidity V.35 (Manual Distance Control)”. This is a JavaScript adaptation for this dashboard; exact TradingView parity has not been established.

Enabled by default on existing and new chart panes as the user's required study. Other indicators remain available. No broker execution, notifications or backtest strategy has been enabled.

## Source rules

Default pivot period: 10 bars on each side. Up to five active levels per side. Confirmed pivot levels are tagged with the pivot bar's session using the source's default fixed UTC-4 timezone, with UTC-5, New York DST and Bangkok available.

High level: SFP when the prior close was above and current close below; breakout (source label MSS) when both closes are above and the current close rises; sweep X when the wick touches/exceeds the level and closes below. Low-level rules are symmetric. Priority is SFP, then breakout, then X. An event retires that level. Equality/touch is retained in the source's sweep rule; an X does not necessarily mean a strict price excursion beyond the level.

The source's MSS label is a two-close breakout heuristic, not independently verified ICT market-structure shift or package BOS/CHOCH. It is displayed as “Break (MSS*)”. Session colours: Asia yellow, London teal, NY AM orange, NY PM purple, outside gray.

## Timing and practical gaps

Default excludes the newest candle. A pivot needs 10 right-side completed candles before it exists; on a daily chart this is at least ten subsequent trading candles. This is a lagging chart tool. Levels begin at the confirmation candle and event labels appear on the detection candle, unlike the source's historical pivot-line anchors and midpoint event labels. Past chart positions never imply those levels or signals were known earlier.

Levels are candle-based. A gap can satisfy close-transition rules without an observed trade through the level. X, SFP and breakout are classifications, not evidence of stop hunts, institutional intent, executable fills or profitable reversals. Spread, slippage, intrabar path and broker latency are not simulated. Session labels on higher timeframes reflect bar timestamps, not intraday session coverage.

The public description discusses coloured risk boxes but the inspected source only contains lines and labels. No SL/TP boxes were fabricated. Manual text tick offsets are replaced with readable pixel placement. Default marker/line styles are adapted to the dashboard, and historical rendering is capped for readability.
