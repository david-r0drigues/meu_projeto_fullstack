# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from werkzeug.security import generate_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

DB_NAME = "gerenciador_usuarios"
DB_USER = "meu_usuario"
DB_PASS = os.getenv("DB_PASSWORD") or "david"
DB_HOST = "localhost"
DB_PORT = "5432"

def get_db_connection():
    conn = psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT
    )
    return conn

@app.route('/usuarios', methods=['POST'])
def add_user():
    data = request.get_json()
    nome_completo = data['nome_completo']
    email = data['email']
    senha = data['senha']
    telefone = data.get('telefone')
    data_nascimento = data.get('data_nascimento')
    endereco = data.get('endereco')

    senha_hash = generate_password_hash(senha)

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO usuarios (nome_completo, email, senha, telefone, data_nascimento, endereco) VALUES (%s, %s, %s, %s, %s, %s)",
        (nome_completo, email, senha_hash, telefone, data_nascimento, endereco)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Usuário criado com sucesso!'}), 201

@app.route('/usuarios', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nome_completo, email, telefone, data_nascimento, endereco, data_cadastro FROM usuarios ORDER BY id ASC")
    users = cur.fetchall()
    cur.close()
    conn.close()

    user_list = []
    for user in users:
        user_list.append({
            'id': user[0],
            'nome_completo': user[1],
            'email': user[2],
            'telefone': user[3],
            'data_nascimento': user[4],
            'endereco': user[5],
            'data_cadastro': user[6]
        })
    return jsonify(user_list)

@app.route('/usuarios/<int:id>', methods=['GET'])
def get_user_by_id(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nome_completo, email, telefone, data_nascimento, endereco FROM usuarios WHERE id = %s", (id,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user is None:
        return jsonify({'message': 'Usuário não encontrado'}), 404

    return jsonify({
        'id': user[0],
        'nome_completo': user[1],
        'email': user[2],
        'telefone': user[3],
        'data_nascimento': user[4],
        'endereco': user[5]
    })

@app.route('/usuarios/<int:id>', methods=['DELETE'])
def delete_user(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM usuarios WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Usuário deletado com sucesso!'})

@app.route('/usuarios/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    nome_completo = data['nome_completo']
    email = data['email']
    telefone = data.get('telefone')
    data_nascimento = data.get('data_nascimento')
    endereco = data.get('endereco')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE usuarios SET nome_completo = %s, email = %s, telefone = %s, data_nascimento = %s, endereco = %s WHERE id = %s",
        (nome_completo, email, telefone, data_nascimento, endereco, id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Usuário atualizado com sucesso!'})


if __name__ == '__main__':
    app.run(debug=True)