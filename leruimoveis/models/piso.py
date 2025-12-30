from django.db import models

class Piso(models.Model):
    id = models.AutoField(primary_key=True)
    piso = models.CharField(max_length=50)

    class Meta:
        db_table = "tbl_piso"
    
    def __str__(self):
        return self.piso
