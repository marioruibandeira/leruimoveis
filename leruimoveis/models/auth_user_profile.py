from django.db import models
from django.contrib.auth.models import User

class AuthUserProfile(models.Model):
    authUserProfile = models.AutoField(primary_key=True)
    utilizador = models.ForeignKey(User, on_delete=models.CASCADE)
    primeiro_nome = models.CharField(max_length=50)
    sobre_nome = models.CharField(max_length=50)
    telefone = models.CharField(max_length=20)
    email = models.EmailField(max_length=100, unique=True)
    endereco = models.CharField(max_length=255)

    class Meta:
        db_table = "auth_user_profile"

    def __str__(self):
        return f"{self.primeiro_nome} {self.sobre_nome}"