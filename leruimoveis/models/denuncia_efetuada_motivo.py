from django.db import models
from leruimoveis.models.motivo_denuncia import MotivoDenuncia

class DenunciaEfetuadaMotivo(models.Model):
    id = models.AutoField(primary_key=True)
    ce_denuncia_efectuada = models.ForeignKey('leruimoveis.DenunciaEfetuada', on_delete=models.CASCADE)
    ce_motivo_denuncia = models.ForeignKey(MotivoDenuncia, on_delete=models.CASCADE)

    class Meta:
        db_table = "tbl_denuncia_efetuada_motivo"

    def __str__(self):
        return str(self.id)