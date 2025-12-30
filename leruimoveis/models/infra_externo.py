from django.db import models

class InfraExterno(models.Model):
    id = models.AutoField(primary_key=True)
    infra_externo = models.CharField(max_length=50)

    class Meta:
        db_table = "tbl_infra_externo"

    def __str__(self):
        return self.infra_externo