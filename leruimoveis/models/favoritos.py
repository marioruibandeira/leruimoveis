from django.db import models
from leruimoveis.models import Listagem
from django.contrib.auth.models import User

class Favorito(models.Model):
    favorito_id = models.AutoField(primary_key=True)
    utilizador = models.ForeignKey(User, on_delete=models.CASCADE)
    listagem = models.ForeignKey(Listagem, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tbl_favorito"

    def __str__(self):
        #return f"Favorito {self.favorito_id} - User: {self.utilizador.username}"
        return f"{self.favorito_id}"


        