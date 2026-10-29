# leruimoveis/models/plano_destaque.py
from django.db import models

class PlanoDestaque(models.Model):
    dias = models.IntegerField(unique=True)
    ativo = models.BooleanField(default=True)

    class Meta:
        db_table = "tbl_plano_destaque"
        ordering = ['dias']

    def __str__(self):
        return f"{self.dias} dias"