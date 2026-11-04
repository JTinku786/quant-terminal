# Quarterly Divider

Local adaptation of [Quarterly Divider by TheClairvoyant_Trader](https://www.tradingview.com/script/XbaQDmrT-Quarterly-Divider/), retrieved October 24, 2026. The original Pine script is preserved in research/quarterly-divider/original.pine. Original attribution and MPL 2.0 notice are retained.

Installed on the daily pane. It draws a full-height vertical line and quarter/year label on the first available candle after each January, April, July or October boundary, from 2023 onward. It also works on weekly charts: a boundary inside a weekly candle is marked on the following weekly candle, matching the source's bar-open crossing rule. The first loaded candle is not given a fabricated boundary when there is no prior candle.

Pine uses the instrument exchange's timezone. This local version explicitly defaults to America/New_York to match this workspace, with UTC, London and Kolkata alternatives in indicator settings. Lines use the indicator output colour setting; width is configurable from 1–5. Labels can be turned off. Unlike the source's price-relative label position, local labels sit at the chart bottom; the year is appended for clarity. No entry/exit signals or alerts are implied.

Checked all four quarter transitions, New York versus UTC midnight, a weekly candle spanning July 1, absence of a previous candle, custom-indicator registration, and visible rendering in the four-chart layout. Layout backup is in data/layouts/before-quarterly-divider-*.json; the updated preset is data/layouts/ict-engine-with-quarters.json. Volume profile remains only on the 1-hour chart.
