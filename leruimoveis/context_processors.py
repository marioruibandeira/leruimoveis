from leruimoveis.models.configuracoes import Configuracoes

def check_ads_visibility(request):
    # Por defeito, mostramos a publicidade (caso não haja registo ou seja 0/null)
    mostrar_publicidade = True
    
    if request.user.is_authenticated:
        # Procura o registo na tbl_configuracoes para o ID do utilizador logado
        config = Configuracoes.objects.filter(ce_utilizador=request.user).first()
        
        # Se o registo existir e o campo publicidade for exatamente 1, escondemos
        if config and config.publicidade == 1:
            mostrar_publicidade = False

    print(f"DEBUG: O valor de mostrar_publicidade é {mostrar_publicidade}") # Ver no terminal
       
    return {'mostrar_publicidade': mostrar_publicidade}