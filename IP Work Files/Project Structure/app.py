################### FLASK APP ####################

# Importing Libraries
import os
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template
from config import username, password


# Creating Engine and Connecting to PostgreSQL DB
engine = create_engine(
    f"postgres://{username}:{password}@localhost:5432/spotifyDB")

Base = automap_base()
Base.prepare(engine, reflect=True)
session = Session(engine)
songsDB = Base.classes.songs

app = Flask(__name__)

# Route to Index.html
@app.route("/")
def homepage():
    return render_template("index.html")


# Route for BarChart - "Top Songs Released by Artist"
@app.route("/songs_released/<Artist>")
def songs_released(Artist):
    session = Session(engine)
    results1 = session.query(songsDB.Year, songsDB.Song, songsDB.Artist).filter(
        songsDB.Artist == Artist).all()
    session.close()

    songs_by_year = []
    for Year, Song, Artist in results1:
        artist_data_dict = {}
        artist_data_dict["Year"] = Year
        artist_data_dict["Song"] = Song
        artist_data_dict["Artist"] = Artist

        songs_by_year.append(artist_data_dict)

    response = jsonify(songs_by_year)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return(response)


# Route for data by decades
@app.route("/by_decades/<Decade>")
def by_decades(Decade):
    session = Session(engine)
    results2 = session.query(songsDB.Decade, songsDB.Year, songsDB.Song, songsDB.Artist, songsDB.Valence, songsDB.Acousticness, songsDB.Danceability, songsDB.Energy,
                             songsDB.Explicit, songsDB.Liveness, songsDB.Loudness, songsDB.Popularity, songsDB.Speechiness, songsDB.Tempo).filter(songsDB.Decade == Decade).all()
    session.close()

    songs_by_decade = []
    for Decade, Year, Song, Artist, Valence, Acousticness, Danceability, Energy, Explicit, Liveness, Loudness, Popularity, Speechiness, Tempo in results2:
        decade_data_dict = {}
        decade_data_dict["Decade"] = Decade
        decade_data_dict["Year"] = Year
        decade_data_dict["Song"] = Song
        decade_data_dict["Artist"] = Artist
        decade_data_dict["Valence"] = Valence
        decade_data_dict["Acousticness"] = Acousticness
        decade_data_dict["Danceability"] = Danceability
        decade_data_dict["Energy"] = Energy
        decade_data_dict["Explicit"] = Explicit
        decade_data_dict["Liveness"] = Liveness
        decade_data_dict["Loudness"] = Loudness
        decade_data_dict["Popularity"] = Popularity
        decade_data_dict["Speechiness"] = Speechiness
        decade_data_dict["Tempo"] = Tempo

        songs_by_decade.append(decade_data_dict)

    response = jsonify(songs_by_decade)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return(response)


#Route for data by individual Artist
@app.route("/by_artist_song/<Artist>/<Song>")
def by_artist_song(Artist, Song):
    session = Session(engine)

    results3 = session.query(songsDB.Decade, songsDB.Year, songsDB.Song, songsDB.Artist, songsDB.Valence, songsDB.Acousticness, songsDB.Danceability, songsDB.Energy,
                             songsDB.Explicit, songsDB.Liveness, songsDB.Loudness, songsDB.Popularity, songsDB.Speechiness, songsDB.Tempo).filter(songsDB.Artist == Artist).filter(songsDB.Song == Song).all()
    session.close()

    songs_by_artist = []
    for Decade, Year, Song, Artist, Valence, Acousticness, Danceability, Energy, Explicit, Liveness, Loudness, Popularity, Speechiness, Tempo in results3:
        songs_data_dict = {}
        songs_data_dict["Decade"] = Decade
        songs_data_dict["Year"] = Year
        songs_data_dict["Song"] = Song
        songs_data_dict["Artist"] = Artist
        songs_data_dict["Valence"] = Valence
        songs_data_dict["Acousticness"] = Acousticness
        songs_data_dict["Danceability"] = Danceability
        songs_data_dict["Energy"] = Energy
        songs_data_dict["Explicit"] = Explicit
        songs_data_dict["Liveness"] = Liveness
        songs_data_dict["Loudness"] = Loudness
        songs_data_dict["Popularity"] = Popularity
        songs_data_dict["Speechiness"] = Speechiness
        songs_data_dict["Tempo"] = Tempo

        songs_by_artist.append(songs_data_dict)

    response = jsonify(songs_by_artist)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return(response)


#Route for Top-5 Artists by Decade
@app.route("/top5artist")
def top5artist(Artist, Decade):
    session = Session(engine)

    results4 = session.query(songsDB.Decade, songsDB.Artist).all()
    session.close()

    artist_by_decade = []
    for Decade, Artist in results4:
        top5artist_dict = {}
        top5artist_dict["Decade"] = Decade
        top5artist_dict["Artist"] = Artist

        artist_by_decade.append(top5artist_dict)

    response = jsonify(artist_by_decade)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return(response)

if __name__ == '__main__':
app.run(debug=True, port=5000)