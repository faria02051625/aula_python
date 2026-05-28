from nodo import Nodo


class Pilha:
    """
    Implementação de Pilha usando lista encadeada.
    Regra: LIFO - Last In, First Out.
    """

    def __init__(self):
        self.topo = None

    def vazia(self):
        return self.topo is None

    def push(self, info):
        novo = Nodo(info)
        novo.prox = self.topo
        self.topo = novo

    def pop(self):
        if self.vazia():
            return None

        aux = self.topo
        self.topo = self.topo.prox
        info = aux.info
        del aux

        return info

    def top(self):
        if self.vazia():
            return None

        return self.topo.info

    def imprimir(self):
        if self.vazia():
            print("Pilha vazia")
            return

        aux = Pilha()

        while not self.vazia():
            elemento = self.pop()
            print(elemento)
            aux.push(elemento)

        while not aux.vazia():
            self.push(aux.pop())

    
    def buscar(self, info):
        """
        Busca um elemento na pilha.
        Retorna True se encontrar e False caso contrário.
        """
        aux = self.topo

        while aux:
            if aux.info == info:
                return True

            aux = aux.prox

        return False
    

    def editar(self, info, novo_info):
        """
        Edita o primeiro elemento encontrado na pilha.
        Substitui info por novo_info.
        """
        aux = Pilha()
        editado = False

        while not self.vazia():
            elemento = self.pop()

            if elemento == info and not editado:
                aux.push(novo_info)
                editado = True
            else:
                aux.push(elemento)

        while not aux.vazia():
            self.push(aux.pop())

        if editado:
            print("Elemento editado com sucesso")
        else:
            print("Elemento não encontrado")

    def remover(self, info):
        """
        Busca e remove o primeiro elemento encontrado na pilha.
        """
        aux = Pilha()
        removido = False

        while not self.vazia():
            elemento = self.pop()

            if elemento == info and not removido:
                removido = True
            else:
                aux.push(elemento)

        while not aux.vazia():
            self.push(aux.pop())

        if removido:
            print("Elemento removido com sucesso")
        else:
            print("Elemento não encontrado")

    def remover_repetidos(self):
        """
        Remove valores repetidos da pilha.
        Mantém apenas a primeira ocorrência encontrada a partir do topo.
        """
        aux = Pilha()
        valores = []

        while not self.vazia():
            elemento = self.pop()

            if elemento not in valores:
                valores.append(elemento)
                aux.push(elemento)

        while not aux.vazia():
            self.push(aux.pop())

        print("Valores repetidos removidos")
