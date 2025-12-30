from django.db import models
from leruimoveis.models.listagem import Listagem
from leruimoveis.models.comodidades_seguranca import ComodidadesSeguranca

class ComodidadesSegurancaCaracte(models.Model):
    id = models.AutoField(primary_key=True)

    fk_listagem = models.ForeignKey(Listagem, on_delete=models.CASCADE)
    fk_comodidades_seguranca = models.ForeignKey(ComodidadesSeguranca, on_delete=models.CASCADE)

    class Meta:
        db_table = "tbl_comodidades_seguranca_caracte"

    def __str__(self):
        return f"{self.id}"