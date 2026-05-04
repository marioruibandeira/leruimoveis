# denuncia_efetuada.py
from django.db import models
from django.contrib.auth.models import User
from leruimoveis.models.motivo_denuncia import MotivoDenuncia

class DenunciaEfetuada(models.Model):
    id_denuncia = models.AutoField(primary_key=True)
    autor_denuncia = models.ForeignKey(User, on_delete=models.CASCADE, related_name='denuncias_enviadas')
    perfil_denunciado = models.ForeignKey(User, on_delete=models.CASCADE, related_name='denuncias_recebidas')
    ce_motivos = models.ManyToManyField(MotivoDenuncia, related_name='denuncias', through='DenunciaEfetuadaMotivo')
    outros_detalhes = models.TextField(max_length=500, null=True, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tbl_denuncia_efetuada"

        