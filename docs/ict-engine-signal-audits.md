# Signal candle audits

Virtual source-policy decisions, not executable same-close broker fills. Full raw candle evidence is in data/ict-engine/candles, and per-signal evidence in data/ict-engine/<SYMBOL>-evidence.json.

## NZDUSD trade-8466-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-30T11:55:00.000Z at 0.56446 (swing low); setup known 2026-09-30T12:35:00.000Z; decision known 2026-09-30T13:40:00.000Z; entry 0.5646, initial SL 0.56438, TP 0.56482, 0.56504, 0.56526. Decision candle OHLC 0.56514, 0.56515, 0.56456, 0.5646.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## NZDUSD trade-9829-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-07T06:00:00.000Z at 0.56024 (NY AM L); setup known 2026-10-07T06:35:00.000Z; decision known 2026-10-07T07:20:00.000Z; entry 0.5605, initial SL 0.56029, TP 0.56071, 0.56092, 0.56113. Decision candle OHLC 0.56055, 0.56056, 0.56034, 0.5605.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## NZDUSD trade-11229--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-14T03:10:00.000Z at 0.56284 (PWH); setup known 2026-10-14T03:50:00.000Z; decision known 2026-10-14T04:00:00.000Z; entry 0.56222, initial SL 0.56231, TP 0.56213, 0.56204, 0.56195. Decision candle OHLC 0.56214, 0.56224, 0.56208, 0.56222.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## NZDUSD trade-12199--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-19T10:55:00.000Z at 0.56697 (NY AM H); setup known 2026-10-19T12:40:00.000Z; decision known 2026-10-19T12:50:00.000Z; entry 0.56701, initial SL 0.56713, TP 0.56689, 0.56677, 0.56665. Decision candle OHLC 0.56678, 0.56703, 0.56672, 0.56701.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## NZDUSD trade-12661--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-21T02:05:00.000Z at 0.56804 (swing high); setup known 2026-10-21T03:15:00.000Z; decision known 2026-10-21T03:20:00.000Z; entry 0.5678, initial SL 0.56789, TP 0.56771, 0.56762, 0.56753. Decision candle OHLC 0.56764, 0.5678, 0.56764, 0.5678.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-7457-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-25T00:30:00.000Z at 1.13709 (swing low); setup known 2026-09-25T01:10:00.000Z; decision known 2026-09-25T01:30:00.000Z; entry 1.13776, initial SL 1.13765, TP 1.13787, 1.13798, 1.13809. Decision candle OHLC 1.13792, 1.13798, 1.13772, 1.13776.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-7869-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-28T10:00:00.000Z at 1.13728 (swing low); setup known 2026-09-28T11:30:00.000Z; decision known 2026-09-28T11:50:00.000Z; entry 1.1373, initial SL 1.13714, TP 1.13746, 1.13762, 1.13778. Decision candle OHLC 1.13756, 1.13757, 1.13721, 1.1373.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-8325-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-30T00:20:00.000Z at 1.13371 (swing low); setup known 2026-09-30T01:30:00.000Z; decision known 2026-09-30T01:50:00.000Z; entry 1.13358, initial SL 1.13345, TP 1.13371, 1.13384, 1.13397. Decision candle OHLC 1.13402, 1.13402, 1.13356, 1.13358.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-9017-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-02T10:20:00.000Z at 1.12316 (Asia L); setup known 2026-10-02T11:25:00.000Z; decision known 2026-10-02T11:30:00.000Z; entry 1.12378, initial SL 1.12354, TP 1.12402, 1.12426, 1.1245. Decision candle OHLC 1.12405, 1.12417, 1.12372, 1.12378.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## EURUSD trade-10184-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-08T11:05:00.000Z at 1.1176 (swing low); setup known 2026-10-08T12:15:00.000Z; decision known 2026-10-08T12:50:00.000Z; entry 1.1185, initial SL 1.11822, TP 1.11878, 1.11906, 1.11934. Decision candle OHLC 1.11865, 1.11882, 1.11834, 1.1185.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-10692-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-12T06:00:00.000Z at 1.11994 (swing low); setup known 2026-10-12T06:30:00.000Z; decision known 2026-10-12T07:10:00.000Z; entry 1.12032, initial SL 1.12003, TP 1.12061, 1.1209, 1.12119. Decision candle OHLC 1.12047, 1.12052, 1.1201, 1.12032.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## EURUSD trade-11273--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-14T06:40:00.000Z at 1.12113 (swing high); setup known 2026-10-14T07:15:00.000Z; decision known 2026-10-14T07:35:00.000Z; entry 1.12066, initial SL 1.12089, TP 1.12043, 1.1202, 1.11997. Decision candle OHLC 1.12062, 1.12082, 1.12061, 1.12066.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-11556--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-15T05:50:00.000Z at 1.12178 (swing high); setup known 2026-10-15T06:40:00.000Z; decision known 2026-10-15T07:10:00.000Z; entry 1.12125, initial SL 1.12173, TP 1.12077, 1.12029, 1.11981. Decision candle OHLC 1.121, 1.12162, 1.12081, 1.12125.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-11782--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-16T01:15:00.000Z at 1.12156 (swing high); setup known 2026-10-16T01:45:00.000Z; decision known 2026-10-16T02:00:00.000Z; entry 1.12132, initial SL 1.12142, TP 1.12122, 1.12112, 1.12102. Decision candle OHLC 1.12117, 1.12133, 1.12114, 1.12132.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-12200--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-19T10:55:00.000Z at 1.12178 (swing high); setup known 2026-10-19T12:20:00.000Z; decision known 2026-10-19T12:50:00.000Z; entry 1.12228, initial SL 1.1225, TP 1.12206, 1.12184, 1.12162. Decision candle OHLC 1.1215, 1.12234, 1.12145, 1.12228.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-12348--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-20T00:10:00.000Z at 1.12182 (NY PM H); setup known 2026-10-20T01:05:00.000Z; decision known 2026-10-20T01:10:00.000Z; entry 1.12166, initial SL 1.12181, TP 1.12151, 1.12136, 1.12121. Decision candle OHLC 1.12142, 1.12176, 1.12142, 1.12166.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-12650-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-21T01:45:00.000Z at 1.12244 (swing low); setup known 2026-10-21T02:15:00.000Z; decision known 2026-10-21T02:20:00.000Z; entry 1.12278, initial SL 1.12264, TP 1.12292, 1.12306, 1.1232. Decision candle OHLC 1.12312, 1.12313, 1.1227, 1.12278.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-12776--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-21T12:00:00.000Z at 1.12338 (swing high); setup known 2026-10-21T12:35:00.000Z; decision known 2026-10-21T12:50:00.000Z; entry 1.1231, initial SL 1.12325, TP 1.12295, 1.1228, 1.12265. Decision candle OHLC 1.12305, 1.12312, 1.12296, 1.1231.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURUSD trade-13214--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-23T00:35:00.000Z at 1.12256 (NY PM H); setup known 2026-10-23T01:00:00.000Z; decision known 2026-10-23T01:20:00.000Z; entry 1.12216, initial SL 1.1224, TP 1.12192, 1.12168, 1.12144. Decision candle OHLC 1.1221, 1.12234, 1.122, 1.12216.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## GBPUSD trade-7788-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-28T06:20:00.000Z at 1.32333 (swing low); setup known 2026-09-28T06:50:00.000Z; decision known 2026-09-28T06:55:00.000Z; entry 1.32382, initial SL 1.32365, TP 1.32399, 1.32416, 1.32433. Decision candle OHLC 1.32414, 1.32416, 1.32376, 1.32382.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## GBPUSD trade-9810--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-07T05:45:00.000Z at 1.32513 (swing high); setup known 2026-10-07T07:20:00.000Z; decision known 2026-10-07T07:25:00.000Z; entry 1.32497, initial SL 1.32517, TP 1.32477, 1.32457, 1.32437. Decision candle OHLC 1.32444, 1.32498, 1.32434, 1.32497.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## GBPUSD trade-10045-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-08T00:55:00.000Z at 1.32081 (swing low); setup known 2026-10-08T01:45:00.000Z; decision known 2026-10-08T03:00:00.000Z; entry 1.32129, initial SL 1.32112, TP 1.32146, 1.32163, 1.3218. Decision candle OHLC 1.32124, 1.3214, 1.32118, 1.32129.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## GBPUSD trade-10101-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-08T06:05:00.000Z at 1.31936 (PDL); setup known 2026-10-08T07:25:00.000Z; decision known 2026-10-08T07:40:00.000Z; entry 1.31974, initial SL 1.3195, TP 1.31998, 1.32022, 1.32046. Decision candle OHLC 1.31978, 1.32005, 1.31968, 1.31974.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## GBPUSD trade-12182--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-19T11:05:00.000Z at 1.33366 (London H); setup known 2026-10-19T12:35:00.000Z; decision known 2026-10-19T13:05:00.000Z; entry 1.33278, initial SL 1.33308, TP 1.33248, 1.33218, 1.33188. Decision candle OHLC 1.33253, 1.33296, 1.33234, 1.33278.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDJPY trade-7749-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-28T02:10:00.000Z at 157.701 (swing low); setup known 2026-09-28T03:25:00.000Z; decision known 2026-09-28T04:25:00.000Z; entry 157.723, initial SL 157.699, TP 157.747, 157.771, 157.795. Decision candle OHLC 157.723, 157.745, 157.712, 157.723.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDJPY trade-7861-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-28T12:05:00.000Z at 156.851 (swing low); setup known 2026-09-28T12:45:00.000Z; decision known 2026-09-28T13:45:00.000Z; entry 157.05, initial SL 157.012, TP 157.088, 157.126, 157.164. Decision candle OHLC 157.1, 157.118, 157.042, 157.05.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDJPY trade-8646--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-01T04:55:00.000Z at 158.3 (swing high); setup known 2026-10-01T06:15:00.000Z; decision known 2026-10-01T07:10:00.000Z; entry 158.282, initial SL 158.324, TP 158.24, 158.198, 158.156. Decision candle OHLC 158.265, 158.306, 158.262, 158.282.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## USDJPY trade-10089--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-08T05:35:00.000Z at 158.248 (swing high); setup known 2026-10-08T06:20:00.000Z; decision known 2026-10-08T07:35:00.000Z; entry 158.226, initial SL 158.254, TP 158.198, 158.17, 158.142. Decision candle OHLC 158.193, 158.242, 158.192, 158.226.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDJPY trade-10149--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-08T12:05:00.000Z at 158.296 (swing high); setup known 2026-10-08T12:30:00.000Z; decision known 2026-10-08T12:35:00.000Z; entry 158.228, initial SL 158.248, TP 158.208, 158.188, 158.168. Decision candle OHLC 158.166, 158.23, 158.163, 158.228.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## USDJPY trade-10306--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-09T00:45:00.000Z at 158.126 (swing high); setup known 2026-10-09T01:30:00.000Z; decision known 2026-10-09T01:40:00.000Z; entry 157.846, initial SL 157.9, TP 157.792, 157.738, 157.684. Decision candle OHLC 157.826, 157.884, 157.808, 157.846.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDJPY trade-11889-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-16T12:20:00.000Z at 157.964 (swing low); setup known 2026-10-16T13:25:00.000Z; decision known 2026-10-16T13:35:00.000Z; entry 158.01, initial SL 157.98, TP 158.04, 158.07, 158.1. Decision candle OHLC 158.055, 158.058, 157.992, 158.01.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDJPY trade-12114-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-19T07:00:00.000Z at 157.902 (swing low); setup known 2026-10-19T08:00:00.000Z; decision known 2026-10-19T08:20:00.000Z; entry 158.114, initial SL 158.087, TP 158.141, 158.168, 158.195. Decision candle OHLC 158.14, 158.142, 158.098, 158.114.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## USDJPY trade-12318--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-20T01:00:00.000Z at 158.6 (swing high); setup known 2026-10-20T01:15:00.000Z; decision known 2026-10-20T01:20:00.000Z; entry 158.55, initial SL 158.571, TP 158.529, 158.508, 158.487. Decision candle OHLC 158.509, 158.56, 158.483, 158.55.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDJPY trade-12409-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-20T07:05:00.000Z at 158.06 (swing low); setup known 2026-10-20T08:20:00.000Z; decision known 2026-10-20T08:55:00.000Z; entry 158.123, initial SL 158.093, TP 158.153, 158.183, 158.213. Decision candle OHLC 158.146, 158.158, 158.105, 158.123.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## AUDUSD trade-7824-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-28T07:05:00.000Z at 0.70142 (swing low); setup known 2026-09-28T08:00:00.000Z; decision known 2026-09-28T08:10:00.000Z; entry 0.70203, initial SL 0.7017, TP 0.70236, 0.70269, 0.70302. Decision candle OHLC 0.70224, 0.70226, 0.70178, 0.70203.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## AUDUSD trade-8397-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-30T06:45:00.000Z at 0.69678 (swing low); setup known 2026-09-30T07:20:00.000Z; decision known 2026-09-30T07:55:00.000Z; entry 0.69738, initial SL 0.69712, TP 0.69764, 0.6979, 0.69816. Decision candle OHLC 0.69756, 0.69758, 0.6972, 0.69738.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## AUDUSD trade-10407--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-09T04:45:00.000Z at 0.6978 (swing high); setup known 2026-10-09T06:30:00.000Z; decision known 2026-10-09T07:25:00.000Z; entry 0.69842, initial SL 0.69853, TP 0.69831, 0.6982, 0.69809. Decision candle OHLC 0.69846, 0.69848, 0.69823, 0.69842.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## AUDUSD trade-10916-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-12T23:55:00.000Z at 0.69558 (swing low); setup known 2026-10-13T00:50:00.000Z; decision known 2026-10-13T01:50:00.000Z; entry 0.69518, initial SL 0.69506, TP 0.6953, 0.69542, 0.69554. Decision candle OHLC 0.69528, 0.69534, 0.69512, 0.69518.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## AUDUSD trade-11764-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-15T23:25:00.000Z at 0.69172 (swing low); setup known 2026-10-16T00:10:00.000Z; decision known 2026-10-16T00:30:00.000Z; entry 0.69209, initial SL 0.69198, TP 0.6922, 0.69231, 0.69242. Decision candle OHLC 0.69222, 0.69222, 0.69203, 0.69209.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## AUDUSD trade-12342--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-19T23:05:00.000Z at 0.6982 (NY PM H); setup known 2026-10-20T00:25:00.000Z; decision known 2026-10-20T00:40:00.000Z; entry 0.69812, initial SL 0.69824, TP 0.698, 0.69788, 0.69776. Decision candle OHLC 0.69791, 0.69818, 0.6979, 0.69812.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## AUDUSD trade-13227--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-23T01:45:00.000Z at 0.7023 (swing high); setup known 2026-10-23T02:05:00.000Z; decision known 2026-10-23T02:25:00.000Z; entry 0.70152, initial SL 0.70168, TP 0.70136, 0.7012, 0.70104. Decision candle OHLC 0.70133, 0.70161, 0.70133, 0.70152.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## AUDUSD trade-13289--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-23T06:20:00.000Z at 0.70238 (Asia H); setup known 2026-10-23T07:25:00.000Z; decision known 2026-10-23T07:35:00.000Z; entry 0.702, initial SL 0.70217, TP 0.70183, 0.70166, 0.70149. Decision candle OHLC 0.70194, 0.7021, 0.7018, 0.702.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## AUDUSD trade-13320--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-23T08:15:00.000Z at 0.70233 (swing high); setup known 2026-10-23T08:50:00.000Z; decision known 2026-10-23T10:10:00.000Z; entry 0.70184, initial SL 0.702, TP 0.70168, 0.70152, 0.70136. Decision candle OHLC 0.70179, 0.70194, 0.70179, 0.70184.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCAD trade-9316--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-05T11:40:00.000Z at 1.42616 (swing high); setup known 2026-10-05T12:10:00.000Z; decision known 2026-10-05T12:25:00.000Z; entry 1.42564, initial SL 1.42588, TP 1.4254, 1.42516, 1.42492. Decision candle OHLC 1.42535, 1.42578, 1.42531, 1.42564.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCAD trade-9701-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-06T19:00:00.000Z at 1.42078 (swing low); setup known 2026-10-06T19:35:00.000Z; decision known 2026-10-06T20:30:00.000Z; entry 1.42092, initial SL 1.4208, TP 1.42104, 1.42116, 1.42128. Decision candle OHLC 1.42108, 1.42115, 1.4209, 1.42092.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCAD trade-10070--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-08T00:20:00.000Z at 1.4264 (swing high); setup known 2026-10-08T01:45:00.000Z; decision known 2026-10-08T03:15:00.000Z; entry 1.42648, initial SL 1.42661, TP 1.42635, 1.42622, 1.42609. Decision candle OHLC 1.42618, 1.42654, 1.42614, 1.42648.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## USDCAD trade-10183--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-08T11:05:00.000Z at 1.4268 (swing high); setup known 2026-10-08T12:30:00.000Z; decision known 2026-10-08T12:40:00.000Z; entry 1.42604, initial SL 1.42627, TP 1.42581, 1.42558, 1.42535. Decision candle OHLC 1.42565, 1.4261, 1.42565, 1.42604.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCAD trade-10251-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-08T17:00:00.000Z at 1.42406 (swing low); setup known 2026-10-08T18:15:00.000Z; decision known 2026-10-08T18:20:00.000Z; entry 1.423, initial SL 1.42264, TP 1.42336, 1.42372, 1.42408. Decision candle OHLC 1.4229, 1.42312, 1.42276, 1.423.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## USDCAD trade-11498-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-15T00:15:00.000Z at 1.4208 (NY AM L); setup known 2026-10-15T02:00:00.000Z; decision known 2026-10-15T02:15:00.000Z; entry 1.4207, initial SL 1.42049, TP 1.42091, 1.42112, 1.42133. Decision candle OHLC 1.42122, 1.42125, 1.42065, 1.4207.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCAD trade-11624-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-15T11:05:00.000Z at 1.41947 (London L); setup known 2026-10-15T12:15:00.000Z; decision known 2026-10-15T12:45:00.000Z; entry 1.42043, initial SL 1.41962, TP 1.42124, 1.42205, 1.42286. Decision candle OHLC 1.4203, 1.4205, 1.41978, 1.42043.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCHF trade-7857--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-28T12:40:00.000Z at 0.83234 (swing high); setup known 2026-09-28T13:30:00.000Z; decision known 2026-09-28T13:35:00.000Z; entry 0.83226, initial SL 0.83251, TP 0.83201, 0.83176, 0.83151. Decision candle OHLC 0.83177, 0.83241, 0.8317, 0.83226.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCHF trade-8350--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-30T04:35:00.000Z at 0.83464 (Asia H); setup known 2026-09-30T06:20:00.000Z; decision known 2026-09-30T06:40:00.000Z; entry 0.83376, initial SL 0.8339, TP 0.83362, 0.83348, 0.83334. Decision candle OHLC 0.83368, 0.8338, 0.83352, 0.83376.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCHF trade-8428--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-30T11:50:00.000Z at 0.83473 (swing high); setup known 2026-09-30T12:35:00.000Z; decision known 2026-09-30T13:10:00.000Z; entry 0.8341, initial SL 0.83438, TP 0.83382, 0.83354, 0.83326. Decision candle OHLC 0.83396, 0.83424, 0.83386, 0.8341.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCHF trade-9446--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-06T00:05:00.000Z at 0.83156 (swing high); setup known 2026-10-06T01:00:00.000Z; decision known 2026-10-06T02:30:00.000Z; entry 0.83141, initial SL 0.83155, TP 0.83127, 0.83113, 0.83099. Decision candle OHLC 0.83143, 0.8315, 0.83139, 0.83141.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCHF trade-10450-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-09T11:30:00.000Z at 0.83056 (swing low); setup known 2026-10-09T12:40:00.000Z; decision known 2026-10-09T14:10:00.000Z; entry 0.8314, initial SL 0.83104, TP 0.83176, 0.83212, 0.83248. Decision candle OHLC 0.83146, 0.8315, 0.83112, 0.8314.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCHF trade-11144--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-14T00:00:00.000Z at 0.83291 (swing high); setup known 2026-10-14T00:15:00.000Z; decision known 2026-10-14T00:25:00.000Z; entry 0.83273, initial SL 0.83279, TP 0.83267, 0.83261, 0.83255. Decision candle OHLC 0.83262, 0.83275, 0.83258, 0.83273.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## USDCHF trade-12101-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-19T06:40:00.000Z at 0.82392 (EQL); setup known 2026-10-19T07:40:00.000Z; decision known 2026-10-19T08:15:00.000Z; entry 0.82388, initial SL 0.82366, TP 0.8241, 0.82432, 0.82454. Decision candle OHLC 0.82412, 0.82418, 0.82376, 0.82388.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURJPY trade-8949-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-02T06:10:00.000Z at 177.396 (Asia L); setup known 2026-10-02T06:50:00.000Z; decision known 2026-10-02T07:40:00.000Z; entry 177.658, initial SL 177.57, TP 177.746, 177.834, 177.922. Decision candle OHLC 177.622, 177.688, 177.594, 177.658.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURJPY trade-9452-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-06T00:15:00.000Z at 177.041 (swing low); setup known 2026-10-06T01:15:00.000Z; decision known 2026-10-06T02:00:00.000Z; entry 177.154, initial SL 177.09, TP 177.218, 177.282, 177.346. Decision candle OHLC 177.136, 177.18, 177.104, 177.154.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURJPY trade-10151-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-08T11:35:00.000Z at 176.839 (swing low); setup known 2026-10-08T12:10:00.000Z; decision known 2026-10-08T12:15:00.000Z; entry 177.017, initial SL 176.957, TP 177.077, 177.137, 177.197. Decision candle OHLC 177.054, 177.084, 176.974, 177.017.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURJPY trade-10969-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-13T06:50:00.000Z at 176.782 (EQL); setup known 2026-10-13T07:20:00.000Z; decision known 2026-10-13T08:30:00.000Z; entry 176.902, initial SL 176.873, TP 176.931, 176.96, 176.989. Decision candle OHLC 176.964, 176.978, 176.89, 176.902.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURJPY trade-11546--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-15T07:10:00.000Z at 177.236 (Asia H); setup known 2026-10-15T08:00:00.000Z; decision known 2026-10-15T08:35:00.000Z; entry 177.071, initial SL 177.165, TP 176.977, 176.883, 176.789. Decision candle OHLC 177.09, 177.142, 177.054, 177.071.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURJPY trade-12338--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-20T01:20:00.000Z at 177.902 (swing high); setup known 2026-10-20T02:25:00.000Z; decision known 2026-10-20T02:35:00.000Z; entry 177.852, initial SL 177.873, TP 177.831, 177.81, 177.789. Decision candle OHLC 177.792, 177.858, 177.792, 177.852.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURJPY trade-12465-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-20T12:25:00.000Z at 177.203 (swing low); setup known 2026-10-20T12:50:00.000Z; decision known 2026-10-20T13:10:00.000Z; entry 177.392, initial SL 177.33, TP 177.454, 177.516, 177.578. Decision candle OHLC 177.41, 177.428, 177.348, 177.392.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## GBPJPY trade-8203-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-29T17:30:00.000Z at 207.908 (swing low); setup known 2026-09-29T17:55:00.000Z; decision known 2026-09-29T18:00:00.000Z; entry 207.972, initial SL 207.941, TP 208.003, 208.034, 208.065. Decision candle OHLC 208.026, 208.034, 207.972, 207.972.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## GBPJPY trade-11761--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-16T00:30:00.000Z at 209.912 (swing high); setup known 2026-10-16T02:05:00.000Z; decision known 2026-10-16T02:30:00.000Z; entry 209.843, initial SL 209.867, TP 209.819, 209.795, 209.771. Decision candle OHLC 209.809, 209.847, 209.808, 209.843.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## GBPJPY trade-12612--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-21T00:00:00.000Z at 211.709 (swing high); setup known 2026-10-21T01:10:00.000Z; decision known 2026-10-21T01:25:00.000Z; entry 211.762, initial SL 211.797, TP 211.727, 211.692, 211.657. Decision candle OHLC 211.746, 211.784, 211.72, 211.762.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## AUDJPY trade-8102-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-29T05:45:00.000Z at 109.905 (PDL); setup known 2026-09-29T06:45:00.000Z; decision known 2026-09-29T07:20:00.000Z; entry 110.018, initial SL 109.977, TP 110.059, 110.1, 110.141. Decision candle OHLC 110.036, 110.042, 110.004, 110.018.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## AUDJPY trade-8231-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-29T16:10:00.000Z at 109.846 (London L); setup known 2026-09-29T17:55:00.000Z; decision known 2026-09-29T18:05:00.000Z; entry 109.763, initial SL 109.725, TP 109.801, 109.839, 109.877. Decision candle OHLC 109.756, 109.784, 109.734, 109.763.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## AUDJPY trade-8341-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-30T01:20:00.000Z at 109.702 (NY PM L); setup known 2026-09-30T03:05:00.000Z; decision known 2026-09-30T03:15:00.000Z; entry 109.278, initial SL 109.203, TP 109.353, 109.428, 109.503. Decision candle OHLC 109.28, 109.308, 109.228, 109.278.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## AUDJPY trade-11606-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-15T09:30:00.000Z at 109.24 (London L); setup known 2026-10-15T11:15:00.000Z; decision known 2026-10-15T11:30:00.000Z; entry 109.22, initial SL 109.189, TP 109.251, 109.282, 109.313. Decision candle OHLC 109.261, 109.272, 109.202, 109.22.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## AUDJPY trade-13056-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-22T10:55:00.000Z at 109.957 (London L); setup known 2026-10-22T12:15:00.000Z; decision known 2026-10-22T12:20:00.000Z; entry 110.137, initial SL 110.083, TP 110.191, 110.245, 110.299. Decision candle OHLC 110.134, 110.148, 110.102, 110.137.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURGBP trade-10128--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-08T06:20:00.000Z at 0.84844 (swing high); setup known 2026-10-08T07:15:00.000Z; decision known 2026-10-08T08:05:00.000Z; entry 0.84786, initial SL 0.84819, TP 0.84753, 0.8472, 0.84687. Decision candle OHLC 0.84803, 0.84814, 0.84786, 0.84786.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURGBP trade-12184-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-19T10:15:00.000Z at 0.84092 (swing low); setup known 2026-10-19T11:20:00.000Z; decision known 2026-10-19T11:25:00.000Z; entry 0.84174, initial SL 0.84161, TP 0.84187, 0.842, 0.84213. Decision candle OHLC 0.84176, 0.84182, 0.84166, 0.84174.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## EURGBP trade-12666-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-21T01:45:00.000Z at 0.8394 (swing low); setup known 2026-10-21T03:30:00.000Z; decision known 2026-10-21T03:35:00.000Z; entry 0.83954, initial SL 0.83948, TP 0.8396, 0.83966, 0.83972. Decision candle OHLC 0.8395, 0.83955, 0.8395, 0.83954.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## CHFJPY trade-8015-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-09-28T23:50:00.000Z at 189.111 (swing low); setup known 2026-09-29T00:40:00.000Z; decision known 2026-09-29T00:50:00.000Z; entry 189.156, initial SL 189.124, TP 189.188, 189.22, 189.252. Decision candle OHLC 189.182, 189.29, 189.138, 189.156.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## CHFJPY trade-11524--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-15T06:10:00.000Z at 190.384 (swing high); setup known 2026-10-15T06:25:00.000Z; decision known 2026-10-15T06:30:00.000Z; entry 190.294, initial SL 190.33, TP 190.258, 190.222, 190.186. Decision candle OHLC 190.188, 190.31, 190.178, 190.294.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## CHFJPY trade-12106--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-19T06:50:00.000Z at 191.845 (swing high); setup known 2026-10-19T07:20:00.000Z; decision known 2026-10-19T07:25:00.000Z; entry 191.704, initial SL 191.738, TP 191.67, 191.636, 191.602. Decision candle OHLC 191.641, 191.704, 191.622, 191.704.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. Intrabar ambiguity present.

