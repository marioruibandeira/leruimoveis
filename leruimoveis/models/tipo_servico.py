from django.db import models

class TipoServico(models.Model):
    tipo_servico_id = models.AutoField(primary_key=True)
    tipo_servico = models.CharField(max_length=50)
    descricao = models.CharField(max_length=255)

    class Meta:
        db_table = "tbl_tipo_servico"

    def __str__(self):
        return self.tipo_servico