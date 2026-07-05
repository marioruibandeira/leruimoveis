from django.db import models
from django.contrib.auth.models import User
from leruimoveis.models import Agencia

class AgenciaUtilizador(models.Model):
    agencia_utilizador_id = models.AutoField(primary_key=True)
    ce_utilizador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='agencia_utilizadores')
    ce_filia_sede = models.ForeignKey(Agencia, on_delete=models.CASCADE, related_name='utilizadores')
    criado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='criados_por')
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tbl_agencia_utilizador"

    def __str__(self):
        return str(self.agencia_utilizador_id)