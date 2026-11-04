# Liquidity displacement pullback — experimental

Any one of the four local liquidity studies can start a setup. Sweeper is interpreted as Liquidity Swings. Only areas already known at the candle close count; overlapping areas are grouped by direction. A new contact requires leaving and re-entering the area.

Long: contact sellside/green area; bullish ICT displacement within the next 1–3 candles (contact candle excluded); bearish ICT displacement on the next or following candle whose close is inside the bullish displacement high–low range, inclusive. Wicks may leave the range. Short mirrors this. Both displacement candles use the original ICT Concepts body/SMA and wick test.

Enter the following candle open. Stop choices: initial displacement extreme, known liquidity-leg extreme from contact through pullback, or farther of both. Target = actual entry plus/minus 1.7 times actual entry-to-stop distance. Invalid stop geometry skips entry. Only one position at a time. No extra FVG, structure or session condition.

BUY/SELL arrows mark entries; D1 marks first displacement; Pullback D2 marks second. Red position box is risk; green box is target. TP/SL markers show historical exits. Experimental indicator settings control wait, stop, area touch/sweep, RR and positions displayed.

Database sample: 4455 completed RELIANCE 5m bars, 2026-07-31T04:00:00.000Z through 2026-10-28T09:45:00.000Z. This is a saved database snapshot, not a live database connection.

| Wait | Stop | Entries | Closed | Wins | Ambiguous | Gross R |
|---|---|---:|---:|---:|---:|---:|
|1|Initial|2|2|1|0|0.70|
|1|Swing|2|2|0|0|-2.00|
|1|Farther|2|2|0|0|-2.00|
|2|Initial|3|3|2|0|2.40|
|2|Swing|3|3|1|0|-0.30|
|2|Farther|3|3|1|0|-0.30|
|3|Initial|6|6|3|1|2.10|
|3|Swing|6|6|3|0|2.10|
|3|Farther|6|6|3|0|2.10|

These are experiments, not a parameter recommendation. Spread, fees and slippage are excluded. Same-bar stop/target is flagged and counted stop-first. Full TradingView drawing parity remains unverified.
