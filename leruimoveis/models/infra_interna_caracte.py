from django.db import models
from leruimoveis.models.listagem import Listagem
from leruimoveis.models.infra_interna import InfraInterna

class InfraInternaCaracte(models.Model):
    id = models.AutoField(primary_key=True)

    fk_listagem = models.ForeignKey(Listagem, on_delete=models.CASCADE)
    fk_infra_interna = models.ForeignKey(InfraInterna, on_delete=models.CASCADE)

    class Meta:
        db_table = "tbl_infra_interna_caracte"

    def __str__(self):
        return f"{self.id}"

