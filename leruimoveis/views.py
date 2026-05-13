import json
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from leruimoveis.models import Conteudo, Listagem, Servico, Favorito, AuthUserProfile  
from leruimoveis.models.fotos_adicionais import FotosAdicionais
from django.contrib.auth.decorators import login_required
from leruimoveis.models.auth_user_profile import AuthUserProfile 
from leruimoveis.models.favoritos_perfil import FavoritosPerfil 
from django.contrib.auth.models import User
from .models import DenunciaEfetuada, MotivoDenuncia

def index(request):
    properties = Listagem.objects.all().order_by('-id')[:9]
    return render(request, 'leruimoveis/index.html', {"properties": properties})
    
def properties(request):
    ps = request.GET.get('ps', '0')
    
    query = Listagem.objects.all()

    if ps == '1' or ps == '2':
        query = query.filter(pais_id=ps)

    lista_propriedades = query.order_by('-id')[:12]  

    contexto = {
        "properties": lista_propriedades,
        "ps": ps  # Enviamos de volta para o HTML saber qual botão destacar
    }

    return render(request, 'leruimoveis/properties.html', contexto)
    
def home(request):
    properties = Listagem.objects.all().order_by('-id')[:9]
    return render(request, 'leruimoveis/index.html', {"properties": properties})

def about(request):
    return render(request, 'leruimoveis/about.html')

def services(request):
    allServices = Servico.objects.all().order_by('-servico_id')
    return render(request, 'leruimoveis/services.html', {"services": allServices})
    
def servicedetails(request):
    service_id = request.GET.get('servico_id')
    try:
        service = Conteudo.objects.get(conteudo_id=service_id)
    except Conteudo.DoesNotExist:
        service = None
    return render(request, 'leruimoveis/service-details.html', {'servicedetails': service})


def propertydetails(request, property_id):
    property = get_object_or_404(Listagem, id=property_id)
    e_favorito = False
    
    if request.user.is_authenticated:
        try:
            # Usamos .id para garantir que comparamos números com números
            e_favorito = Favorito.objects.filter(
                utilizador_id=request.user.id, 
                listagem_id=property.id
            ).exists()
        except Exception as e:
            print(f"Erro na verificação: {e}") # Verifica o terminal para ver se há erro
            e_favorito = False

    return render(request, 'leruimoveis/property.html', {
        'property': property,
        'e_favorito': e_favorito
    })

def destaques(request):
    return render(request, 'leruimoveis/destaques.html')

"""
def user(request, id):
    # 1. Busca o perfil alvo (o agente que está a ser visitado)
    perfil_alvo = get_object_or_404(
        AuthUserProfile.objects.select_related('utilizador'), 
        utilizador_id=id
    )

    # 2. Inicializamos como False por padrão
    e_favorito = False

    # 3. Se o utilizador que está a ver a página estiver logado, verificamos a BD
    if request.user.is_authenticated:
        # Procuramos na tabela de favoritos se existe a relação entre:
        # O utilizador logado (quem_favorece) e o perfil alvo (favorecido)
        e_favorito = FavoritosPerfil.objects.filter(
            ce_utilizador=request.user, 
            ce_agente=perfil_alvo.utilizador # Usamos o campo FK para o User
        ).exists()

    # 4. Enviamos a variável 'e_favorito' para o template
    return render(request, 'leruimoveis/user.html', {
        'perfil_visitado': perfil_alvo,
        'autor_id': id,
        'e_favorito': e_favorito  # Esta variável será usada no class do botão
    })"""

def user(request, id):
    from django.contrib.auth.models import User
    
    # 1. Busca o utilizador alvo — 404 se o User não existir
    alvo_user = get_object_or_404(User, id=id)

    # 2. Tenta buscar o perfil, mas não falha se não existir
    try:
        perfil_alvo = AuthUserProfile.objects.select_related('utilizador').get(utilizador=alvo_user)
    except AuthUserProfile.DoesNotExist:
        perfil_alvo = None

    # 3. Verifica favorito
    e_favorito = False
    if request.user.is_authenticated:
        e_favorito = FavoritosPerfil.objects.filter(
            ce_utilizador=request.user,
            ce_agente=alvo_user
        ).exists()

    return render(request, 'leruimoveis/user.html', {
        'perfil_visitado': perfil_alvo,
        'alvo_user': alvo_user,        # <-- adiciona isto
        'autor_id': id,
        'e_favorito': e_favorito
    })

@login_required
def denunciar_perfil(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            motivos = data.get('motivos', [])
            outros = data.get('outros', None)
            autor_id = data.get('autor_id')
            denunciado_id = data.get('denunciado_id')

            autor = User.objects.get(id=autor_id)
            denunciado = User.objects.get(id=denunciado_id)

            denuncia = DenunciaEfetuada.objects.create(
                autor_denuncia=autor,
                perfil_denunciado=denunciado,
                outros_detalhes=outros
            )

            # Guardar motivos (ManyToMany)
            motivos_validos = ['1', '2', '3', '4']
            for m in motivos:
                if m in motivos_validos:
                    motivo = MotivoDenuncia.objects.get(id_motivo=int(m))
                    denuncia.ce_motivos.add(motivo)

            denuncia.save()

            return JsonResponse({'sucesso': True, 'redirect': f'/user/{denunciado_id}/'})

        except Exception as e:
            return JsonResponse({'sucesso': False, 'erro': str(e)}, status=400)

    return JsonResponse({'sucesso': False, 'erro': 'Método não permitido'}, status=405)




    
    
 
    