## CHFJPY trade-12327--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-20T01:20:00.000Z at 192.062 (swing high); setup known 2026-10-20T01:40:00.000Z; decision known 2026-10-20T01:50:00.000Z; entry 191.965, initial SL 192.01, TP 191.92, 191.875, 191.83. Decision candle OHLC 191.93, 191.996, 191.93, 191.965.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## CHFJPY trade-12745-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market forex, timeframe 5m; sweep 2026-10-21T11:25:00.000Z at 191.502 (swing low); setup known 2026-10-21T12:15:00.000Z; decision known 2026-10-21T12:40:00.000Z; entry 191.574, initial SL 191.542, TP 191.606, 191.638, 191.67. Decision candle OHLC 191.627, 191.66, 191.562, 191.574.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## SPY trade-3361-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market us, timeframe 5m; sweep 2026-10-20T19:20:00.000Z at 767.9450073242188 (swing low); setup known 2026-10-21T13:35:00.000Z; decision known 2026-10-21T14:10:00.000Z; entry 768.7805786132812, initial SL 768.37, TP 769.19, 769.6, 770.01. Decision candle OHLC 769.8699951171875, 769.9349975585938, 768.77001953125, 768.7805786132812.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## SPY trade-3423--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market us, timeframe 5m; sweep 2026-10-21T18:15:00.000Z at 774.280029296875 (swing high); setup known 2026-10-21T19:05:00.000Z; decision known 2026-10-21T19:20:00.000Z; entry 772.1921997070312, initial SL 772.52, TP 771.87, 771.54, 771.21. Decision candle OHLC 771.5999755859375, 772.3099975585938, 771.5599975585938, 772.1921997070312.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## AAPL trade-2650--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market us, timeframe 5m; sweep 2026-10-07T19:00:00.000Z at 337.2900085449219 (swing high); setup known 2026-10-07T19:35:00.000Z; decision known 2026-10-07T19:55:00.000Z; entry 336.6099853515625, initial SL 336.95, TP 336.27, 335.93, 335.59. Decision candle OHLC 336.2200012207031, 336.8299865722656, 335.8699951171875, 336.6099853515625.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## MSFT trade-3104--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market us, timeframe 5m; sweep 2026-10-15T17:45:00.000Z at 540.47998046875 (swing high); setup known 2026-10-15T18:25:00.000Z; decision known 2026-10-15T18:45:00.000Z; entry 539.9299926757812, initial SL 540.27, TP 539.59, 539.25, 538.91. Decision candle OHLC 539.510009765625, 539.969970703125, 539.3599853515625, 539.9299926757812.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## XOM trade-3036--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market us, timeframe 5m; sweep 2026-10-14T18:05:00.000Z at 177.35499572753906 (swing high); setup known 2026-10-14T19:30:00.000Z; decision known 2026-10-14T19:35:00.000Z; entry 176.86000061035156, initial SL 177.02, TP 176.71, 176.55, 176.39. Decision candle OHLC 176.6300048828125, 176.96633911132812, 176.60000610351562, 176.86000061035156.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## IBM trade-3276--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market us, timeframe 5m; sweep 2026-10-19T18:40:00.000Z at 237.8800048828125 (swing high); setup known 2026-10-19T19:40:00.000Z; decision known 2026-10-20T13:35:00.000Z; entry 237.7449951171875, initial SL 238.82, TP 236.67, 235.6, 234.52. Decision candle OHLC 236.0800018310547, 238.65499877929688, 236, 237.7449951171875.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## IBM trade-3434--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market us, timeframe 5m; sweep 2026-10-22T13:30:00.000Z at 251.75 (NY PM H); setup known 2026-10-22T13:40:00.000Z; decision known 2026-10-22T13:45:00.000Z; entry 247.83999633789062, initial SL 249.16, TP 246.52, 245.2, 243.88. Decision candle OHLC 245.0399932861328, 248.57000732421875, 244.3800048828125, 247.83999633789062.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## IBM trade-3514--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market us, timeframe 5m; sweep 2026-10-22T18:55:00.000Z at 250.55780029296875 (swing high); setup known 2026-10-23T13:50:00.000Z; decision known 2026-10-23T13:55:00.000Z; entry 248.94000244140625, initial SL 250.13, TP 247.76, 246.57, 245.38. Decision candle OHLC 247.69000244140625, 249.73109436035156, 247.69000244140625, 248.94000244140625.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## GS trade-2553-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market us, timeframe 5m; sweep 2026-10-06T16:45:00.000Z at 898.010009765625 (swing low); setup known 2026-10-06T18:10:00.000Z; decision known 2026-10-06T18:20:00.000Z; entry 898.52001953125, initial SL 898.02, TP 899.02, 899.52, 900.02. Decision candle OHLC 899.0700073242188, 899.1199951171875, 898.5, 898.52001953125.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## GS trade-3271-1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market us, timeframe 5m; sweep 2026-10-19T17:45:00.000Z at 876.8099975585938 (NY PM L); setup known 2026-10-19T19:25:00.000Z; decision known 2026-10-19T19:40:00.000Z; entry 874.6799926757812, initial SL 874.12, TP 875.23, 875.79, 876.35. Decision candle OHLC 875.02001953125, 875.3250122070312, 874.5999755859375, 874.6799926757812.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

## GS trade-3411--1

Step: Sweep → CHoCH/displacement → first zone retest → virtual entry.

Evidence: Market us, timeframe 5m; sweep 2026-10-21T17:55:00.000Z at 906.3200073242188 (swing high); setup known 2026-10-21T18:10:00.000Z; decision known 2026-10-21T18:20:00.000Z; entry 905.2449951171875, initial SL 905.91, TP 904.58, 903.92, 903.25. Decision candle OHLC 904.52001953125, 905.2449951171875, 904.4199829101562, 905.2449951171875.

Verification: Evidence chronology, sweep OHLC, zone overlap, risk direction, target ordering and prefix replay passed.

Verdict: CANDLE_CHECKS_PASS; full Pine parity and executable fill unverified. No TP/SL ordering ambiguity observed in this trade.

