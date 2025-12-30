from django.db import models
from leruimoveis.models.listagem import Listagem
from leruimoveis.models.situacao_legal import SituacaoLegal

class SituacaoLegalCaracte(models.Model):
    id = models.AutoField(primary_key=True)
    
    fk_listagem = models.ForeignKey(Listagem, on_delete=models.CASCADE)
    fk_situacao_legal = models.ForeignKey(SituacaoLegal, on_delete=models.CASCADE)

    class Meta:
        db_table = "tbl_situacao_legal_caracte"

    def __str__(self):
        return f"{self.id}"