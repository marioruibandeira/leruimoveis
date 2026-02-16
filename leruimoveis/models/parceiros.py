from django.db import models
from leruimoveis.models.parceiros_tipo import TipoParceiro

class Parceiro(models.Model):
    parceiro_id = models.AutoField(primary_key=True)
    fk_tipo_parceiro = models.ForeignKey(TipoParceiro, on_delete=models.CASCADE)
    parceiro = models.CharField(max_length=50)
    contacto = models.CharField(max_length=50)
    telefone = models.CharField(max_length=13)
    telefone_alternativo = models.CharField(max_length=13)
    site = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    endereco = models.CharField(max_length=100)
    tipo_imobiliaria = models.CharField(max_length=50)
    descricao = models.CharField(max_length=255, null=True, blank=True)
    sobre_parceiro = models.TextField()
    data_registro = models.DateField(auto_now=True)
    data_fim = models.DateField(null=True, blank=True)    

    class Meta:
        db_table = "tbl_parceiros"
        
    #def __str__(self):
        #return self.parceiro
