from leruimoveis.models.configuracoes import Configuracoes
from leruimoveis.models.auth_user_profile import AuthUserProfile
from leruimoveis.models.listagem import Listagem
from django.contrib.auth.models import User

def check_ads_visibility(request):
    mostrar_publicidade = True
    
    if request.user.is_authenticated:
        config = Configuracoes.objects.filter(ce_utilizador=request.user).first()
        
        if config and config.publicidade == 1:
            mostrar_publicidade = False
       
    return {'mostrar_publicidade': mostrar_publicidade}


def check_existing_picture(request):
    mostra_foto_perfil = False
    perfil_encontrado = None

    if request.user.is_authenticated:
        perfil_encontrado = AuthUserProfile.objects.filter(utilizador_id=request.user.id).first()

        if perfil_encontrado:
            campo_foto = perfil_encontrado.foto_utilizador
            
            if campo_foto and str(campo_foto).strip() != "" and str(campo_foto) != "None":
                mostra_foto_perfil = True

    return {
        'mostra_foto_perfil': mostra_foto_perfil,
        'perfil': perfil_encontrado
    }


def foto_na_listagem(request):
    autor_username = "Utilizador não encontrado"
    perfil_autor = None
    mostra_foto = False
    usuario_auth = None  

    path_bits = request.path.strip('/').split('/')
    imovel_id = None
    
    for bit in path_bits:
        if bit.isdigit():
            imovel_id = bit
            break

    if imovel_id:
        imovel = Listagem.objects.filter(pk=imovel_id).first()
        if imovel:
            usuario_auth = imovel.utilizador 
            if usuario_auth:
                autor_username = usuario_auth.username
                perfil = AuthUserProfile.objects.filter(utilizador_id=usuario_auth.id).first()
                if perfil:
                    perfil_autor = perfil
                    if perfil.foto_utilizador:
                        caminho_foto = str(perfil.foto_utilizador).strip()
                        if caminho_foto not in ["", "None", "NoneType"]:
                            mostra_foto = True

    return {
        'autor_username': autor_username,
        'autor_id': usuario_auth.id if usuario_auth else None,
        'perfil_autor': perfil_autor,
        'mostra_foto_perfil_autor': mostra_foto
    }


