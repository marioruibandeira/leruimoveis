from django.db import models

class TipoParceiro(models.Model):
    tip_parceiro_id = models.AutoField(primary_key=True)
    #tipo_parceiro = models.CharField(max_length=100)
    tipo_parceiro = models.CharField(max_length=100, default="Essencial")
    descricao = models.CharField(max_length=255)

    class Meta:
        db_table = "tbl_parceiros_tipo"
    
    def __str__(self):
        return self.tipo_parceiro