# -*- coding: utf-8 -*-
"""
Título: Resolução de Exercícios WEB - Rotas e APIs
Descrição: Blueprint contendo os desafios de rotas simples, POST, conversões e headers.
Data: 28/05/2026
"""
__autor__ = "Haroldo Faria"
__email__ = "haroldo.faria@aluno.cps.sp.gov.br"
__turma__ = "DSM - 2º Semestre / Noturno"
__version__ = "1.0.0"

from flask import Blueprint, request, jsonify

rotas = Blueprint('rotas', __name__)

# Desafio 1: Mensagem simples
@rotas.route('/message', methods=['GET'])
def message():
    return "Cadastro Salvo com sucesso", 200

# Desafio 2: Mensagem por status dinâmico
@rotas.route('/message/<int:status>', methods=['GET'])
def message_status(status):
    mensagens = {
        200: "Sucesso geral.",
        201: "Sucesso na criação.",
        400: "Erro do cliente (sintaxe).",
        401: "Falta autenticação.",
        404: "Recurso não encontrado.",
        500: "Erro no servidor."
    }
    # Otimização: busca no dicionário para evitar múltiplos "if/else"
    return mensagens.get(status, "Status desconhecido"), status

# Desafio 3: POST de Autenticação genivaldo/jerusa
@rotas.route('/auth/login', methods=['POST'])
def login():
    usuario = request.form.get('usuario')
    senha = request.form.get('senha')
    
    if usuario == "genivaldo" and senha == "jerusa":
        return "Sucesso geral.", 200
    return "Falta autenticação.", 401

# Desafio 4: POST para validação de CPF
@rotas.route('/cliente/validar', methods=['POST'])
def validar_cpf():
    nome = request.form.get('nome')
    cpf = request.form.get('cpf')
    
    # Metodologia de validação simplificada (tamanho do CPF) para fins acadêmicos
    if cpf and len(cpf.replace(".", "").replace("-", "")) == 11:
        return jsonify({'status': 200, 'mensagem': "Sucesso geral."}), 200
    else:
        return jsonify({'status': 400, 'mensagem': "Erro do cliente (sintaxe)."}), 400

# Desafio 5: Conversão com Parâmetro Dinâmico
@rotas.route('/convert/celsius/<float:temp>', methods=['GET'])
def convert(temp):
    # Fórmula aplicada de forma eficiente
    fahrenheit = temp * 1.8 + 32
    return jsonify({"original_celsius": temp, "fahrenheit": fahrenheit}), 200

# Desafio 6: Filtro via Querystring
@rotas.route('/search', methods=['GET'])
def search():
    q = request.args.get('q')
    if q:
        return f"Você pesquisou por: {q}", 200
    return "Parâmetro de busca obrigatório", 400

# Desafio 7: Validação de Maioridade (Apenas POST)
@rotas.route('/api/register', methods=['POST'])
def register():
    nome = request.form.get('nome')
    idade = request.form.get('idade')
    
    if not idade or int(idade) < 18:
        return jsonify({"erro": "Cadastro permitido apenas para maiores de idade"}), 403
    return f"Usuário {nome} cadastrado", 201

# Desafio 8: Simulador de Estoque (JSON List)
@rotas.route('/products', methods=['GET'])
def products():
    lista_produtos = [
        {"id": 1, "nome": "Válvula Reguladora", "preco": 150.00},
        {"id": 2, "nome": "Sensor de Ph", "preco": 420.50},
        {"id": 3, "nome": "Medidor de Vazão", "preco": 890.00}
    ]
    # Simulação da regra de negócio: se lista vazia, 204
    if not lista_produtos:
        return '', 204
    return jsonify(lista_produtos), 200

# Desafio 9: Header de Segurança
@rotas.route('/admin/dashboard', methods=['GET', 'POST'])
def admin_dashboard():
    api_key = request.headers.get('X-Api-Key')
    if api_key == 'secret123':
        return "Acesso ao painel administrativo liberado", 200
    return "Unauthorized", 401
