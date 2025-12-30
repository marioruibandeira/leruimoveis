import os
from django.shortcuts import render, redirect
from leruimoveis.models import Listagem, Cidade
from .forms import AnuncioForm
from django.contrib import messages
from leruimoveis.models import Listagem
from django.shortcuts import get_object_or_404, redirect
from django.http import JsonResponse
from leruimoveis.models.caracteristicas_gerais import CaracteristicasGerais

def anuncios_control(request):
    properties = Listagem.objects.all().order_by('-id')
    cidades = Cidade.objects.all()

    if request.method == 'POST':
        property_id = request.POST.get('property_id')  # vem do campo hidden no form

        if property_id:  # UPDATE
            instance = Listagem.objects.get(id=property_id)
            form = AnuncioForm(request.POST, request.FILES, instance=instance)
        else:  # INSERT
            form = AnuncioForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            messages.success(request, 'Anúncio guardado com sucesso!')
            return redirect('anuncios_control')
        else:
            messages.error(request, 'Erro ao guardar o anúncio. Verifique os campos.')
    else:
        form = AnuncioForm()

    return render(request, 'anuncios/anuncios.html', {
        'form': form,
        'properties': properties,
        'cidades': cidades        
    })

def delete_property(request, pk):
    property = get_object_or_404(Listagem, pk=pk)

    if property.fotos and property.fotos.path:
        if os.path.isfile(property.fotos.path):
            os.remove(property.fotos.path)

    property.delete()

    messages.success(request, "O anúncio foi eliminado com sucesso.")
    return redirect('anuncios_control')

def info_adicionais(request):
    properties = Listagem.objects.all().order_by('-id') 
    cidades = Cidade.objects.all() 
    
    context = { 'properties': properties, 'cidades': cidades, } 
    
    return render(request, 'anuncios/info-adicionais.html', context)

def fotos_adicionais(request):
    return render(request, 'anuncios/fotos-adicionais.html')


def get_caracteristicas(request, listagem_id):
    try:
        caract = CaracteristicasGerais.objects.get(fk_listagem_id=listagem_id)
        return JsonResponse({
            "exists": True,
            "area_total": caract.area_total,
            "area_util": caract.area_util,
            "numero_quartos": caract.numero_quartos,
            "numero_suites": caract.numero_suites,
            "numero_casas_banho": caract.numero_casas_banho,
            "numero_salas": caract.numero_salas,
            "numero_cozinhas": caract.numero_cozinhas,
            "numero_vagas_estacionamento": caract.numero_vagas_estacionamento,
            "ano_construcao": caract.ano_construcao,
            "fk_estado_conservacao": caract.fk_estado_conservacao_id,
            "fk_condicoes_pagamento": caract.fk_condicoes_pagamento_id,
            "fk_taxas_adicionais": caract.fk_taxas_adicionais_id,
        })
    except CaracteristicasGerais.DoesNotExist:
        return JsonResponse({"exists": False})

def save_caracteristicas(request):
    print("POST RECEBIDO:", request.POST) 
    if request.method == "POST": 

        listagem_id = request.POST.get("listagem_id")
        try: 
            caract, created = CaracteristicasGerais.objects.update_or_create( 
                fk_listagem_id=listagem_id, 
                defaults={ "area_total": request.POST.get("areaTotal") or None, 
                "area_util": request.POST.get("areaUtil") or None, 
                "numero_quartos": request.POST.get("numeroQuartos") or None, 
                "numero_suites": request.POST.get("numeroSuites") or None, 
                "numero_casas_banho": request.POST.get("numeroCasasBanho") or None, 
                "numero_salas": request.POST.get("numeroSalas") or None, 
                "numero_cozinhas": request.POST.get("numeroCozinhas") or None, 
                "numero_vagas_estacionamento": request.POST.get("numeroVagasEstacionamento") or None, 
                "ano_construcao": request.POST.get("anoConstrucao") or None, 
                "fk_estado_conservacao_id": request.POST.get("conservacao") or None, 
                "fk_condicoes_pagamento_id": request.POST.get("pagamento") or None, 
                "fk_taxas_adicionais_id": request.POST.get("taxasAdicionais") or None, 
                "fk_piso_id": request.POST.get("piso") or None, 
                } ) 
                
        except Exception as e: print("ERRO DJANGO:", e)











































