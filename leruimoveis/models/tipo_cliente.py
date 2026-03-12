from django.db import models

class TipoCliente(models:Model):
    tipo_cliente_id = models.AutoField(primary_key=True)
    tipo_cliente = models.CharField(max_length=50)
    descricao = models.CharField(max_length=250)

    class Meta:
        db_table = "tbl_tipo_cliente"

    def __str__(self):
        return self.tipoCliente
