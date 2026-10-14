from flask import Flask, render_template, jsonify
import sqlite3

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

@app.route('/api/citas')
def api_citas():
    conn = sqlite3.connect('taller.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM citas")
    rows = cursor.fetchall()
    conn.close()
    
    citas_list = [dict(row) for row in rows]
    return jsonify(citas_list)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
