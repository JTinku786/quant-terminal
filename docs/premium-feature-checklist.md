# Local premium-feature checklist

Target: the user's supplied TradingView Premium feature list, implemented locally without a
subscription or artificial account quotas. This is a source-code inventory, not a claim that
all features have been verified or that paid exchange data can be obtained for free.

| Requested feature | Current local status | Work / evidence still required |
| --- | --- | --- |
| Charts per tab | Layouts through 16 charts implemented | Verify every layout with original forex/US/India data; requested Premium count unspecified |
| 25 indicators per chart | No per-chart indicator quota in app | Load/performance checks for many indicators |
| 20K historical bars | Chart/import limit is 20,000 | Source history may be shorter; add durable local archive and pagination for larger studies |
| 50 parallel chart connections | Not established | Define concurrent chart/data subscriptions and verify resource use; no promise of unlimited capacity |
| 400 price alerts | No subscription quota in alert list | Load test evaluator, source rate limits, error visibility and persistence at this population |
| 400 technical alerts | Same shared alert engine | Load test and independently reconcile indicator rules and candle-close timing |
| 2 watchlist alerts | Multiple watchlist alerts implemented without this quota | Validate symbol-level deduplication and scheduler capacity |
| Web, desktop and mobile apps | Local web app and Windows launcher | Responsive/mobile controls, installable app and secure remote access remain separate work |
| No ads | Disable built-in Academy promotional ribbon at startup | No paid subscription prompts should be introduced into research flows |
| Volume profile | Visible-range and session profile tools present | Inspect volume provenance; disclose candle-distributed estimates where applicable |
| Custom timeframes | Parser/aggregation supports custom intervals | Session/timezone/partial-bar verification per market |
| Custom range bars | Range chart transformation present | Verify brick construction, configuration and underlying-data limitations |
| Multiple watchlists | Implemented | Existing Titania US, India and Dow lists retained |
| Bar Replay | Chart stepping and synchronized replay implemented | Continue no-future-data checks across features; entry-only preview added for REV |
| Indicators on indicators | Implemented | Verify selected chains and higher-timeframe completion rules |
| Chart data export | Bars/indicator CSV and screenshots implemented | Browser download validation per requested output |
| Intraday Renko/Kagi/Line Break/Point & Figure | Transformations implemented | Candle-derived paths are not observed tick paths; independently verify expected behavior |
| Custom-formula charts | Ratio/spread arithmetic implemented | Verify supported expression grammar and matching timestamps/sessions |
| Multi-condition alerts | Up to five conditions with all/any matching | Show freshness/errors and independently verify bar-close availability |
| Second-based intervals | Binance 1-second crypto path documented | Not available across all markets; requires suitable source or captured real trades |
| Time price opportunity (TPO) | Not implemented | Build session-aware time-at-price display; explicit bucket/resolution controls |
| Volume footprint | Not implemented | Requires appropriate trades/side/volume data, or an explicitly labelled estimate; OHLC alone cannot establish actual aggressor-side volume |
| Volume candles | Not implemented | Add visual volume-scaled candle mode; refuse misleading displays where source volume is absent |
| Auto chart patterns | Basic candle-pattern indicators exist | Structural chart-pattern detector, confidence/confirmation and no-repainting tests still required |
| Non-expiring alerts | No expiration field in existing local alerts | Requires the local computer/app to keep running; not cloud uptime |
| Invite-only script publishing | Local custom scripts only | Authenticated sharing/permissions/hosting is a separate service, not a local editor feature |

## Delivery order

1. Stabilize existing chart, drawing, export and alert flows; remove promotions. Make alert
   data freshness and fetch failures visible. Preserve saved layouts and source evidence.
2. Add local candle storage/pagination and robust source/session/timezone provenance.
   Validate signal and order timing against the existing Python engine.
3. Add volume candles, TPO and causally confirmed structural chart patterns, with tests.
4. Add footprint only for sources with suitable trade data. Clearly separate trade-based
   measurements from candle-derived estimates and unavailable forex volume.
5. Establish mobile/desktop access, simultaneous-chart and alert-load limits, and optional
   authenticated script sharing. A local-only app does not provide free hosted cloud uptime.

## Acceptance criteria

Each feature must have an explicit data source, behavior definition, useful verification,
and an observed UI/API outcome before it is marked equivalent. No access to TradingView
Premium data is implied, and no new paid feeds, broker connections or account services are
authorized by this checklist. Existing trading systems remain unchanged.
