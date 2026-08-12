from django.db import models

class Destaque_Listagem(models:Model):
    destaque_listagem_id = models.AutoField(primary_key=True)
    ce_usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    ce_agencia = models.ForeignKey(, on_delete=models.CASCADE)
    ce_listagem = models.ForeignKey(Listagem, on_delete=models.CASCADE)
