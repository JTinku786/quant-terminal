# REV-k1_reclaim3-OTE62-2R-MARKET integration

Open http://localhost:3777/#ict, or choose **ICT Strategies** at the bottom.
Choose a pair, click **Show original chart + indicator**, and use **Run replay test**.
The imported chart is the original completed 5m price series; its setup detector used 1H candles.
Arrows mean a stored eligible setup became known, not that a broker filled it.
The optional standalone indicator's three lines are the original planned OTE entry, structural stop
and OTE-anchored 2R target. They remain reference lines until the next eligible setup.
The **Show original chart + indicator** button now draws the entered replay trades instead:
green target and red risk boxes, BUY/LONG or SELL/SHORT at the modeled fill, planned reward/risk,
and TP/SL exit markers at modeled exit prices. Skipped setups do not receive trade boxes.

Each entered row offers **At entry** and **Entry + exit**. **At entry** starts paused replay with
only the entry candle's opening price: its high, low, close and volume have not been revealed.
It hides the results panel and future exits. Step forward to reveal completed candles.
The target box initially projects a fixed hour, so its width does not disclose the future trade
duration. An exit appears only when its recorded observation time has passed. **Entry + exit**
shows the completed trade after the fact. Both views use the cost settings of the last replay run.

## Scope

This is a stored-signal replay, not a JavaScript port of the detector. It uses the source's
`realtime_production_reversal_k1_setups` view and canonical completed raw5m loader.
The exporter enforces a read-only, repeatable-read database transaction. It does not call
the scanner, create schemas, refresh upstream data, import the broker execution module,
send notifications or place orders. No ICT_Automation source files are changed.

The selected source route currently trades forex 1H setups only. Historical US/India
extensions would be separate research variants. All 12 forex pairs are included, even
when a pair has no stored signals in the snapshot window.

## Rules and prices

- A signal is available at its native `observed_at`, never at the earlier OTE touch.
- Original entry validation, risk guard, session exclusions and 1H-duplicate flags are checked.
  Session definitions are extracted from pure AST definitions in the source route; no
  broker-module top-level code is executed.
- The replay opens at the original 5m candle open at that exact observation time, adjusted
  by the selected spread and slippage. Off-grid or absent candles are not interpolated.
- Original stop and target levels stay fixed. The market-entry reward/risk must be >=0.786.
  Consequently, the original target's `2R` label does not imply +2R from a different market fill.
- A target is a resting touch exit. The strategy stop requires a strict raw5m close beyond
  the stop, allowing source rounding epsilon. Its market exit is at the next available open.
  This is deliberately a causal fill estimate, not a same-close guaranteed fill.
- The disaster stop is another 1R beyond the strategy stop, where R uses the modeled
  market fill. Target plus disaster-stop touches in one candle are unresolved unless the
  open establishes which exit already triggered. Target touch precedes a close-only stop.
- One open position per pair and one entered trade per setup. Signals arriving while a
  position is open are skipped. Unresolved trades block subsequent entries on that pair.
- Missing expected raw5m candles while a trade is open make its result unresolved. Closed
  P&L excludes unresolved and still-open trades; no forced end-of-data close is fabricated.
- Every pair starts independently at $10,000 and risks 0.5% by default. These are research
  risk-normalized units. Portfolio caps, 500k-unit caps, home-currency conversion, financing,
  live discovery latency, the operational go-live boundary and real bid/ask execution are
  not reproduced. This result must not be called the account's historical P&L.
- Spread and slippage are sensitivities, not historical quote observations. The defaults
  are 1 bp spread and 0.1 bp slippage per side. 1 bp = 0.01%.

`public/ict/manifest.json` records the source policy/detector hashes, snapshot dates,
source version, pair populations and missing-bar counts. Each snapshot also retains its
original signal evidence and a content hash. This is a saved snapshot, not automatic live sync.
The evidence export records the source manifest and test settings alongside every decision.

## Refresh and verification

From the quant-terminal directory, the installed Python interpreter can run
`scripts/export-ict-rev.py --start YYYY-MM-DD --end YYYY-MM-DD` (end is exclusive, NY time).
The local terminal must already be running to receive the original-candle imports.
The source project supplies its existing Python dependencies and database configuration.
The terminal itself still runs on Node.js; no new packages were installed.
Refresh the browser after export so the custom indicators reload. The exporter rejects
windows exceeding the terminal's 20,000-bar chart limit instead of silently truncating them.

Run `node --test test/ict-rev.test.js` for the integration's timing, stop/target, coverage,
friction, prefix-causality and deterministic snapshot checks. `node scripts/check.js` also
includes these tests alongside the original offline and live smoke tests.

Do not run the ordinary generic indicator-rule tester on these overlays and treat its
results as equivalent: its percentage stops and next-bar signals use different semantics.
Use **ICT Strategies** for this replay. Parameter tuning or new setup discovery requires
the original detector, a separate historical experiment, and chronological validation.

Vendor app updates may overwrite public/js, public/lib and scripts changes. Preserve this
integration's source files before updating; a preserved data directory alone is insufficient.
