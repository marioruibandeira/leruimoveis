import secrets
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


def gerar_referencia():
    return secrets.token_hex(4).upper()


def expiracao_padrao():
    return timezone.now() + timedelta(days=7)


class Pedido(models.Model):
    class Tipo(models.TextChoices):
        PLANO = 'plano', 'Plano'
        DESTAQUE = 'destaque', 'Destaque'
        PARCERIA = 'parceria', 'Parceria'
        PUBLICIDADE = 'publicidade', 'Publicidade'
        SEM_PUBLICIDADE = 'sem_publicidade', 'Sem publicidade'

    class Estado(models.TextChoices):
        PENDENTE = 'pendente', 'Pendente'
        PAGO = 'pago', 'Pago'
        EXPIRADO = 'expirado', 'Expirado'

    class Metodo(models.TextChoices):
        STRIPE = 'stripe', 'Stripe'
        PAYPAL = 'paypal', 'PayPal'
        WHATSAPP = 'whatsapp', 'WhatsApp'

    class DocumentoOrigem(models.TextChoices):
        MANUAL = 'manual', 'Manual'
        AUTOMATICO = 'automatico', 'Automático'

    referencia = models.CharField(max_length=12, unique=True, editable=False, default=gerar_referencia)
    utilizador = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True,related_name='pedidos',)
    tipo = models.CharField(max_length=20, choices=Tipo.choices)
    descricao = models.CharField(max_length=150)
    valor = models.DecimalField(max_digits=12, decimal_places=2)
    moeda = models.ForeignKey('leruimoveis.Moeda', on_delete=models.PROTECT, related_name='+')
    estado = models.CharField(max_length=10, choices=Estado.choices, default=Estado.PENDENTE, db_index=True)
    metodo = models.CharField(max_length=10, choices=Metodo.choices, blank=True)
    id_externo = models.CharField(max_length=100, unique=True, null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    expira_em = models.DateTimeField(default=expiracao_padrao)
    confirmado_em = models.DateTimeField(null=True, blank=True)
    confirmado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='+',)
    documento_numero = models.CharField(max_length=50, blank=True)
    documento_origem = models.CharField(max_length=10, choices=DocumentoOrigem.choices, default=DocumentoOrigem.MANUAL)
    documento_url = models.URLField(blank=True)

    class Meta:
        ordering = ['-criado_em']
        db_table = "tbl_pedido"

    def __str__(self):
        return f'{self.referencia} ({self.get_estado_display()})'