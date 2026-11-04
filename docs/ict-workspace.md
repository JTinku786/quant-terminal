# Four-timeframe ICT workspace

This saved local layout uses NZDUSD original completed candles. It is a chart-review workspace,
not a performance-selected strategy, a Pine Script interpreter or a copy of a third-party script.
No single indicator is established as the best. The selection matches the user's ICT workflow.

| Position | Frame | Selected studies | Role |
| --- | --- | --- | --- |
| Top left | 1D | Prior completed weekly H/L, confirmed swings and their midpoint, active FVG midpoints | Locate liquidity and range context; midpoint alone is not directional bias |
| Top right | 1H | Confirmed swings, local close-break/raid labels, swing-range midpoint, FVG boundaries | Review structure and displacement gaps |
| Bottom left | 30m | Prior completed daily H/L, FVG midpoints, observed Asia H/L and NY midnight open | Inspect setup location and session context |
| Bottom right | 5m | Prior completed daily H/L, FVG midpoints, local break/raid hints, session levels, existing REV replay risk boxes | Review entries and exits with original strategy rules |

The classic-style palette is white (#FFFFFF) with blue up candles (#2962FF) and black down
candles (#000000). This is a selected ICT-style interpretation, not an exact match to an
unspecified reference image. Change it under Settings -> Chart colours. Red/green risk boxes
still identify risk and reward; candle direction uses the blue/black palette.

## Why this selection

The ICT Goldhunter Playbook's model rules (slides 009–015, 021–033, 051–059) emphasize
higher-timeframe liquidity, previous highs/lows, price structure and correctly formed FVGs.
The Strategy Validator requires actual candle evidence and honest confirmation timing.
These chart tools help inspect those concepts; they do not merge distinct models into a new
mandatory signal checklist or change REV-k1_reclaim3-OTE62-2R-MARKET.

TradingView references reviewed:
- https://www.tradingview.com/script/ib4uqBJx-ICT-Concepts-LuxAlgo/
- https://www.tradingview.com/script/PMWhL0t7-ICT-Sessions-Killzones/

Those pages describe comparable ICT tools. They do not establish a profitable or best indicator.
The local study implementations are independent and labelled LOCAL_ADAPTATION.

## Definitions and limits

- A swing requires two strictly lower highs or higher lows on each side by default. It becomes
  available only on the closing confirmation bar, not retrospectively at the pivot's time.
- A close-break hint is a close beyond a confirmed swing; a wick raid crosses it and closes back
  inside. These are local chart hints, not validated SMC-package BOS/CHOCH, CISD or a complete MSS.
  Display labels are spaced out; full detection events remain in the calculation metadata.
- A bullish FVG is candle one's high to candle three's low. A bearish FVG is candle three's high
  to candle one's low. Candle three must be complete. Missing/unequal interval gaps are not
  bridged. Each direction shows its latest active gap; a full wick fill retires it prospectively.
  A midpoint is a reference, not an automatic entry or proof of displacement quality.
- Prior-day and prior-week levels come from complete canonical source rollups and are exposed
  only once their knownAt is reached. Source clock: NY calendar days, with Sunday merged into
  Monday, matching the existing reversal loader. This is not an asserted broker 17:00 daily close.
  A weekly reference requires all five complete weekday constituents.
- References are bound to the imported NZDUSD source symbols. A different symbol fails closed
  rather than displaying NZDUSD's cached levels. Other pairs need their own prepared references.
- Asia is the observed 20:00–00:00 New York range. London 02:00 and NY 07:00 are clock labels.
  These selected civil-time defaults follow daylight saving changes; they are local adaptations
  because the lesson collection contains differing session/EST conventions. Incomplete observed
  sessions are not asserted as complete sessions, and a session label is not an entry trigger.
- General custom indicators exclude the newest candle by default for safe live use. This workspace
  explicitly uses all supplied completed bars because the imported snapshot is completed data.
  Switch back to the safe-live setting if moving an indicator to a live feed.
- SMT is not displayed without a synchronized comparator. Order blocks, breakers, CISD and
  iFVG are not fabricated from a simple colored candle or ordinary close break. Volume profile,
  VWAP and volume footprint were omitted from the initial preset. The imported Barchart/derived_1m candles contain positive provider volume, but its units and comparability across sources are not established. Optional volume profiles distribute each candle volume evenly across touched price bins; their green/red split is candle direction, not buyer/seller aggressor volume. They are estimates, not exchange-wide forex traded volume.
- This is a snapshot through 2026-10-23, not automatic live detection. Existing REV risk boxes
  remain stored-signal replay estimates. None of this changes the original strategy or broker routes.

## Reproduce / restore

The existing installed Python can run `scripts/prepare-ict-workspace.py`; Node can then run
`scripts/setup-ict-workspace.js`. The first uses a read-only source DB transaction, the second
backs up the current layout under `data/ict-workspace/layout-before-*.json` before applying four
charts. No new packages or paid services are needed. Prepared source coverage and fingerprints
are in `data/ict-workspace/prepared.json`.

Verification: `node --test test/ict-studies.test.js test/ict-rev.test.js`, followed by
`node scripts/check.js` and browser inspection of all four charts, their indicators and colours.
