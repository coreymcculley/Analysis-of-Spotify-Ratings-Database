-- DROP TABLE IF EXISTS spotify_songs;

CREATE TABLE songs
(
    -- 	Columns created for cleaned database
    Decade INT,
    Year INT,
    Artist VARCHAR(500),
    Song TEXT,
    Genre TEXT,
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
	IDs VARCHAR
    (30) PRIMARY KEY
);

    select *
    from spotify_songs