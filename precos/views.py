from django.shortcuts import render
from django.http import JsonResponse
from leruimoveis.models import Plano
from ipware import get_client_ip
from django.contrib.gis.geoip2 import GeoIP2

CAMBIO_EUR_PARA_AOA = 1076.92

def get_pais(request):
    ip, is_routable = get_client_ip(request)
    if ip and is_routable:
        try:
            g = GeoIP2()
            return g.country_name(ip)
        except:
            pass
    return None

def converter_preco(planos, pais):
    for plano in planos:
        if pais == 'Angola':            
            plano['moeda'] = '€'
        else:            
            plano['preco'] = round(float(plano['preco']) * CAMBIO_EUR_PARA_AOA, 2)
            plano['moeda'] = 'Kz'

    return planos

def particulares(request):
    negocio_id = request.GET.get('negocio_id')
    periodo_texto = request.GET.get('periodo')

    if negocio_id and periodo_texto:
        dias = "".join(filter(str.isdigit, periodo_texto))

        planos = list(Plano.objects.filter(
            fk_tipo_cliente_id=1,
            tipo_negocio_id=negocio_id,
            periodo=dias
        ).values('preco', 'tipo_plano_id', 'plano_id'))

        pais = get_pais(request)
        planos = converter_preco(planos, pais)

        return JsonResponse(planos, safe=False)

    return render(request, 'precos/particulares.html')

def buscar_planos_ajax(request):
    tipo_cliente = 1 # Particulares
    negocio_id = request.GET.get('negocio_id')
    periodo_texto = request.GET.get('periodo')

    dias = "".join(filter(str.isdigit, periodo_texto))

    if not dias or not negocio_id:
        return JsonResponse([], safe=False)

    planos = Plano.objects.filter(
        fk_tipo_cliente_id=tipo_cliente,
        tipo_negocio_id=negocio_id,
        periodo=int(dias) 
    ).values('preco', 'tipo_plano_id', 'plano_id')

    return JsonResponse(list(planos), safe=False)

def profissionais(request):
    cliente_id = request.GET.get('cliente_id')
    listagem_id = request.GET.get('listagem_id')
    is_ajax = request.GET.get('format') == 'json'

    if cliente_id and listagem_id:
        try:
            c_id = int(cliente_id)            
            l_id = int(listagem_id)

            planos_dois = Plano.objects.filter(
                fk_tipo_cliente_id=c_id,
                numero_listagens=l_id
            ).values('preco', 'tipo_plano_id', 'plano_id', 'fk_tipo_cliente_id', 'periodo')

            pais = get_pais(request)
            planos_dois = converter_preco(planos_dois, pais)

            if is_ajax or request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse(list(planos_dois), safe=False)
                
        except (ValueError, TypeError) as e:
            if is_ajax:
                return JsonResponse({'error': 'Parâmetros inválidos'}, status=400)

    return render(request, 'precos/profissionais.html') 

def buscar_planos_profissionais(request):
    cliente_id = request.GET.get('cliente_id')
    listagem_id = request.GET.get('listagem_id')

    if not cliente_id or not listagem_id:
        return JsonResponse([], safe=False)

    planos_dois = Plano.objects.filter(
        fk_tipo_cliente_id=cliente_id,
        numero_listagens=listagem_id 
    ).values('preco', 'tipo_plano_id', 'plano_id')

    return JsonResponse(list(planos_dois), safe=False)

def empreendimentos(request):
    cliente_id = request.GET.get('cliente_id')
    nEmprendimentos_id = request.GET.get('nEmprendimentos_id')
    is_ajax = request.GET.get('format') == 'json'

    if cliente_id and nEmprendimentos_id:
        try:
            c_id = int(cliente_id)            
            ne_id = int(nEmprendimentos_id)

            planos_tres = Plano.objects.filter(
                fk_tipo_cliente_id = c_id,
                total_empreendimentos = ne_id
            ).values('preco', 'tipo_plano_id', 'plano_id', 'fk_tipo_cliente_id', 'periodo')

            pais = get_pais(request)
            planos_tres = converter_preco(planos_tres, pais)
            
            if is_ajax or request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse(list(planos_tres), safe=False)

        except (ValueError, TypeError) as e:
            if is_ajax:
                return JsonResponse({'error': 'Parâmetros inválidos'}, status=400)

    return render(request, 'precos/empreendimentos.html') 

def buscar_planos_empreendimentos(request):
    cliente_id = request.GET.get('cliente_id')
    nEmprendimentos_id = request.GET.get('nEmprendimentos_id')

    if not cliente_id or not nEmprendimentos_id:
        return JsonResponse([], safe=False)

    planos_tres = Plano.objects.filter(
        fk_tipo_cliente_id = cliente_id,
        total_empreendimentos = nEmprendimentos_id 
    ).values('preco', 'tipo_plano_id', 'plano_id')

    return JsonResponse(list(planos_tres), safe=False)


