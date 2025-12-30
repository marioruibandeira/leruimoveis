from django.db import models

class ComodidadesSeguranca(models.Model):
    id = models.AutoField(primary_key=True)
    comodidades_seguranca = models.CharField(max_length=50)

    class Meta:
        db_table = "tbl_comodidades_seguranca"

    def __str__(self):
        return f"{self.id}"


        