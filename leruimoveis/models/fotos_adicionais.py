from django.db import models
from leruimoveis.models.listagem import Listagem

class FotosAdicionais(models.Model):
    id = models.AutoField(primary_key=True)
    fk_listagem = models.ForeignKey(Listagem, on_delete=models.CASCADE)
    fotos = models.ImageField(upload_to='listimages/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    descricao = models.TextField()

    class Meta:
        db_table = "tbl_fotos_adicionais"

    def __str__(self):
        return f"{self.id}"