from django.db import models
from leruimoveis.models.tipo_cliente import TipoCliente
from leruimoveis.models.tipo_plano import TipoPlano
from leruimoveis.models.tipo_servico import TipoServico
from leruimoveis.models.tipo_negocio import TipoNegocio
from leruimoveis.models.detalhes_imovel import DetalhesImovel

class Plano(models.Model):
    plano_id = models.AutoField(primary_key=True)
    fk_tipo_cliente = models.ForeignKey(TipoCliente, on_delete=models.CASCADE, default=1)
    tipo_plano = models.ForeignKey(TipoPlano, on_delete=models.CASCADE, default=1)	
    fk_tipo_servico	= models.ForeignKey(TipoServico, on_delete=models.CASCADE, default=1)
    tipo_negocio = models.ForeignKey(TipoNegocio, on_delete=models.CASCADE, default=1)	
    periodo	= models.PositiveIntegerField(default=1)
    total_empreendimentos = models.PositiveIntegerField(default=1)	
    numero_listagens = models.PositiveIntegerField(default=1)	
    preco = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    numero_foto = models.PositiveIntegerField(default=3)
    detalhes_imovel = models.ForeignKey(DetalhesImovel, on_delete=models.CASCADE, default=1)

    class Meta:
        db_table = "tbl_plano"

    def __str__(self):
        return self.plano