from django.db import models
from leruimoveis.models.localizacao_acessos import LocalizacaoAcessos
from leruimoveis.models.listagem import Listagem

class LocalizacaoAcessosCaracte(models.Model):
    id = models.AutoField(primary_key=True)

    fk_listagem = models.ForeignKey(Listagem, on_delete=models.CASCADE)
    fk_localizacao_acessos = models.ForeignKey(LocalizacaoAcessos, on_delete=models.CASCADE)

    class Meta:
        db_table = "tbl_localizacao_acessos_caracte"

    def __str__(self):
        return f"{self.id}" 