# Next Candle Predictor (local adaptation)

Source: https://www.tradingview.com/script/YoDyGsjT/ — Next Candle Predictor V4.1 by PredictaFutures; developed by Ceyhun C. Canbazoglu.

This JavaScript adaptation uses the published custom trend-band recurrence, EMA 8/21/50, MACD 12/26/9, RSI 14, raw Stochastic 14 and SMA 3, DMI/ADX 14, relative volume 20, and close-position estimated volume pressure with EMA 10. Directional component weights are 23/18/15/12/12/10/10 percent. The eight confirmation conditions and ADX thresholds follow the inspected source.

Add it using Indicators -> Next Candle Predictor. Inputs control the trend, ATR, confluence, relative volume, ADX, analysis table, trend fill and scenario candles. Buy/sell and strong-setup event outputs are available to the app's existing alert/rule builder; adding the study does not create alerts or place orders.

The default excludes the newest candle. “All completed” is for datasets known to contain only completed candles. Scores and setup signals are withheld until a full 100-value ATR rank window exists (113 bars with default ATR 14). This conservative warmup may differ from Pine's early-history behavior. Missing/zero volume disables volume-dependent setups. The original source's initial downtrend convention is retained.

Green/red trend lines, translucent fills, buy/sell labels, strong-setup markers and a two-sided analysis table are provided. The native marker API uses circles for strong-setup marks instead of Pine diamonds. Scenario candles illustrate ATR-scaled alternatives; pan the chart left to make future space visible. The table uses the latest completed bar, including during replay. Multi-timeframe overlay rendering is not supported: use the chart timeframe for this study.

The percentages are normalized rule-based scores, not statistical probabilities, win rates or forecasts. Estimated volume pressure is OHLCV-derived, not observed bid/ask delta. This adaptation has causal-prefix and forming-candle tests; exact numeric/visual parity with TradingView has not been established on a shared candle dataset.

This local addition has not been published to GitHub. Preserve source attribution and review applicable source licensing before redistribution.
