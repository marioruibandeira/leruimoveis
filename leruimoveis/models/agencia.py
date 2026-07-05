from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator

class Agencia(models.Model):
    agencia_id = models.AutoField(primary_key=True)
    agencia = models.CharField(max_length=50)
    telefone = models.CharField(max_length=20)
    telefone_alternativo = models.CharField(max_length=20, blank=True, null=True)
    whatsapp = models.CharField(max_length=20, blank=True, null=True)
    site = models.URLField(max_length=200, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    endereco = models.CharField(max_length=100)
    ce_utilizador = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='utilizador')
    logotipo = models.ImageField(upload_to='logotipos/', blank=True, null=True)
    sobre_agencia = models.TextField(validators=[MinLengthValidator(500)], blank=True, null=True)
    agencia_missao = models.TextField(validators=[MinLengthValidator(500)], blank=True, null=True)
    agencia_visao = models.TextField(validators=[MinLengthValidator(500)], blank=True, null=True)
    agencia_objectivo = models.TextField(validators=[MinLengthValidator(500)], blank=True, null=True)

    matriz = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='filiais',
        verbose_name='Matriz',
        help_text='Deixe em branco se esta agência for a matriz.'
    )

    class Meta:
        db_table = "tbl_agencia"

    def __str__(self):
        return self.agencia

    @property
    def is_matriz(self):
        return self.matriz_id is None

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.matriz_id and self.matriz_id == self.agencia_id:
            raise ValidationError({'matriz': 'Uma agência não pode ser matriz de si mesma.'})