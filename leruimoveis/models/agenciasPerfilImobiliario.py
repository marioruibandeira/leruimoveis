from django.db import models

class AgenciasPerfilImobiliario(models.Model):
    agencia_id = models.AutoField(primary_key=True)
    fk_utilizador = models.ForeignKey(User, on_delete=models.CASCADE)
    agencia_sede = models.CharField(max_length=50)
    agencia = models.CharField(max_length=50)
    telefone = models.CharField(max_length=13)
    telefone_alternativo = models.CharField(max_length=13)
    whatsapp = models.CharField(max_length=13)
    site = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    endereco = models.CharField(max_length=100)
    sobre_agencia = models.TextField()
    data_registro = models.DateField(auto_now=True)  
    data_u_actualizacao = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "tbl_agencias_perfil_imobiliario"

    def __str__(self):
        return self.titulo