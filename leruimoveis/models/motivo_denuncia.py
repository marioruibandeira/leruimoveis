from django.db import models

class MotivoDenuncia(models.Model):
    id_motivo = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=100) # Ex: "Burlador"

    class Meta:
        db_table = "tbl_motivo_denuncia"

    def __str__(self):
        return self.titulo