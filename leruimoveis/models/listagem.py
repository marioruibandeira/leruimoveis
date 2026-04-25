import os
from django.db import models
from django.db import models
from leruimoveis.models.pais import Pais
from leruimoveis.models.cidade import Cidade
from leruimoveis.models.designacao import Designacao
from django.contrib.auth.models import User

class Listagem(models.Model):
    titulo = models.CharField(max_length=100)
    fotos = models.ImageField(upload_to='listimages/', null=True, blank=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    endereco = models.TextField()
    descricao = models.TextField()
    pais = models.ForeignKey(Pais, on_delete=models.CASCADE)
    cidade = models.ForeignKey(Cidade, on_delete=models.CASCADE)
    designacao = models.ForeignKey(
        Designacao,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="designacao_id"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    utilizador = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = "tbl_listagem"

    def __str__(self):
        return f"{self.titulo} - {self.preco} ({self.pais.nome})"

    def save(self, *args, **kwargs):
        # Se já existe um objeto com esta PK, vamos verificar se a imagem mudou
        if self.pk:
            try:
                old = Listagem.objects.get(pk=self.pk)
                if old.fotos and old.fotos != self.fotos:
                    # Apagar a imagem antiga do disco
                    if os.path.isfile(old.fotos.path):
                        os.remove(old.fotos.path)
            except Listagem.DoesNotExist:
                pass
        super().save(*args, **kwargs)
        