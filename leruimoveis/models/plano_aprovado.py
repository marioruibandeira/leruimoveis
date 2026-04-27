from django.db import models
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from leruimoveis.models.plano import Plano 

class PlanoAprovado(models.Model):
    plano_activo_id = models.AutoField(primary_key=True)
    plano = models.ForeignKey(Plano, on_delete=models.CASCADE, related_name="planos_aprovados")
    utilizador = models.ForeignKey(User, on_delete=models.CASCADE, related_name="meus_planos")
    agencia_id = models.IntegerField(null=True, blank=True)
    data_inicio = models.DateTimeField(default=timezone.now)
    data_fim = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "tbl_plano_aprovado"
        verbose_name = "Plano Aprovado"
        verbose_name_plural = "Planos Aprovados"
        # Garante que um utilizador não tenha o mesmo plano aprovado duplicado, se necessário:
        unique_together = ('plano', 'utilizador')

    def __str__(self):
        return f"Plano {self.plano.nome} - {self.utilizador.username}"
