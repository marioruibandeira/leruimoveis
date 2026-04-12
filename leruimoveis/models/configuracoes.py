from django.db import models
from django.contrib.auth.models import User

class Configuracoes(models.Model):
    configuracoes_id = models.AutoField(primary_key=True)
    ce_utilizador = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    OPCOES_PUBLICIDADE = [
        (0, 'Desativado'),
        (1, 'Ativado'),
    ]
    
    publicidade = models.IntegerField(
        choices=OPCOES_PUBLICIDADE,
        default=0,
        null=True, 
        blank=True
    )

    class Meta:
        db_table = "tbl_configuracoes"

    def __str__(self):
        return str(self.configuracoes_id)