from django.db import models

class InfraInterna(models.Model):
    id = models.AutoField(primary_key=True)
    infra_interna = models.CharField(max_length=50)
    
    class Meta:
        db_table = "tbl_infra_interna"
        
    def __str__(self):
        return self.infra_interna