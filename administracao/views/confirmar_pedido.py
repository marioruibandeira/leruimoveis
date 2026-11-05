from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.http import require_POST
from leruimoveis.models import Pedido
from administracao.decorators import staff_required


@staff_required
@require_POST
def confirmar_pedido(request, pedido_id):
    metodo = request.POST.get('metodo', '')
    documento = request.POST.get('documento_numero', '').strip()

    if metodo not in Pedido.Metodo.values:
        return JsonResponse({'sucesso': False, 'erro': 'Escolha o método de pagamento.'}, status=400)

    with transaction.atomic():
        pedido = get_object_or_404(Pedido.objects.select_for_update(), pk=pedido_id)

        if pedido.estado != Pedido.Estado.PENDENTE:
            return JsonResponse({'sucesso': False, 'erro': 'Este pedido já foi processado.'}, status=409)

        pedido.estado = Pedido.Estado.PAGO
        pedido.metodo = metodo
        pedido.confirmado_em = timezone.now()
        pedido.confirmado_por = request.user
        pedido.documento_numero = documento
        pedido.save(update_fields=['estado', 'metodo', 'confirmado_em', 'confirmado_por', 'documento_numero'])

    return JsonResponse({'sucesso': True})