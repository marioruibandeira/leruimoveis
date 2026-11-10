from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from leruimoveis.models import Plano
from django.http import JsonResponse
from leruimoveis.models import Agencia
from precos.views import get_pais
import re
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from leruimoveis.models import ParceiroBeneficios, ParceiroPreco, ParceriaPedido, Pedido, TipoParceiro

from pagamento.regras import motivo_bloqueio_parceria


@login_required
def pagamento(request):
 
    if request.GET.get('format') == 'json':
        p_id = request.GET.get('plano_id')
        
        try:
            plano = get_object_or_404(Plano, plano_id=p_id)
 
            nome_do_plano = plano.tipo_plano.tipo_plano if plano.tipo_plano else "Plano"
 
            return JsonResponse({
                'nome': nome_do_plano,
                'preco': str(plano.preco),
                'dias': plano.periodo
            })
        except Exception as e:
 
            print(f"Erro de Atributo: {e}")
            return JsonResponse({'error': str(e)}, status=404)
 
    contexto = {}
    tipo_id = request.GET.get('plano')
 
    if tipo_id:
        tipo = get_object_or_404(TipoParceiro, pk=tipo_id)

        motivo = motivo_bloqueio_parceria(request.user)
        if request.user.is_staff:
            contexto['bloqueado'] = True
            contexto['erro'] = 'As contas de funcionários não podem contratar parcerias. Use uma conta de cliente.'
        elif motivo:
            contexto['bloqueado'] = True
            contexto['erro'] = motivo

        moeda_codigo = request.GET.get('moeda')

        if moeda_codigo not in ('EUR', 'AOA'):
            moeda_codigo = 'AOA' if get_pais(request) == 'Angola' else 'EUR'
 
        preco = ParceiroPreco.objects.filter(ce_tipo_parceiro=tipo, ce_moeda__codigo=moeda_codigo).select_related('ce_moeda').first()

        agencia = Agencia.objects.filter(ce_utilizador=request.user).first()
        contexto['agencia'] = agencia

        if request.method == 'POST' and not contexto.get('bloqueado'):
            nome = request.POST.get('agencia_nome', '').strip()
            contacto = request.POST.get('agencia_contacto', '').strip()
            nif = re.sub(r'\W', '', request.POST.get('agencia_nif', '')).upper()
 
            if not agencia and not (nome and contacto and nif):
                contexto['erro'] = 'Preencha o nome, o contacto e o NIF da agência.'
            elif not preco:
                contexto['erro'] = 'Este pacote não tem preço nesta moeda.'
            else:
                with transaction.atomic():
                    pedido = Pedido.objects.create(utilizador=request.user, tipo=Pedido.Tipo.PARCERIA, descricao=f'Parceria {tipo.tipo_parceiro}', valor=preco.preco, moeda=preco.ce_moeda)
                    if agencia:
                        ParceriaPedido.objects.create(pedido=pedido, tipo_parceiro=tipo, agencia=agencia)
                    else:
                        ParceriaPedido.objects.create(pedido=pedido, tipo_parceiro=tipo, agencia_nome=nome, agencia_contacto=contacto, agencia_nif=nif)
                return redirect('fazer_pagamento', referencia=pedido.referencia)
 
        beneficios = ParceiroBeneficios.objects.filter(
            ce_tipo_parceiro=tipo,
        ).select_related('ce_beneficio').order_by(
            'ce_beneficio__ordem', 'ce_beneficio__beneficio_id'
        )
 
        contexto['parceria'] = {
            'tipo': tipo,
            'preco': preco,
            'beneficios': beneficios,
        }
 
    return render(request, 'pagamento/pagamento.html', contexto)


@login_required
def pesquisar_agencias(request):
    termo = request.GET.get('q', '').strip()
    if len(termo) < 2:
        return JsonResponse([], safe=False)
    agencias = Agencia.objects.filter(
        nome__icontains=termo,
        agenciautilizador__utilizador=request.user,
    )[:10]
    return JsonResponse([{'id': a.id, 'nome': a.nome} for a in agencias], safe=False)

@login_required
def fazer_pagamento(request, referencia):
    pedido = get_object_or_404(Pedido.objects.select_related('moeda'), referencia=referencia, utilizador=request.user)
 
    if pedido.estado == Pedido.Estado.PENDENTE and pedido.expira_em <= timezone.now():
        pedido.estado = Pedido.Estado.EXPIRADO
        pedido.save(update_fields=['estado'])
 
    return render(request, 'pagamento/fazer_pagamento.html', {
        'pedido': pedido,
        'whatsapp_numero': getattr(settings, 'WHATSAPP_NUMERO', ''),
    })
