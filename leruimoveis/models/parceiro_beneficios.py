from django.db import models
from leruimoveis.models.parceiros_tipo import TipoParceiro
from leruimoveis.models.beneficio import Beneficio


class ParceiroBeneficios(models.Model):
    parceiro_beneficios_id = models.AutoField(primary_key=True)
    ce_tipo_parceiro = models.ForeignKey(TipoParceiro, on_delete=models.CASCADE)
    ce_beneficio = models.ForeignKey(Beneficio, on_delete=models.CASCADE)
    valor = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = "tbl_parceiro_beneficios"
        unique_together = ('ce_tipo_parceiro', 'ce_beneficio')

    def __str__(self):
        return f"{self.ce_tipo_parceiro} - {self.ce_beneficio}"