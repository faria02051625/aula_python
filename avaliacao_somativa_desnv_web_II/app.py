# -*- coding: utf-8 -*-
"""
Título: Main APP
Descrição: Arquivo principal de orquestração e registro de Blueprints do Flask.
Data: 28/04/2026
"""
__autor__ = "Haroldo Faria"
__email__ = "haroldo.faria@aluno.cps.sp.gov.br"
__turma__ = "DSM - 2º Semestre / Noturno"
__version__ = "1.0.0"

from flask import Flask
from rotas import rotas
from paginas import paginas

app = Flask(__name__)

# Registro das regras de negócio
app.register_blueprint(rotas)
app.register_blueprint(paginas)

if __name__ == '__main__':
    app.run(debug=True)
