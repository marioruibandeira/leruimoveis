from django.db import models
from leruimoveis.models.listagem import Listagem
from leruimoveis.models.infra_externo import InfraExterno

class InfraExternoCaracte(models.Model):
    id = models.AutoField(primary_key=True)

    fk_listagem = models.ForeignKey(Listagem, on_delete=models.CASCADE)

    fk_infra_externo = models.ForeignKey(InfraExterno, on_delete=models.CASCADE)

    class Meta:
        db_table = "tbl_infra_externo_caracte"

    def __str__(self):
        return f"{self.id}"