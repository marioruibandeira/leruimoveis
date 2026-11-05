from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import render
from leruimoveis.models import Pedido
from administracao.decorators import staff_required
from datetime import datetime, time, timedelta
from django.utils import timezone
from django.utils.dateparse import parse_date


def _data(valor):
    try:
        return parse_date(valor)
    except ValueError:
        return None


@staff_required
def pagamentos(request):
    termo = request.GET.get('q', '').strip()
    filtro_estado = request.GET.get('estado', '')
    filtro_tipo = request.GET.get('tipo', '')

    if filtro_estado not in Pedido.Estado.values:
        filtro_estado = ''
    if filtro_tipo not in Pedido.Tipo.values:
        filtro_tipo = ''

    pedidos = Pedido.objects.select_related('utilizador', 'moeda', 'parceria').order_by('-criado_em')

    if termo:
        pedidos = pedidos.filter(Q(referencia__icontains=termo) | Q(utilizador__username__icontains=termo) | Q(parceria__agencia_nome__icontains=termo) | Q(parceria__agencia_nif__icontains=termo))
    if filtro_estado:
        pedidos = pedidos.filter(estado=filtro_estado)
    if filtro_tipo:
        pedidos = pedidos.filter(tipo=filtro_tipo)

    data_de = _data(request.GET.get('de', ''))
    data_ate = _data(request.GET.get('ate', ''))

    if data_de:
        pedidos = pedidos.filter(criado_em__gte=timezone.make_aware(datetime.combine(data_de, time.min)))
    if data_ate:
        pedidos = pedidos.filter(criado_em__lt=timezone.make_aware(datetime.combine(data_ate + timedelta(days=1), time.min)))

    parametros = request.GET.copy()
    parametros.pop('page', None)

    pagina = Paginator(pedidos, 15).get_page(request.GET.get('page', 1))

    return render(request, 'pagamentos/historico-pagamentos.html', {
        'pedidos': pagina,
        'termo': termo,
        'filtro_estado': filtro_estado,
        'filtro_tipo': filtro_tipo,
        'estados': Pedido.Estado.choices,
        'tipos': Pedido.Tipo.choices,
        'querystring': parametros.urlencode(),
        'filtro_de': data_de.isoformat() if data_de else '',
        'filtro_ate': data_ate.isoformat() if data_ate else '',
    })