from nodo import Nodo


class Fila:
    """
    Implementação de Fila usando lista encadeada.
    Regra: FIFO - First In, First Out.
    """

    def __init__(self):
        self.inicio = None
        self.final = None

    def vazia(self):
        return self.inicio is None

    def enfileirar(self, info):
        novo = Nodo(info)

        if self.vazia():
            self.inicio = novo
            self.final = novo
        else:
            self.final.prox = novo
            self.final = novo

    def desenfileirar(self):
        if self.vazia():
            return None

        aux = self.inicio
        info = aux.info

        if self.inicio == self.final:
            self.inicio = None
            self.final = None
        else:
            self.inicio = self.inicio.prox

        del aux
        return info

    def primeiro(self):
        if self.vazia():
            return None

        return self.inicio.info

    def destruir(self):
        while not self.vazia():
            self.desenfileirar()

    # ---------------------------------------------------------
    # MÉTODOS EXIGIDOS NA PROVA - FILA
    # ---------------------------------------------------------

    def imprimir_fila(self):
        """
        Imprime todos os elementos da fila mantendo a estrutura original.
        """
        if self.vazia():
            print("Fila vazia")
            return

        aux = Fila()

        while not self.vazia():
            elemento = self.desenfileirar()
            print(elemento)
            aux.enfileirar(elemento)

        while not aux.vazia():
            self.enfileirar(aux.desenfileirar())

    def imprimir(self):
        """
        Método complementar para manter compatibilidade.
        """
        self.imprimir_fila()

    def buscar(self, info):
        """
        Busca um elemento na fila.
        Retorna True se encontrar e False caso contrário.
        """
        encontrado = False
        aux = Fila()

        while not self.vazia():
            elemento = self.desenfileirar()

            if elemento == info:
                encontrado = True

            aux.enfileirar(elemento)

        while not aux.vazia():
            self.enfileirar(aux.desenfileirar())

        return encontrado

    def editar(self, info, novo_info):
        """
        Edita o primeiro elemento encontrado na fila.
        Substitui info por novo_info.
        """
        aux = Fila()
        editado = False

        while not self.vazia():
            elemento = self.desenfileirar()

            if elemento == info and not editado:
                aux.enfileirar(novo_info)
                editado = True
            else:
                aux.enfileirar(elemento)

        while not aux.vazia():
            self.enfileirar(aux.desenfileirar())

        if editado:
            print("Elemento editado com sucesso")
        else:
            print("Elemento não encontrado")

    def remover(self, info):
        """
        Busca e remove o primeiro elemento encontrado na fila.
        """
        aux = Fila()
        removido = False

        while not self.vazia():
            elemento = self.desenfileirar()

            if elemento == info and not removido:
                removido = True
            else:
                aux.enfileirar(elemento)

        while not aux.vazia():
            self.enfileirar(aux.desenfileirar())

        if removido:
            print("Elemento removido com sucesso")
        else:
            print("Elemento não encontrado")

    def remover_repetidos(self):
        """
        Remove valores repetidos da fila.
        Mantém apenas a primeira ocorrência.
        """
        aux = Fila()
        valores = []

        while not self.vazia():
            elemento = self.desenfileirar()

            if elemento not in valores:
                valores.append(elemento)
                aux.enfileirar(elemento)

        while not aux.vazia():
            self.enfileirar(aux.desenfileirar())

        print("Valores repetidos removidos")
