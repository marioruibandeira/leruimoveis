from datetime import timedelta

from django.utils import timezone
from leruimoveis.models import Plano
from leruimoveis.models.assinatura import Assinatura

PLANO_POR_PACOTE = {1: 31, 2: 36, 3: 41}
DIAS_PLANO = 30


def criar_assinatura_parceria(pedido):
    parceria = pedido.parceria
    plano_id = PLANO_POR_PACOTE.get(parceria.tipo_parceiro_id)

    if plano_id is None or not Plano.objects.filter(pk=plano_id).exists():
        raise ValueError('Este pacote não tem um plano associado.')

    agora = timezone.now()
    assinatura = Assinatura.objects.filter(utilizador=pedido.utilizador, plano_id=plano_id).first()

    if assinatura:
        ativa = assinatura.is_active and assinatura.data_fim is not None and assinatura.data_fim > agora
        if not ativa:
            assinatura.data_inicio = agora
        base = assinatura.data_fim if ativa else agora
        assinatura.data_fim = base + timedelta(days=DIAS_PLANO)
        assinatura.is_active = True
        assinatura.agencia_id = parceria.agencia_id or assinatura.agencia_id
        assinatura.save(update_fields=['data_inicio', 'data_fim', 'is_active', 'agencia_id'])
        return assinatura

    return Assinatura.objects.create(plano_id=plano_id, utilizador=pedido.utilizador, agencia_id=parceria.agencia_id, data_inicio=agora, data_fim=agora + timedelta(days=DIAS_PLANO))