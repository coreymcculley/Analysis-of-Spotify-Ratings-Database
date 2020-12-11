# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from flask_sqlalchemy import SQLAlchemy
import psycopg2
import pandas as pd
from config import username, password

# df = pd.read_csv("clean_data_all.csv")
# song_df = df.groupby("Decade")

db_conn = psycopg2.connect(
    f'host=localhost, port=5432, dbname=spotify_db, user=postgres, password=postgress')

db_cursor = db_conn.cursor()

f_contents = open('data/clean_data_all.csv', 'r')
db_cursor.copy_from(f_contents, "songs", columns=('Decade', 'Year', 'Artist', 'Song', 'Genre', 'Duration', 'ArtistSong', 'Valence', 'Acousticness',
                                                  'Danceability', 'Energy', 'Explicit', 'Instrumentalness', 'Key', 'Liveness', 'Loudness', 'Mode', 'Popularity', 'Speechiness', 'Tempo', 'ID'), sep=",")

# # Flask Setup
# app = Flask(__name__)

# # Database Setup
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SQLALCHEMY_DATABASE_URI'] = f'postgres://{username}:{password}@localhost:5432/spotify_db'
# app.debug = True
# db = SQLAlchemy(app)


# class songs(db.mode):
#     __tablename__ = songs
#     Decade = dbColumn(db.Integer)
#     Year = dbColumn(db.Integer)
#     Artist = (db.String)
#     Song = (db.String)
#     Genre = (db.String)
#     Duration = dbColumn(db.Integer)
#     ArtistSong = (db.String)
#     Valence = (db.Float)
#     Acousticness = (db.Float)
#     Danceability = (db.Float)
#     Energy = (db.Float)
#     Explicit = dbColumn(db.Integer)
#     Instrumentalness = (db.Float)
#     Key = dbColumn(db.Integer)
#     Liveness = (db.Float)
#     Loudness = (db.Float)
#     Mode = dbColumn(db.Integer)
#     Popularity = dbColumn(db.Integer)
#     Speechiness = (db.Float)
#     Tempo = (db.Float)
#     ID = (db.String, primary_key=True)

#     def __repr__(self):
#         return '<Songs %r>' % (self.name)

#     def setup():
#         db.create_all()


# engine = create_engine(
#     f'postgresql+psycopg2://{username}:{password}@localhost:5432/spotify_db')
# connection = engine.connect()

# song_df.to_sql(name='songs', con=engine, if_exists='append', index=False)

# def __init__(self, Decade, Year, Artist, Song, Genre, Duration, ArtistSong, Valence, Acousticness, Danceability, Energy, Explicit, Instrumentalness, Key, Liveness, Loudness, Mode, Popularity, Speechiness, Tempo, ID):
#     self.Decade = Decade
#     self.Year = Year
#     self.

if __name__ == "__main__":
    app.run(debug=True)
