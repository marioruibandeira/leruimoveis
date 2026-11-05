from django.shortcuts import render
from leruimoveis.models import Pedido
from administracao.decorators import staff_required
from django.core.paginator import Paginator
from django.db.models import Q
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.http import require_POST


@staff_required
def pendentes(request):
    termo = request.GET.get('q', '').strip()
    pedidos = Pedido.objects.filter(estado=Pedido.Estado.PENDENTE).select_related('utilizador', 'moeda', 'parceria').order_by('criado_em')

    if termo:
        pedidos = pedidos.filter(Q(referencia__icontains=termo) | Q(utilizador__username__icontains=termo) | Q(parceria__agencia_nome__icontains=termo) | Q(parceria__agencia_nif__icontains=termo))

    pagina = Paginator(pedidos, 15).get_page(request.GET.get('page', 1))
    return render(request, 'pagamentos/pendentes.html', {'pedidos': pagina, 'termo': termo})


