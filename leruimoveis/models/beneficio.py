from django.db import models

class Beneficio(models.Model):
    beneficio_id = models.AutoField(primary_key=True)
    beneficio = models.CharField(max_length=50, unique=True)
    descricao = models.CharField(max_length=150, blank=True)
    ordem = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = "tbl_beneficio"
        ordering = ['ordem', 'beneficio_id']

    def __str__(self):
        return self.beneficio