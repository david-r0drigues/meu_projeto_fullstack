# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash
import os # Para variáveis de ambiente (melhor prática)

app = Flask(__name__)
CORS(app) # Habilita o CORS para todas as rotas

# Configuração da conexão com o banco de dados
# (Idealmente, usar variáveis de ambiente)
DB_NAME = "gerenciador_usuarios"
DB_USER = "meu_usuario"
DB_PASS = "sua_senha_segura"
DB_HOST = "localhost"
DB_PORT = "5432"

def get_db_connection():
    conn = psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT
    )
    return conn

# ROTA: Cadastrar um novo usuário (Create)
@app.route('/usuarios', methods=['POST'])
def add_user():
    data = request.get_json()
    nome_completo = data['nome_completo']
    email = data['email']
    senha = data['senha']
    telefone = data.get('telefone') # .get() para campos opcionais

    # Criptografa a senha antes de salvar
    senha_hash = generate_password_hash(senha)

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO usuarios (nome_completo, email, senha, telefone) VALUES (%s, %s, %s, %s)",
        (nome_completo, email, senha_hash, telefone)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Usuário criado com sucesso!'}), 201

# ROTA: Listar todos os usuários (Read)
@app.route('/usuarios', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nome_completo, email, telefone, data_cadastro FROM usuarios ORDER BY id ASC")
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
            'data_cadastro': user[4]
        })
    return jsonify(user_list)

# ROTA: Excluir um usuário (Delete)
@app.route('/usuarios/<int:id>', methods=['DELETE'])
def delete_user(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM usuarios WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Usuário deletado com sucesso!'})

# ROTA EXTRA: Atualizar um usuário (Update) - Simplificado
@app.route('/usuarios/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    nome_completo = data['nome_completo']
    email = data['email']
    telefone = data.get('telefone')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE usuarios SET nome_completo = %s, email = %s, telefone = %s WHERE id = %s",
        (nome_completo, email, telefone, id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Usuário atualizado com sucesso!'})


if __name__ == '__main__':
    app.run(debug=True)