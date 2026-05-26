import time
import sqlite3
import platform
import os
from statistics import mean

# ==========================================================
# CONFIGURAÇÕES
# ==========================================================

EXECUCOES = 10

# ==========================================================
# INFORMAÇÕES DO SISTEMA
# ==========================================================

print("=" * 60)
print("BENCHMARK EM PYTHON")
print("=" * 60)

print("\nCONFIGURAÇÃO DO COMPUTADOR")
print("-" * 60)

print(f"Sistema Operacional : {platform.system()} {platform.release()}")
print(f"Arquitetura         : {platform.machine()}")
print(f"Processador         : {platform.processor()}")
print(f"Família             : {os.name}")
print(f"Linguagem           : Python")
print(f"Execuções           : {EXECUCOES}x")

# ==========================================================
# FIBONACCI
# ==========================================================

def fibonacci_loop(n):
    a, b = 0, 1

    for _ in range(n):
        a, b = b, a + b

    return a


def fibonacci_recursivo(n):

    if n <= 1:
        return n

    return fibonacci_recursivo(n - 1) + fibonacci_recursivo(n - 2)

# ==========================================================
# FATORIAL
# ==========================================================

def fatorial_loop(n):

    resultado = 1

    for i in range(1, n + 1):
        resultado *= i

    return resultado


def fatorial_recursivo(n):

    if n == 0 or n == 1:
        return 1

    return n * fatorial_recursivo(n - 1)

# ==========================================================
# SOMATÓRIA
# ==========================================================

def somatoria_loop(n):

    soma = 0

    for i in range(1, n + 1):
        soma += i

    return soma


def somatoria_recursiva(n):

    if n == 0:
        return 0

    return n + somatoria_recursiva(n - 1)

# ==========================================================
# BANCO DE DADOS SQLITE
# ==========================================================

def criar_banco():

    conexao = sqlite3.connect("benchmark.db")
    cursor = conexao.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pessoas (
            id INTEGER PRIMARY KEY,
            nome TEXT
        )
    """)

    cursor.execute("DELETE FROM pessoas")

    for i in range(1000):

        cursor.execute(
            "INSERT INTO pessoas (nome) VALUES (?)",
            (f"Pessoa {i}",)
        )

    conexao.commit()
    conexao.close()


def consulta_sql():

    conexao = sqlite3.connect("benchmark.db")
    cursor = conexao.cursor()

    cursor.execute("SELECT * FROM pessoas")

    dados = cursor.fetchall()

    conexao.close()

    return dados

# ==========================================================
# BENCHMARK
# ==========================================================

def benchmark(funcao, *args):

    tempos = []

    for _ in range(EXECUCOES):

        inicio = time.perf_counter()

        funcao(*args)

        fim = time.perf_counter()

        tempos.append(fim - inicio)

    return mean(tempos)

# ==========================================================
# EXECUÇÃO DOS TESTES
# ==========================================================

print("\nEXECUTANDO TESTES...")
print("-" * 60)

# Fibonacci
tempo_fib_loop = benchmark(fibonacci_loop, 30)
tempo_fib_rec = benchmark(fibonacci_recursivo, 30)

# Fatorial
tempo_fat_loop = benchmark(fatorial_loop, 20)
tempo_fat_rec = benchmark(fatorial_recursivo, 20)

# Somatória
tempo_som_loop = benchmark(somatoria_loop, 1000)
tempo_som_rec = benchmark(somatoria_recursiva, 1000)

# Banco de dados
criar_banco()
tempo_sql = benchmark(consulta_sql)

# ==========================================================
# RESULTADOS
# ==========================================================

print("\nRESULTADOS MÉDIOS")
print("-" * 60)

print(f"Fibonacci Loop       : {tempo_fib_loop:.10f} segundos")
print(f"Fibonacci Recursivo  : {tempo_fib_rec:.10f} segundos")

print()

print(f"Fatorial Loop        : {tempo_fat_loop:.10f} segundos")
print(f"Fatorial Recursivo   : {tempo_fat_rec:.10f} segundos")

print()

print(f"Somatória Loop       : {tempo_som_loop:.10f} segundos")
print(f"Somatória Recursiva  : {tempo_som_rec:.10f} segundos")

print()

print(f"Consulta SQL         : {tempo_sql:.10f} segundos")

print("\nBenchmark concluído com sucesso!")
print("=" * 60)