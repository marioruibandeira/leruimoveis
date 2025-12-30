from django.db import models

class Parceiro(models.Model):
    parceiro = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    endereco = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    telefone = models.CharField(max_length=20)
    facebook = models.URLField(max_length=200, blank=True, null=True)
    linkedin = models.URLField(max_length=200, blank=True, null=True)
    x_profile = models.URLField(max_length=200, blank=True, null=True)
    instagram = models.URLField(max_length=200, blank=True, null=True)

    class Meta:
        db_table = "tbl_parceiros"
        
    #def __str__(self):
        #return self.parceiro
