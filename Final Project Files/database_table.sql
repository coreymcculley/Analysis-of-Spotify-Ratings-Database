-- DROP TABLE IF EXISTS spotify_songs;

CREATE TABLE spotify_songs
(
    -- 	Columns created for cleaned database
    Decade INT,
    Year INT,
    Artist VARCHAR(500),
    Song VARCHAR(500),
    Genre VARCHAR(1000),
    Duration_ms INT,
    ArtistSong VARCHAR(1000),
    Valence NUMERIC,
    Acousticness NUMERIC,
    Danceability NUMERIC,
    Energy NUMERIC,
    Explicit INT,
    Instrumentalness NUMERIC,
    Key INT,
	Liveness NUMERIC,
	Loudness NUMERIC,
	Mode INT,
	Popularity INT,
	Speechiness NUMERIC,
	Tempo NUMERIC,
	Song_ID VARCHAR
    (30) PRIMARY KEY
);

    select *
    from spotify_songs