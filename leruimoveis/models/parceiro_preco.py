from django.db import models
from leruimoveis.models.parceiros_tipo import TipoParceiro
from leruimoveis.models.moeda import Moeda


class ParceiroPreco(models.Model):
    parceiro_preco_id = models.AutoField(primary_key=True)
    ce_tipo_parceiro = models.ForeignKey(TipoParceiro, on_delete=models.CASCADE)
    ce_moeda = models.ForeignKey(Moeda, on_delete=models.CASCADE)
    preco = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = "tbl_parceiro_preco"
        unique_together = ('ce_tipo_parceiro', 'ce_moeda') 

    def __str__(self):
        return f"{self.ce_tipo_parceiro} - {self.ce_moeda}: {self.preco}" 