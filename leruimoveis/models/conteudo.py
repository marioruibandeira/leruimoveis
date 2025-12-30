from django.db import models


class Conteudo(models.Model):
    conteudo_id = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=100)
    corpo = models.TextField()
    detalhes = models.CharField(max_length=255)
    icons = models.TextField(default='icons')
    
    class Meta:
        db_table = "tbl_conteudo"
    
    def __str__(self):
        return self.titulo
        


    
    
