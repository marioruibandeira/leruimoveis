from django.db import models
from leruimoveis.models.plano_destaque import PlanoDestaque  
from leruimoveis.models.moeda import Moeda
from leruimoveis.models.tipo_cliente import TipoCliente

class PlanoDestaquePreco(models.Model):
    plano_destaque = models.ForeignKey(PlanoDestaque, on_delete=models.CASCADE, related_name="precos")
    moeda = models.ForeignKey(Moeda, on_delete=models.CASCADE)
    tipo_cliente = models.ForeignKey('TipoCliente', on_delete=models.CASCADE)  # Particular/Profissional/Empreendimento
    preco = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = "tbl_plano_destaque_preco"
        unique_together = ('plano_destaque', 'moeda', 'tipo_cliente')

    def __str__(self):
        return f"{self.plano_destaque.dias} dias - {self.preco} {self.moeda.codigo}"