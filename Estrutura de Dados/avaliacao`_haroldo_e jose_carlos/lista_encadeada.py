from nodo import Nodo


class Lista_encadeada:
    """
    Lista simplesmente encadeada.
    Implementa métodos de inserção, remoção, busca e os métodos exigidos na prova.
    """

    def __init__(self):
        self.cabeca = None

    def vazia(self):
        return self.cabeca is None

    def inserir_inicio(self, info):
        novo = Nodo(info)
        novo.prox = self.cabeca
        self.cabeca = novo

    def inserir_final(self, info):
        novo = Nodo(info)

        if self.vazia():
            self.cabeca = novo
        else:
            aux = self.cabeca

            while aux.prox:
                aux = aux.prox

            aux.prox = novo

    def imprimir(self):
        if self.vazia():
            print("Lista vazia")
            return

        aux = self.cabeca

        while aux:
            print(aux.info)
            aux = aux.prox

    def buscar(self, valor):
        aux = self.cabeca

        while aux:
            if aux.info == valor:
                return True

            aux = aux.prox

        return False

    def remover_inicio(self):
        if not self.vazia():
            aux = self.cabeca
            self.cabeca = self.cabeca.prox
            del aux

    def remover_final(self):
        if self.vazia():
            return

        aux = self.cabeca
        ant = None

        while aux.prox:
            ant = aux
            aux = aux.prox

        if ant is None:
            self.cabeca = None
        else:
            ant.prox = None

        del aux

    def remover_elemento(self, valor):
        if self.vazia():
            print("Lista vazia")
            return

        aux = self.cabeca
        ant = None

        while aux and aux.info != valor:
            ant = aux
            aux = aux.prox

        if aux is None:
            print("Elemento não encontrado")
            return

        if ant is None:
            self.cabeca = aux.prox
        else:
            ant.prox = aux.prox

        del aux
        print("Elemento removido")

    def esvaziar(self):
        while not self.vazia():
            self.remover_inicio()

    # ---------------------------------------------------------
    # MÉTODOS EXIGIDOS NA PROVA - LISTA
    # ---------------------------------------------------------

    def min(self):
        """
        Retorna o menor elemento da lista.
        """
        if self.vazia():
            return None

        menor = self.cabeca.info
        aux = self.cabeca.prox

        while aux:
            if aux.info < menor:
                menor = aux.info

            aux = aux.prox

        return menor

    def max(self):
        """
        Retorna o maior elemento da lista.
        """
        if self.vazia():
            return None

        maior = self.cabeca.info
        aux = self.cabeca.prox

        while aux:
            if aux.info > maior:
                maior = aux.info

            aux = aux.prox

        return maior

    def sum(self):
        """
        Retorna a soma dos elementos numéricos da lista.
        """
        total = 0
        aux = self.cabeca

        while aux:
            total += aux.info
            aux = aux.prox

        return total

    def avg(self):
        """
        Retorna a média dos elementos numéricos da lista.
        """
        quantidade = self.len()

        if quantidade == 0:
            return None

        return self.sum() / quantidade

    def len(self):
        """
        Retorna a quantidade de elementos da lista.
        """
        contador = 0
        aux = self.cabeca

        while aux:
            contador += 1
            aux = aux.prox

        return contador

    def append(self, outra_lista):
        """
        Concatena outra lista ao final da lista principal.
        Os elementos são copiados para evitar dependência entre as listas.
        """
        aux = outra_lista.cabeca

        while aux:
            self.inserir_final(aux.info)
            aux = aux.prox

    def reverse(self):
        """
        Inverte a ordem dos elementos da lista.
        """
        anterior = None
        atual = self.cabeca

        while atual:
            proximo = atual.prox
            atual.prox = anterior
            anterior = atual
            atual = proximo

        self.cabeca = anterior
