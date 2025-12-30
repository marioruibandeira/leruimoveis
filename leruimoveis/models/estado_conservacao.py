from django.db import models

class EstadoConservacao(models.Model):
    id = models.AutoField(primary_key=True)
    estado_conservacao = models.CharField(max_length=50)

    class Meta:
        db_table = "tbl_estado_conservacao"
        
    def __str__(self):
        return self.estado_conservacao