class Nodo:
    """
    Classe que representa um nó de uma estrutura encadeada.
    Cada nó armazena uma informação e uma referência para o próximo nó.
    """

    def __init__(self, info):
        self.info = info
        self.prox = None

    def __str__(self):
        return str(self.info)
