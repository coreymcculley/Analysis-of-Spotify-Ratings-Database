from flask import Flask, render_template, jsonify
import pandas as pd

df = pd.read_csv("nba_stats.csv")
group_df = df.groupby("Tm")
pts_df = group_df['PTS'].mean().reset_index()

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/data")
def data():
    nba_dicts = pts_df.to_dict(orient="records")
    return jsonify(nba_dicts)


if __name__ == "__main__":
    app.run(debug=True)