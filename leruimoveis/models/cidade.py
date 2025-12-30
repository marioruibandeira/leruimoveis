from django.db import models
from leruimoveis.models.pais import Pais

class Cidade(models.Model):
    cidade_id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=50)
    pais = models.ForeignKey(Pais, on_delete=models.CASCADE, default=1)
    
    class Meta:
        db_table = "tbl_cidade"
        
    def __str__(self):
        return self.nome

