import sys
sys.path.insert(0,r'C:\Users\saite\Desktop\ICT_Automation\realtime_execution')
from mss_reversal_data import connect
with connect() as c:
 c.set_session(readonly=True)
 with c.cursor() as q:
  for table in ('historical_candles_5m','candles_5m'):
   q.execute(f"SELECT market,base_symbol,count(*) FROM {table} WHERE candle_ts >= '2026-09-24' GROUP BY market,base_symbol HAVING count(*)>500 ORDER BY market,base_symbol")
   print(table,q.fetchall())
