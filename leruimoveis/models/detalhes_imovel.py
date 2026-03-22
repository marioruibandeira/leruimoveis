from django.db import models

class DetalhesImovel(models.Model):
    detalhes_imovel_id = models.AutoField(primary_key=True)
    detalhes_imovel = models.CharField(max_length=50)
    descricao = models.CharField(max_length=255)

    class Meta:
        db_table = "tbl_detalhes_imovel"

    def __str__(self):
        return self.detalhes_imovel