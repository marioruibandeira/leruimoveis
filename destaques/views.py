# destaques/views.py
from django.contrib.auth import authenticate, login as auth_login
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.http import JsonResponse
from leruimoveis.models.listagem import Listagem
from django.utils import timezone
from leruimoveis.models.destaque_listagem import Destaque_Listagem
from leruimoveis.models.assinatura import Assinatura
from leruimoveis.models.plano_destaque_preco import PlanoDestaquePreco
from precos.views import get_pais
import json
from django.views.decorators.http import require_POST
from django.shortcuts import render, get_object_or_404
from leruimoveis.models.agencia import Agencia
from django.core.paginator import Paginator
from django.db.models import Q
from leruimoveis.models.cidade import Cidade
from leruimoveis.models.tipo_negocio import TipoNegocio
from leruimoveis.models.tipo_cliente import TipoCliente
from django.urls import reverse


@login_required
def destaques_pagos(request):
    hoje = timezone.now().date()

    destaques = Destaque_Listagem.objects.select_related(
        'utilizador', 'listagem', 'plano_destaque'
    ).order_by('-data_inicio')

    return render(request, 'destaques/destaques-pagos.html', {
        'destaques': destaques,
        'hoje': hoje,
    })

@login_required
def pesquisar_utilizador(request):
    termo = request.GET.get('q', '').strip()

    if len(termo) < 2:
        return JsonResponse({'resultados': []})

    utilizadores = User.objects.filter(username__icontains=termo)[:10]

    resultados = [
        {'id': u.id, 'nome': u.username}
        for u in utilizadores
    ]

    return JsonResponse({'resultados': resultados})

@login_required
def listagens_por_utilizador(request, utilizador_id):
    hoje = timezone.now().date()

    listagens_com_destaque_ativo = Destaque_Listagem.objects.filter(
        is_active=True,
        data_fim__gte=hoje
    ).values_list('listagem_id', flat=True)

    listagens = Listagem.objects.filter(
        utilizador_id=utilizador_id,
        status=1
    ).exclude(
        id__in=listagens_com_destaque_ativo
    ).order_by('-created_at')

    resultados = [
        {
            'id': l.id,
            'titulo': l.titulo,
            'created_at': l.created_at.strftime('%d/%m/%Y'),
            'status': l.status,
        }
        for l in listagens
    ]

    return JsonResponse({'listagens': resultados})


@login_required
@login_required
def tipo_cliente_e_precos_destaque(request, utilizador_id):
    from precos.views import get_pais  # import local, evita ciclo

    assinatura = Assinatura.objects.filter(
        utilizador_id=utilizador_id,
        is_active=True
    ).select_related('plano__fk_tipo_cliente').first()

    if not assinatura:
        return JsonResponse({'tipo_cliente': None, 'precos': []})

    tipo_cliente = assinatura.plano.fk_tipo_cliente

    # Moeda por defeito consoante localização (o funcionário pode trocar via toggle)
    moeda_override = request.GET.get('moeda')  # 'EUR' ou 'AOA', vindo do toggle Portugal/Angola
    if moeda_override:
        moeda_codigo = moeda_override
    else:
        pais = get_pais(request)
        moeda_codigo = 'AOA' if pais == 'Angola' else 'EUR'

    precos = PlanoDestaquePreco.objects.filter(
        tipo_cliente=tipo_cliente,
        moeda__codigo=moeda_codigo
    ).select_related('plano_destaque').order_by('plano_destaque__dias')

    resultado = [
        {
            'plano_destaque_id': p.plano_destaque.id,
            'dias': p.plano_destaque.dias,
            'preco': str(p.preco),
        }
        for p in precos
    ]

    return JsonResponse({
        'tipo_cliente': tipo_cliente.tipo_cliente,
        'moeda': moeda_codigo,
        'precos': resultado
    })

@login_required
def novo_destaque(request):

    pais = get_pais(request)
    angola_checked = (pais == 'Angola')

    return render(request, 'destaques/destaques.html', {'angola_checked': angola_checked})


