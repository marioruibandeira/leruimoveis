from django.db import models
from django.contrib.auth.models import User

class FavoritosPerfil(models.Model):
    favorito_perfil_id = models.AutoField(primary_key=True)
    ce_utilizador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meus_favoritos')
    ce_agente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favoritado_por')
    created_at = models.DateTimeField(auto_now_add=True) 

    class Meta:
        db_table = "tbl_favorito_perfil"
        # Impede que o utilizador favorite o mesmo agente duas vezes
        unique_together = ('ce_utilizador', 'ce_agente')

    def __str__(self):
        # É melhor retornar algo legível para o painel de administração
        return f"User {self.ce_utilizador_id} -> Agente {self.ce_agente_id}"