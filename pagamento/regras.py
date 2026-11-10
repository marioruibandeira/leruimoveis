from leruimoveis.models.assinatura import Assinatura
from leruimoveis.models import Agencia

TIPO_CLIENTE_AGENCIA = 'empreendimentos'


def motivo_bloqueio_parceria(utilizador):
    if utilizador is None:
        return 'O pedido não tem utilizador associado.'

    assinatura = Assinatura.objects.filter(utilizador=utilizador, is_active=True).select_related('plano__fk_tipo_cliente').first()
    if not assinatura:
        return None

    tipo = assinatura.plano.fk_tipo_cliente
    nome = (tipo.tipo_cliente if tipo else '').strip().lower()

    if nome != TIPO_CLIENTE_AGENCIA:
        return 'A parceria é só para agências. A sua conta tem um plano de outro tipo.'

    return None


def motivo_bloqueio_plano(utilizador, plano):
    tipo = plano.fk_tipo_cliente
    nome = (tipo.tipo_cliente if tipo else '').strip().lower()
 
    if nome == TIPO_CLIENTE_AGENCIA:
        return None
 
    tem_agencia = Agencia.objects.filter(ce_utilizador=utilizador).exists() or hasattr(utilizador, 'agenciautilizador')
 
    if tem_agencia:
        return 'Quem tem uma agência só pode subscrever planos de Empreendimentos.'
 
    return None