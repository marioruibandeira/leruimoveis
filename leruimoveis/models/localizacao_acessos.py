from django.db import models

class LocalizacaoAcessos(models.Model):
    id = models.AutoField(primary_key=True)
    localizacao_acessos = models.CharField(max_length=50)

    class Meta:
        db_table ="tbl_localizacao_acessos"

    def __str__(self):
        return f"{self.id}"
