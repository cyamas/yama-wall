import sqlite3

connection = sqlite3.connect('yama.db')

with open('schema.sql') as f:
    connection.executescript(f.read())

connection.close()


