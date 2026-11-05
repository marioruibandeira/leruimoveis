from django.db import models
from django.contrib.auth.models import User
from leruimoveis.models import Listagem, Plano, Agencia
from leruimoveis.models.plano_destaque import PlanoDestaque
from django.utils import timezone

class Destaque_Listagem(models.Model):
    destaque_listagem_id = models.AutoField(primary_key=True)
    utilizador = models.ForeignKey(User, on_delete=models.CASCADE, related_name="destaques")
    listagem = models.ForeignKey(Listagem, on_delete=models.CASCADE, related_name="destaques")
    plano_destaque = models.ForeignKey(PlanoDestaque, on_delete=models.CASCADE, related_name="destaques_comprados")
    data_inicio = models.DateField(default=timezone.now)
    data_fim = models.DateField()
    preco_pago = models.DecimalField(max_digits=12, decimal_places=2)
    moeda_paga = models.CharField(max_length=3)
    is_active = models.BooleanField(default=True)
    criado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="destaques_criados")

    class Meta:
        db_table = "tbl_destaque_listagem"
        ordering = ['-data_inicio']

    def __str__(self):
        return f"Destaque: {self.listagem.titulo} ({self.data_inicio} - {self.data_fim})"
                                                    