@login_required
def guardar_destaque(request):
    if request.method != 'POST':
        return JsonResponse({'sucesso': False, 'erro': 'Método não permitido'}, status=405)

    try:
        dados = json.loads(request.body)

        destaque = Destaque_Listagem.objects.create(
            utilizador_id=dados['utilizador_id'],
            listagem_id=dados['listagem_id'],
            plano_destaque_id=dados['plano_destaque_id'],
            preco_pago=dados['preco_pago'],
            moeda_paga=dados['moeda_paga'],
            data_inicio=dados['data_inicio'],
            data_fim=dados['data_fim'],
            criado_por=request.user,
        )

        return JsonResponse({'sucesso': True, 'id': destaque.destaque_listagem_id})

    except Exception as e:
        return JsonResponse({'sucesso': False, 'erro': str(e)}, status=400)


#
#
#
@login_required
@require_POST
def apagar_destaque(request, destaque_id):
    try:
        destaque = Destaque_Listagem.objects.get(pk=destaque_id)
        destaque.delete()
        return JsonResponse({'sucesso': True})
    except Destaque_Listagem.DoesNotExist:
        return JsonResponse({'sucesso': False, 'erro': 'Destaque não encontrado'}, status=404)


@login_required
def destaque_detalhes(request, destaque_id):
    destaque = get_object_or_404(
        Destaque_Listagem.objects.select_related('utilizador', 'listagem', 'plano_destaque', 'criado_por'),
        pk=destaque_id
    )

    hoje = timezone.now().date()
    dias_restantes = (destaque.data_fim - hoje).days
    tempo_restante = f"{dias_restantes} dias" if dias_restantes > 0 else "Expirado"
    status = "Ativo" if destaque.is_active and dias_restantes > 0 else "Expirado"

    agencia = Agencia.objects.filter(ce_utilizador=destaque.utilizador).first()
    nome_agencia = agencia.agencia if agencia else "—"

    return JsonResponse({
        'utilizador': destaque.utilizador.username,
        'agencia': nome_agencia,
        'titulo': destaque.listagem.titulo,
        'data': destaque.data_inicio.strftime('%d/%m/%Y'),
        'data_inicio': destaque.data_inicio.strftime('%d/%m/%Y'),
        'data_fim': destaque.data_fim.strftime('%d/%m/%Y'),
        'tempo_restante': tempo_restante,
        'status': status,
        'criado_por': destaque.criado_por.username if destaque.criado_por else "—",
    })


@login_required
def destaques_pagos(request):
    hoje = timezone.now().date()
    termo = request.GET.get('q', '').strip()

    destaques = Destaque_Listagem.objects.select_related('utilizador', 'listagem', 'plano_destaque')

    if termo:
        destaques = destaques.filter(
            Q(utilizador__username__icontains=termo) | Q(listagem__titulo__icontains=termo)
        )

    destaques = destaques.order_by('-data_inicio')

    paginator = Paginator(destaques, 15)
    pagina_numero = request.GET.get('page', 1)
    destaques_pagina = paginator.get_page(pagina_numero)

    return render(request, 'destaques/destaques-pagos.html', {
        'destaques': destaques_pagina,
        'hoje': hoje,
        'termo': termo,
    })


