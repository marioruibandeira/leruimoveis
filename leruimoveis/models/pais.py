from django.db import models

class Pais(models.Model):
    pais_id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=50)
    sigla = models.CharField(max_length=4)
    bandeira = models.CharField(max_length=100)
    descricao = models.CharField(max_length=255)
    
    class Meta:
        db_table = "tbl_pais"
        
    def __str__(self):
        return self.nome