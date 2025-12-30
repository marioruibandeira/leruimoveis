from django.db import models

class TaxasAdicionais(models.Model):
    id = models.AutoField(primary_key=True)
    taxas_adicionais = models.CharField(max_length=50)

    class Meta:
        db_table = "tbl_taxas_adicionais"

    def __str__(self):
        return self.taxas_adicionais
