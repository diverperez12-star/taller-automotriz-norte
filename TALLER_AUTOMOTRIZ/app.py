from flask import Flask, render_template, jsonify, request
import sqlite3
from datetime import datetime

app = Flask(__name__, template_folder='TEMPLATES', static_folder='static')

def init_db():
    conn = sqlite3.connect('taller.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS citas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            folio TEXT,
            cliente TEXT,
            nombre TEXT,
            telefono TEXT,
            vehiculo TEXT,
            vin TEXT,
            servicio TEXT,
            fecha TEXT,
            hora TEXT,
            costo TEXT,
            estatus TEXT DEFAULT 'En espera'
        )
    ''')
    
    columnas_necesarias = [
        ('cliente', 'TEXT'),
        ('nombre', 'TEXT'),
        ('telefono', 'TEXT'),
        ('vehiculo', 'TEXT'),
        ('vin', 'TEXT'),
        ('servicio', 'TEXT'),
        ('fecha', 'TEXT'),
        ('hora', 'TEXT'),
        ('costo', 'TEXT'),
        ('estatus', 'TEXT')
    ]
    
    for col, col_type in columnas_necesarias:
        try:
            cursor.execute(f"ALTER TABLE citas ADD COLUMN {col} {col_type}")
        except sqlite3.OperationalError:
            pass

    conn.commit()
    conn.close()

# MANDAR A LLAMAR LA INICIALIZACIÓN DE LA BASE DE DATOS
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

@app.route('/api/citas', methods=['GET'])
def api_citas():
    conn = sqlite3.connect('taller.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM citas")
    rows = cursor.fetchall()
    conn.close()
    
    citas_list = []
    for row in rows:
        d = dict(row)
        # Mapeo exacto para que Power BI reconozca las columnas sin arrojar null
        cliente_val = d.get('cliente') or d.get('nombre') or 'Sin nombre'
        
        d['cliente'] = cliente_val
        d['nombre'] = cliente_val
        d['folio'] = d.get('folio') or ''
        d['telefono'] = d.get('telefono') or ''
        d['vehiculo'] = d.get('vehiculo') or ''
        d['vin'] = d.get('vin') or ''
        
        # Mapeos especiales para Power Query
        d['costo_estimado'] = d.get('costo') or '$0 MXN'
        d['estado'] = d.get('estatus') or 'En espera'
        d['fecha_cita'] = d.get('fecha') or ''
        d['hora_cita'] = d.get('hora') or ''
        d['fecha_registro'] = d.get('fecha') or '' # Valor por defecto si no existe
        d['marca'] = '' # Rellenar si tu tabla separa marcas
        d['modelo'] = ''
        d['anio'] = 2026
        d['tipo_servicio'] = d.get('servicio') or ''
        d['modalidad_reporte'] = ''
        d['tipo_uso'] = ''
        
        citas_list.append(d)
        
    return jsonify(citas_list)

@app.route('/api/guardar-cita', methods=['POST'])
def guardar_cita():
    try:
        datos = request.get_json(force=True)
        if not datos:
            return jsonify({"success": False, "error": "No se recibieron datos JSON"}), 400

        # Validación estricta en backend: El taller no labora los domingos (weekday 6)
        fecha_str = datos.get('fecha')
        if fecha_str:
            fecha_obj = datetime.strptime(fecha_str, '%Y-%m-%d')
            if fecha_obj.weekday() == 6:
                return jsonify({"success": False, "error": "El taller no labora los domingos. Selecciona otro día."}), 400

        nombre_val = datos.get('nombre') or datos.get('cliente') or 'Sin nombre'
        
        conn = sqlite3.connect('taller.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO citas (folio, cliente, nombre, telefono, vehiculo, vin, servicio, fecha, hora, costo, estatus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            datos.get('folio'),
            nombre_val,
            nombre_val,
            datos.get('telefono'),
            datos.get('vehiculo'),
            datos.get('vin'),
            datos.get('servicio'),
            datos.get('fecha'),
            datos.get('hora'),
            datos.get('costo'),
            datos.get('estatus', 'En espera')
        ))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        print("Error al guardar cita:", str(e))
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
