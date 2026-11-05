from django.db import models
from leruimoveis.models.parceiros_tipo import TipoParceiro

class Parceiro(models.Model):
    parceiro_id = models.AutoField(primary_key=True)
    fk_agencia = models.OneToOneField(
        'leruimoveis.Agencia',
        on_delete=models.CASCADE,
        related_name='parceiro',
    )
    fk_tipo_parceiro = models.ForeignKey(TipoParceiro, on_delete=models.CASCADE)
    data_inicio = models.DateField()
    data_fim = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "tbl_parceiros"

    def __str__(self):
        return f"{self.fk_agencia} - {self.fk_tipo_parceiro}"