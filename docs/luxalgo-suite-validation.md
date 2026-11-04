# LuxAlgo six-indicator validation

Database candles are the source of truth. Full TradingView parity: **UNVERIFIED**.

{
  "status": "IMPLEMENTED_CHECKS_PASS",
  "feedComparison": {
    "tradingViewBars": 301,
    "overlap": 300,
    "ohlcMatch": 261,
    "volumeMatch": 49,
    "ohlcMismatch": 39,
    "volumeMismatch": 251,
    "examples": [
      {
        "time": 1792727100,
        "database": {
          "time": 1792727100,
          "open": 1183,
          "high": 1194.300048828125,
          "low": 1183,
          "close": 1194.199951171875,
          "volume": 306530,
          "source": "yfinance"
        },
        "tradingview": {
          "time": 1792727100,
          "open": 1183,
          "high": 1194.5,
          "low": 1180.5,
          "close": 1194.2,
          "volume": 505314,
          "up": 1180.5,
          "down": null
        }
      },
      {
        "time": 1792727700,
        "database": {
          "time": 1792727700,
          "open": 1196.5999755859375,
          "high": 1201.5999755859375,
          "low": 1196.199951171875,
          "close": 1198.699951171875,
          "volume": 343165,
          "source": "yfinance"
        },
        "tradingview": {
          "time": 1792727700,
          "open": 1196.6,
          "high": 1201.9,
          "low": 1196.2,
          "close": 1198.7,
          "volume": 343050,
          "up": null,
          "down": null
        }
      },
      {
        "time": 1792730400,
        "database": {
          "time": 1792730400,
          "open": 1184.5999755859375,
          "high": 1184.699951171875,
          "low": 1177.699951171875,
          "close": 1178.300048828125,
          "volume": 216644,
          "source": "yfinance"
        },
        "tradingview": {
          "time": 1792730400,
          "open": 1184.6,
          "high": 1184.7,
          "low": 1177.1,
          "close": 1178.3,
          "volume": 216464,
          "up": null,
          "down": 1184.7
        }
      },
      {
        "time": 1792731000,
        "database": {
          "time": 1792731000,
          "open": 1174.0999755859375,
          "high": 1177.4000244140625,
          "low": 1172.5999755859375,
          "close": 1175.5,
          "volume": 269116,
          "source": "yfinance"
        },
        "tradingview": {
          "time": 1792731000,
          "open": 1174.1,
          "high": 1177.4,
          "low": 1172.1,
          "close": 1175.5,
          "volume": 269595,
          "up": null,
          "down": null
        }
      },
      {
        "time": 1792731900,
        "database": {
          "time": 1792731900,
          "open": 1173.4000244140625,
          "high": 1175.199951171875,
          "low": 1171.5999755859375,
          "close": 1171.5999755859375,
          "volume": 132468,
          "source": "yfinance"
        },
        "tradingview": {
          "time": 1792731900,
          "open": 1173.4,
          "high": 1175.2,
          "low": 1171.5,
          "close": 1171.6,
          "volume": 132409,
          "up": null,
          "down": null
        }
      }
    ]
  },
  "tradingViewNumericComparison": {
    "indicator": "ICT Concepts displacement UP/DN",
    "sameInputTradingViewExport": true,
    "warmupExcluded": 20,
    "tested": 560,
    "matches": 560,
    "mismatches": 0,
    "examples": []
  },
  "databaseVsTradingViewDisplacement": {
    "tested": 600,
    "matches": 594,
    "mismatches": 6
  }
}

## Local checks

- PASS: liquidity-swings ordered OHLC/events
- PASS: liquidity-swings history-prefix causality
- PASS: buyside-sellside ordered OHLC/events
- PASS: buyside-sellside history-prefix causality
- PASS: liquidity-sweeps ordered OHLC/events
- PASS: liquidity-sweeps history-prefix causality
- PASS: liquidity-pools ordered OHLC/events
- PASS: liquidity-pools history-prefix causality
- PASS: smc ordered OHLC/events
- PASS: smc history-prefix causality
- PASS: ict-concepts ordered OHLC/events
- PASS: ict-concepts history-prefix causality
- PASS: TradingView displacement plots on identical TV candles

## Limits

- Full drawing-by-drawing TradingView parity is not certified.
- The six adapters implement the supplied photo preset; modules disabled in the photos are not implemented or enabled.
- Present mode intentionally limits historical display to 500 bars; pivot drawings are retrospective, as in the originals.
- The database OHLC is retained even where the TradingView feed differs.
