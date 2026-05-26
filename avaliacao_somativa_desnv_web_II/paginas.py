# -*- coding: utf-8 -*-
"""
Título: Resolução de Exercícios WEB - Templates
Descrição: Blueprint para gerenciar a renderização de interfaces HTML.
Data: 28/04/2026
"""
__autor__ = "Haroldo Faria"
__email__ = "haroldo.faria@aluno.cps.sp.gov.br"
__turma__ = "DSM - 2º Semestre / Noturno"
__version__ = "1.0.0"

from flask import Blueprint, render_template

paginas = Blueprint('paginas', __name__)

@paginas.route('/')
def index():
    # O professor exigiu que os templates fiquem na subpasta 'paginas'
    return render_template('paginas/layout.html')
