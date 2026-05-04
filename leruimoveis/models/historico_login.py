from django.db import models
from django.contrib.auth.models import User

class HistoricoLogin(models.Model):
    historico_id = models.AutoField(primary_key=True)
    ce_utilizador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='historico_acessos')
    data_login = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=500, null=True, blank=True)
    foi_sucesso = models.BooleanField(default=True)

    class Meta: 
        db_table = "tbl_historico_login"
        verbose_name = "Histórico de Login"
        verbose_name_plural = "Históricos de Login"
        ordering = ['-data_login'] # Garante que o mais recente aparece sempre no topo

    def __str__(self):
        status = "Sucesso" if self.foi_sucesso else "Falha"
        return f"{self.ce_utilizador.username} - {self.data_login} ({status})"