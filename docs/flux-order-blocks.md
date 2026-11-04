# Flux Charts Order Blocks Volume Delta 3D — local adaptation

Original source © fluxchart, [TradingView publication](https://www.tradingview.com/script/EtDoAmOi-Order-Blocks-Volume-Delta-3D-Flux-Charts/). Original Pine code is in research/flux-order-blocks-volume-delta/original.pine. The local JavaScript adaptation retains the MPL 2.0 notice.

Installed on the 5-minute chart. There is **no session filter**: Asia, London, New York and other trading hours are all scanned. Sessions in labels describe when a block was confirmed; they do not manufacture a block in every session. A block still requires a confirmed swing, closed-bar structure break, valid POC anchor, no directional candle gap from anchor to break, and no overlap with an already-active block. Nearest defaults to three bullish and three bearish blocks, matching the source; old or distant blocks may therefore be absent from view.

## Calculation

- Symmetric confirmed pivots, length 5 by default. A close crosses a swing to establish BOS. The source delays creation to the next bar; local creation events record the next bar's timestamp separately from the BOS candle.
- Between swing and BOS, a 40-row price grid counts wick intersections. The first row with the most intersections supplies the POC price. It is **most-touched price**, not volume-at-price.
- Scan backwards from BOS to swing for the earliest POC-touching candle whose low (bullish) or high (bearish) survives the later leg. Its entire wick range becomes the block. Reject directional price gaps and overlapping active blocks.
- Volume is seeded once from candles touching that POC. The source does not accumulate new volume into the block after creation. Total, up-candle and down-candle volumes are retained.
- The actual original code leaves doji volume in total but excludes it from both directional sums, despite the publication description saying an even split. The adaptation preserves the code. Display says `up / other` because the second percentage is 100 minus the up percentage, including doji volume; it must not be called actual seller volume.
- Wick or prior-close invalidation, prior-candle retests, and a minimum four-bar spacing between same-side retest alerts follow the source. A retest is not an automatic entry or a guarantee the zone will hold.

## Local differences

Local processing uses completed chart candles and supports chart-timeframe volume only. Intrabar wick invalidation may therefore appear later than Pine's live-tick drawing updates. Native TradingView output parity has not been independently certified. A lower-timeframe volume feed is not silently approximated; the first version deliberately does not expose that unsupported option.

Boxes begin at the known confirmation bar instead of being painted backwards to an earlier anchor. Original anchor times remain in evidence. 3D rendering uses simple canvas depth faces; it is not a pixel-identical recreation of Pine polylines. All percentages are candle-direction estimates, not bid/ask aggressor flow, and provider forex volume is not exchange-wide traded units.

The pre-existing WillyAlgoTrader strategy stays on the 5m chart with its own zone boxes hidden so Flux boxes are identifiable. Its entry/SL/TP lines remain separate strategy illustrations. Flux itself does not supply those trade rules. Daily quarter dividers and the 1-hour volume profile are preserved. The previous complete layout is backed up in data/layouts/before-flux-*.json, and the updated layout is data/layouts/ict-flux-all-sessions.json.

## Checks

`node --test test/flux-order-blocks.test.js` checks pivot confirmation, touch-count POC, exact source doji handling, earliest surviving anchor, gap rejection, session names, missing newest candle and future-prefix stability.

`node scripts/validate-flux-blocks.js` audits the existing 20-symbol, 30-day snapshot, checking every new block's POC, seeded volumes, anchor candle and BOS timing; every retest's OHLC and side spacing; and prefix replay at every creation plus five other history cutoffs. See flux-blocks-validation.md and data/flux-blocks/validation.json. These are indicator checks, not profitability tests.
