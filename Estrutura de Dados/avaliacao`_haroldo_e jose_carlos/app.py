from lista_encadeada import Lista_encadeada
from pilha import Pilha
from fila import Fila

print("TESTES DA LISTA ENCADEADA")

lista1 = Lista_encadeada()

lista1.inserir_final(10)
lista1.inserir_final(5)
lista1.inserir_final(30)
lista1.inserir_final(20)

print("\nLista original:")
lista1.imprimir()

print("\nMenor elemento:", lista1.min())
print("Maior elemento:", lista1.max())
print("Soma dos elementos:", lista1.sum())
print("Média dos elementos:", lista1.avg())
print("Quantidade de elementos:", lista1.len())

lista2 = Lista_encadeada()
lista2.inserir_final(100)
lista2.inserir_final(200)

print("\nSegunda lista:")
lista2.imprimir()

lista1.append(lista2)

print("\nLista após append:")
lista1.imprimir()

lista1.reverse()

print("\nLista após reverse:")
lista1.imprimir()


print("TESTES DA PILHA")

pilha1 = Pilha()

pilha1.push(10)
pilha1.push(20)
pilha1.push(30)
pilha1.push(20)
pilha1.push(40)

print("\nPilha original:")
pilha1.imprimir()

print("\nBuscar elemento 30:")
if pilha1.buscar(30):
    print("Elemento encontrado")
else:
    print("Elemento não encontrado")

print("\nEditar elemento 30 para 300:")
pilha1.editar(30, 300)

print("\nPilha após editar:")
pilha1.imprimir()

print("\nRemover elemento 20:")
pilha1.remover(20)

print("\nPilha após remover:")
pilha1.imprimir()

print("\nRemover repetidos:")
pilha1.remover_repetidos()

print("\nPilha após remover repetidos:")
pilha1.imprimir()


print("TESTES DA FILA")

fila1 = Fila()

fila1.enfileirar(10)
fila1.enfileirar(20)
fila1.enfileirar(30)
fila1.enfileirar(20)
fila1.enfileirar(40)

print("\nFila original:")
fila1.imprimir_fila()

print("\nBuscar elemento 30:")
if fila1.buscar(30):
    print("Elemento encontrado")
else:
    print("Elemento não encontrado")

print("\nEditar elemento 30 para 300:")
fila1.editar(30, 300)

print("\nFila após editar:")
fila1.imprimir_fila()

print("\nRemover elemento 20:")
fila1.remover(20)

print("\nFila após remover:")
fila1.imprimir_fila()

print("\nRemover repetidos:")
fila1.remover_repetidos()

print("\nFila após remover repetidos:")
fila1.imprimir_fila()


print("TESTES FINALIZADOS COM SUCESSO")
