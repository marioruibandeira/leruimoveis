from django.db import models

class SituacaoLegal(models.Model):
    id = models.AutoField(primary_key=True)
    situacao_legal = models.CharField(max_length=50)

    class Meta:
        db_table = "tbl_situacao_legal"

    def __str__(self):
        return f"{self.id}"