from django.db import models

class Designacao(models.Model):
    descricao = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "tbl_designacao"

    def __str__(self):
        return self.descricao or f"Designação {self.id}"
