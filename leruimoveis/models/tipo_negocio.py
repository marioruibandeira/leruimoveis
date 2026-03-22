from django.db import models

class TipoNegocio(models.Model):
    tipo_negocio_id = models.AutoField(primary_key=True)
    tipo_negocio = models.CharField(max_length=50)
    descricao = models.CharField(max_length=255)

    class Meta:
        db_table = "tbl_tipo_negocio"

    def __str__(self):
        return self.tipo_negocio