from django.db import models

class ParceriaPedido(models.Model):
    pedido = models.OneToOneField('leruimoveis.Pedido', on_delete=models.CASCADE, related_name='parceria')
    tipo_parceiro = models.ForeignKey('leruimoveis.TipoParceiro', on_delete=models.PROTECT, related_name='pedidos_parceria')
    agencia = models.ForeignKey('leruimoveis.Agencia', on_delete=models.SET_NULL, null=True, blank=True, related_name='pedidos_parceria')
    agencia_nome = models.CharField(max_length=150, blank=True)
    agencia_contacto = models.CharField(max_length=100, blank=True)
    agencia_nif = models.CharField(max_length=20, blank=True)

    class Meta:
        db_table = "tbl_parceria_pedido"