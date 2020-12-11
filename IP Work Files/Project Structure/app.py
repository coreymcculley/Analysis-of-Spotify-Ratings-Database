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