# destaques/views.py
def listar_destaques(request):
    hoje = timezone.now().date()

    destaques_qs = Destaque_Listagem.objects.filter(
        is_active=True,
        data_inicio__lte=hoje,
        data_fim__gte=hoje
    ).select_related('listagem', 'listagem__cidade')

    tipo_negocio_id = request.GET.get('tipo_negocio')
    cidade_id = request.GET.get('cidade')
    preco_min = request.GET.get('preco_min')
    preco_max = request.GET.get('preco_max')

    if tipo_negocio_id:
        destaques_qs = destaques_qs.filter(
            listagem__utilizador__meus_planos__is_active=True,
            listagem__utilizador__meus_planos__plano__tipo_negocio_id=tipo_negocio_id
        )
    if cidade_id:
        destaques_qs = destaques_qs.filter(listagem__cidade_id=cidade_id)
    if preco_min:
        destaques_qs = destaques_qs.filter(listagem__preco__gte=preco_min)
    if preco_max:
        destaques_qs = destaques_qs.filter(listagem__preco__lte=preco_max)

    destaques_qs = destaques_qs.order_by('-data_inicio')

    paginator = Paginator(destaques_qs, 12)
    pagina_numero = request.GET.get('page', 1)
    destaques_pagina = paginator.get_page(pagina_numero)

    for d in destaques_pagina:
        d.dias_restantes = (d.data_fim - hoje).days

    return render(request, 'destaques/destaques-publicos.html', {
        'destaques': destaques_pagina,
        'cidades': Cidade.objects.all(),
        'tipos_negocio': TipoNegocio.objects.all(),
        'filtros': {
            'tipo_negocio': tipo_negocio_id or '',
            'cidade': cidade_id or '',
            'preco_min': preco_min or '',
            'preco_max': preco_max or '',
        }
    })

# destaques/views.py
@login_required
def precos_destaque(request):
    pais = get_pais(request)
    moeda_default = 'AOA' if pais == 'Angola' else 'EUR'

    tipos_cliente = TipoCliente.objects.all()

    return render(request, 'destaques/precos-destaque.html', {
        'tipos_cliente': tipos_cliente,
        'angola_checked': moeda_default == 'AOA',
    })

def precos_destaque_ajax(request):
    tipo_cliente_id = request.GET.get('tipo_cliente_id')
    moeda_codigo = request.GET.get('moeda', 'EUR')

    precos = PlanoDestaquePreco.objects.filter(
        tipo_cliente_id=tipo_cliente_id,
        moeda__codigo=moeda_codigo
    ).select_related('plano_destaque').order_by('plano_destaque__dias')

    resultados = [
        {'plano_destaque_id': p.plano_destaque.id, 'dias': p.plano_destaque.dias, 'preco': str(p.preco)}
        for p in precos
    ]

    return JsonResponse({'precos': resultados, 'moeda': moeda_codigo})

def escolher_destaque(request):
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)

    dados = json.loads(request.body)

    request.session['destaque_pretendido'] = {
        'plano_destaque_id': dados['plano_destaque_id'],
        'tipo_cliente_id': dados['tipo_cliente_id'],
    }

    if request.user.is_authenticated:
        redirect_url = reverse('admin_destaques:selecionar_listagem')
    else:
        redirect_url = f"{reverse('login')}?next={reverse('admin_destaques:selecionar_listagem')}"

    return JsonResponse({'redirect_url': redirect_url})


@login_required
def destaques_precos(request):
    precos = PlanoDestaquePreco.objects.select_related(
        'plano_destaque', 'moeda', 'tipo_cliente'
    ).order_by('tipo_cliente_id', 'plano_destaque__dias', 'moeda_id')

    return render(request, 'destaques/destaques-precos.html', {
        'precos': precos,
    })

@login_required
def preco_destaque_detalhes(request, preco_id):
    preco = get_object_or_404(
        PlanoDestaquePreco.objects.select_related('tipo_cliente', 'plano_destaque', 'moeda'),
        pk=preco_id
    )

    return JsonResponse({
        'id': preco.id,
        'tipo_cliente': preco.tipo_cliente.tipo_cliente,
        'dias': preco.plano_destaque.dias,
        'moeda': preco.moeda.codigo,
        'preco': str(preco.preco),
    })

# destaques/views.py
import json

@login_required
def atualizar_preco_destaque(request, preco_id):
    if request.method != 'POST':
        return JsonResponse({'sucesso': False, 'erro': 'Método não permitido'}, status=405)

    try:
        dados = json.loads(request.body)
        preco = get_object_or_404(PlanoDestaquePreco, pk=preco_id)
        preco.preco = dados['preco']
        preco.save()

        return JsonResponse({'sucesso': True})

    except Exception as e:
        return JsonResponse({'sucesso': False, 'erro': str(e)}, status=400)