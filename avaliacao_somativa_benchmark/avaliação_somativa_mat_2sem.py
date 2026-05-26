import time
import platform
import sqlite3
from typing import Callable, List, Tuple, Any

def fibonacci_loop(n: int) -> int:
    """Calcula Fibonacci iterativamente.
    Complexidade: O(n) tempo | O(1) espaço.
    """
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

def fibonacci_recursao(n: int) -> int:
    """Calcula Fibonacci recursivamente.
    Complexidade: O(2^n) tempo | O(n) espaço (call stack).
    """
    if n <= 1: return n
    return fibonacci_recursao(n - 1) + fibonacci_recursao(n - 2)

def fatorial_loop(n: int) -> int:
    """Calcula o Fatorial iterativamente."""
    resultado = 1
    for i in range(2, n + 1):
        resultado *= i
    return resultado

def fatorial_recursao(n: int) -> int:
    """Calcula o Fatorial recursivamente."""
    if n <= 1: return 1
    return n * fatorial_recursao(n - 1)

def somatoria_loop(n: int) -> int:
    """Soma de 1 até N usando loop."""
    soma = 0
    for i in range(1, n + 1):
        soma += i
    return soma

def somatoria_recursao(n: int) -> int:
    """Soma de 1 até N recursivamente."""
    if n <= 0: return 0
    return n + somatoria_recursao(n - 1)

def preparar_banco_dados() -> sqlite3.Connection:
    """Cria banco em memória e popula com 1000 registros."""
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    # Tabela simples de 2 campos
    cursor.execute('CREATE TABLE dados (id INTEGER PRIMARY KEY, valor TEXT)')
    registros = [(i, f'Processo Ambiental ID-{i}') for i in range(1, 1001)]
    cursor.executemany('INSERT INTO dados (id, valor) VALUES (?, ?)', registros)
    conn.commit()
    return conn

def consulta_sql(conn: sqlite3.Connection) -> List[Tuple[int, str]]:
    """Consulta aproximadamente 1000 registros."""
    cursor = conn.cursor()
    cursor.execute('SELECT id, valor FROM dados')
    return cursor.fetchall()

def executar_benchmark(nome: str, func: Callable, args: tuple, execucoes: int = 100) -> None:
    """Testa a função e calcula a média de tempo."""
    tempos = []
    # Teste unitário/Validação rápida na primeira iteração
    _ = func(*args) 
    
    for _ in range(execucoes):
        inicio = time.perf_counter()
        func(*args)
        fim = time.perf_counter()
        tempos.append(fim - inicio)
    
    media = sum(tempos) / execucoes
    print(f"[{nome.ljust(25)}] Execuções: {execucoes} | Média de Tempo: {media:.8f} segundos")

def main():
    print("="*60)
    print("RELATÓRIO DE BENCHMARK - GREEN SOFTWARE ENGINEERING")
    print("="*60)
    print(f"SO: {platform.system()} {platform.release()} ({platform.machine()})")
    print(f"Processador: {platform.processor()}")
    print(f"Linguagem: Python {platform.python_version()}")
    print("="*60)

    # Variáveis de controle
    N_MATEMATICA = 20 # Mantido em 20 para evitar estouro da pilha na recursão (RecursionError)
    EXECUCOES_PADRAO = 100
    EXECUCOES_PESADAS = 10 # Reduzido para Fibonacci recursivo devido ao custo O(2^n)

    print(f"--> Testando algoritmos matemáticos com N = {N_MATEMATICA}\n")
    
    executar_benchmark("Fibonacci (Loop)", fibonacci_loop, (N_MATEMATICA,), EXECUCOES_PADRAO)
    executar_benchmark("Fibonacci (Recursão)", fibonacci_recursao, (N_MATEMATICA,), EXECUCOES_PESADAS)
    
    executar_benchmark("Fatorial (Loop)", fatorial_loop, (N_MATEMATICA,), EXECUCOES_PADRAO)
    executar_benchmark("Fatorial (Recursão)", fatorial_recursao, (N_MATEMATICA,), EXECUCOES_PADRAO)
    
    executar_benchmark("Somatória (Loop)", somatoria_loop, (N_MATEMATICA,), EXECUCOES_PADRAO)
    executar_benchmark("Somatória (Recursão)", somatoria_recursao, (N_MATEMATICA,), EXECUCOES_PADRAO)
    
    print("\n--> Testando carga de Banco de Dados (1000 registros)")
    conn = preparar_banco_dados()
    executar_benchmark("Consulta SQL (SELECT)", consulta_sql, (conn,), EXECUCOES_PADRAO)
    conn.close()
    print("="*60)

if __name__ == "__main__":
    main()