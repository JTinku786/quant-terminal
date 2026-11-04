# Flux order-block validation

PASS · 20 symbols · September 24 through October 23, 2026 · 5m candles · no session restriction.

|Symbol|Blocks|Retests|Asia|London|NY AM|NY PM|Other hours|Checks|
|---|---:|---:|---:|---:|---:|---:|---:|---|
|NZDUSD|201|223|30|36|25|16|94|PASS|
|EURUSD|228|232|35|36|36|23|98|PASS|
|GBPUSD|197|260|28|37|25|15|92|PASS|
|USDJPY|199|253|35|30|27|16|91|PASS|
|AUDUSD|198|206|33|32|29|20|84|PASS|
|USDCAD|227|229|30|31|36|24|106|PASS|
|USDCHF|216|240|42|30|31|21|92|PASS|
|EURJPY|216|286|48|29|35|22|82|PASS|
|GBPJPY|201|236|38|32|29|13|89|PASS|
|AUDJPY|169|226|37|22|26|17|67|PASS|
|EURGBP|221|240|32|33|30|19|107|PASS|
|CHFJPY|194|251|34|31|33|8|88|PASS|
|SPY|68|74|0|0|3|27|38|PASS|
|QQQ|56|60|0|0|2|23|31|PASS|
|AAPL|44|49|0|0|1|22|21|PASS|
|MSFT|54|54|0|0|5|21|28|PASS|
|JPM|55|50|0|0|9|23|23|PASS|
|XOM|59|64|0|0|6|22|31|PASS|
|IBM|67|49|0|0|7|25|35|PASS|
|GS|57|61|0|0|8|22|27|PASS|

Checks: every block POC/volume/anchor prices/prior-BOS availability, every retest OHLC and spacing, prefix replay at every creation plus five other cutoffs. Full TradingView runtime parity is unverified. No trade returns are inferred from indicator events. Volume is chart-candle direction, not aggressor-side order flow.
