from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__, template_folder='TEMPLATES', static_folder='static')

def init_db():
    conn = sqlite3.connect('taller.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS citas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            folio TEXT,
            nombre TEXT,
            telefono TEXT,
            vehiculo TEXT,
            vin TEXT,
            servicio TEXT,
            fecha TEXT,
            costo TEXT,
            estatus TEXT DEFAULT 'En espera'
        )
    ''')
    conn.commit()
    conn.close()

# Inicializar la tabla al arrancar el servidor
init_db()

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

# Ruta para que Power BI y el Admin lean las citas
@app.route('/api/citas', methods=['GET'])
def api_citas():
    conn = sqlite3.connect('taller.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM citas")
    rows = cursor.fetchall()
    conn.close()
    citas_list = [dict(row) for row in rows]
    return jsonify(citas_list)

# Ruta NUEVA para recibir y guardar citas desde el formulario web
@app.route('/api/guardar-cita', methods=['POST'])
def guardar_cita():
    try:
        datos = request.json
        conn = sqlite3.connect('taller.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO citas (folio, nombre, telefono, vehiculo, vin, servicio, fecha, costo, estatus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            datos.get('folio'),
            datos.get('nombre'),
            datos.get('telefono'),
            datos.get('vehiculo'),
            datos.get('vin'),
            datos.get('servicio'),
            datos.get('fecha'),
            datos.get('costo'),
            'En espera'
        ))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Cita guardada correctamente"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
