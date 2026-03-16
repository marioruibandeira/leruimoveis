from django.db import models
from leruimoveis.models.tipo_cliente import TipoCliente
from leruimoveis.models.tipo_servico import TipoServico

class TipoPlano(models.Model):
    tipo_plano_id = models.AutoField(primary_key=True)
    tipo_plano = models.CharField(max_length=50)
    descricao = models.CharField(max_length=255)
    fk_tipo_cliente = models.ForeignKey(TipoCliente, on_delete=models.CASCADE, default=1)

    class Meta:
        db_table = "tbl_tipo_plano"

    def __str__(self):
        return self.tipo_plano