from django.shortcuts import render
from leruimoveis.models import Listagem
from leruimoveis.models import Favorito, FavoritosPerfil
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
import json  
from django.contrib.auth.models import User

def favorito(request):
    all_favorito = Favorito.objects.filter(utilizador=request.user).select_related('listagem').order_by('-listagem_id')[:15]
                                   
    return render(request, 'favorito/favorito.html', {"all_favorito": all_favorito})


def adicionar_favorito(request):
    user = request.user
    
    if not user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'Login necessário'}, status=401)

    if request.method == 'POST':
        listagem_id = request.POST.get('listagem_id')
        
        try:
            listagem_obj = Listagem.objects.get(id=listagem_id)

            favorito, criado = Favorito.objects.get_or_create(
                utilizador_id=user.id, 
                listagem=listagem_obj
            )

            if criado:
                return JsonResponse({'success': True, 'message': 'Guardado!', 'valor': '1'})
            
            favorito.delete()
            return JsonResponse({'success': True, 'message': 'Removido!', 'valor': '0'})
                
        except Listagem.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Imóvel não encontrado.'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    return JsonResponse({'success': False, 'message': 'Método inválido.'}, status=400)

def adicionarAgenteFavorito(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            id_quem_favorece = data.get('quem_favorece')
            id_favorecido = data.get('favorecido')

            utilizador = User.objects.get(id=id_quem_favorece)
            agente = User.objects.get(id=id_favorecido)

            favorito, created = FavoritosPerfil.objects.get_or_create(
                ce_utilizador=utilizador,
                ce_agente=agente
            )

            if not created:
                # Se já existia, vamos remover
                favorito.delete()
                return JsonResponse({
                    'success': True, 
                    'status': 'removido', 
                    'message': 'Favorito removido com sucesso!'
                })
            
            return JsonResponse({
                'success': True, 
                'status': 'adicionado', 
                'message': 'Favorito adicionado com sucesso!'
            })

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)

    return JsonResponse({'success': False, 'message': 'Método inválido.'}, status=405)
