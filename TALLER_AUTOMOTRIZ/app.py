from flask import Flask, render_template

app = Flask(__name__, template_folder='TEMPLATES', static_folder='static')

@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/seguimiento')
@app.route('/seguimiento.html')
def seguimiento():
    return render_template('seguimiento.html')

@app.route('/admin')
@app.route('/admin.html')
def admin():
    return render_template('admin.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)