from flask import Flask
from flask import render_template
from flask import send_file
app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('newindex.html')

@app.route('/data')
def serve_data():
    return send_file("df_all_data_w_decades.csv", mimetype = "text/csv")


    