from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/search/<q>")
def search(q: str):
    return f"Voce pesquisou por: {q}"

