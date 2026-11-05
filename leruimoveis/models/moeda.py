# leruimoveis/models/moeda.py
from django.db import models

class Moeda(models.Model):
    codigo = models.CharField(max_length=3, unique=True)  # "EUR", "AOA"
    nome = models.CharField(max_length=30)  # "Euro", "Kwanza"
    simbolo = models.CharField(max_length=5)  # "€", "Kz"

    class Meta:
        db_table = "tbl_moeda"

    def __str__(self):
        return f"{self.nome} ({self.simbolo})"