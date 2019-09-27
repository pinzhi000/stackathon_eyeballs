# !/usr/bin/python3
# Jupyter Notebook: http://localhost:8888/notebooks/jupyter_notebooks/blindness_detection_py3.ipynb

import psycopg2
import pandas as pd
from pandas import DataFrame

conn = psycopg2.connect("dbname=eyeballdbfinal user=postgres")
df = pd.read_sql_query("SELECT * FROM eyeballtables", conn)

imageUrl = df['imageUrl'].iat[-1]

conn.close()

print(2)
