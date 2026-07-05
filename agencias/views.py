from django.shortcuts import render
from django.http import JsonResponse
from leruimoveis.models import PlanoAprovado, Agencia, AuthUserProfile, AgenciaUtilizador 
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.db.models import Q

@login_required
def perfil_imobiliario(request):
    
    user = request.user

    plano_ativo = PlanoAprovado.objects.filter(
        utilizador=user,
        is_active=True,
        data_fim__gte=timezone.now(),
        plano__fk_tipo_cliente_id=3
    ).first()

    sede = Agencia.objects.filter(
        ce_utilizador=user,
        matriz__isnull=True
    ).first()

    agencias = Agencia.objects.filter(
        ce_utilizador=user
    ).order_by('matriz_id')

    if request.method == "POST":

        action = request.POST.get('action')

        if action == 'apagar':
            agencia_id = request.POST.get('agencia_id')

            try:
                ag = Agencia.objects.get(agencia_id=agencia_id, ce_utilizador=user)
            except Agencia.DoesNotExist:
                return JsonResponse({'status': 'erro', 'mensagem': 'Agência não encontrada.'})

            if ag.matriz_id is None:
                tem_filiais = Agencia.objects.filter(matriz=ag).exists()
                if tem_filiais:
                    return JsonResponse({'status': 'erro', 'mensagem': 'Não é possível apagar a sede enquanto tiver filiais. Apague primeiro todas as filiais.'})

            ag.delete()
            return JsonResponse({'status': 'ok', 'mensagem': 'Agência apagada com sucesso.'})

        if action == 'editar':
            agencia_id = request.POST.get('agencia_id')
            try:
                ag = Agencia.objects.get(agencia_id=agencia_id, ce_utilizador=user)
            except Agencia.DoesNotExist:
                return JsonResponse({'status': 'erro', 'mensagem': 'Agência não encontrada.'})

            if ag.matriz_id is None:
                ag.agencia = request.POST.get('sede')
            else:
                ag.agencia = request.POST.get('agencia')

            ag.telefone = request.POST.get('telefone')
            ag.telefone_alternativo = request.POST.get('telefoneAlternativo')
            ag.whatsapp = request.POST.get('whatsapp')
            ag.site = request.POST.get('site')
            ag.email = request.POST.get('email')
            ag.endereco = request.POST.get('endereco')
            ag.save()

            return JsonResponse({'status': 'ok', 'mensagem': 'Agência atualizada com sucesso.'})

        # bloco do Guardar
        """nome_agencia = request.POST.get('agencia') if sede else request.POST.get('sede')

        nova_agencia = Agencia.objects.create(
            agencia=nome_agencia,
            telefone=request.POST.get('telefone'),
            telefone_alternativo=request.POST.get('telefoneAlternativo'),
            whatsapp=request.POST.get('whatsapp'),
            site=request.POST.get('site'),
            email=request.POST.get('email'),
            endereco=request.POST.get('endereco'),
            ce_utilizador=user,
            matriz=sede,
        )"""
        total_agencias = Agencia.objects.filter(ce_utilizador=user).count()

        if plano_ativo and total_agencias >= plano_ativo.plano.total_empreendimentos:
            return JsonResponse({
                'status': 'erro',
                'mensagem': 'Limite de empreendimentos atingido.'
            })

        nome_agencia = request.POST.get('agencia') if sede else request.POST.get('sede')

        nova_agencia = Agencia.objects.create(
            agencia=nome_agencia,
            telefone=request.POST.get('telefone'),
            telefone_alternativo=request.POST.get('telefoneAlternativo'),
            whatsapp=request.POST.get('whatsapp'),
            site=request.POST.get('site'),
            email=request.POST.get('email'),
            endereco=request.POST.get('endereco'),
            ce_utilizador=user,
            matriz=sede,
        )

        return JsonResponse({
            'status': 'ok',
            'agencia_id': nova_agencia.agencia_id,
            'is_matriz': nova_agencia.matriz_id is None,
            'mensagem': 'Agência criada com sucesso.'
        })

    if request.GET.get('action') == 'lista':
        data = list(agencias.values(
            'agencia_id',
            'agencia',
            'telefone',
            'whatsapp',
            'matriz_id',
        ))
        return JsonResponse({'agencias': data})

    if request.GET.get('action') == 'detalhes':
        agencia_id = request.GET.get('agencia_id')
        try:
            ag = Agencia.objects.get(agencia_id=agencia_id, ce_utilizador=user)
        except Agencia.DoesNotExist:
            return JsonResponse({'status': 'erro', 'mensagem': 'Agência não encontrada.'})
            
        return JsonResponse({
            'status': 'ok',
            'agencia_id': ag.agencia_id,
            'agencia': ag.agencia,
            'telefone': ag.telefone,
            'telefone_alternativo': ag.telefone_alternativo or '',
            'whatsapp': ag.whatsapp or '',
            'site': ag.site or '',
            'email': ag.email or '',
            'endereco': ag.endereco,
            'is_matriz': ag.matriz_id is None,
        })

    return render(request, 'agencias/perfil-imobiliario.html', {
        'plano_ativo': plano_ativo,
        'sede': sede,
        'agencias': agencias,
    })


"""
==============================================================================================================================================================
    SOBRE A AGENCIA
==============================================================================================================================================================
"""
@login_required
def sobre_agencia(request):
    user = request.user

    sede = Agencia.objects.filter(
        ce_utilizador=user,
        matriz__isnull=True
    ).first()

    if request.method == "POST":
        if not sede:
            return JsonResponse({'status': 'erro', 'mensagem': 'Sem sede registada.'})

        action = request.POST.get('action')

        if action == 'eliminar':
            sede.sobre_agencia = None
            sede.save()
            return JsonResponse({'status': 'ok', 'mensagem': 'Conteúdo eliminado com sucesso.'})

        sede.sobre_agencia = request.POST.get('descricao')
        sede.save()
        return JsonResponse({'status': 'ok', 'mensagem': 'Informação guardada com sucesso.'})

    return render(request, 'agencias/sobre-agencia.html', {
        'sede': sede,
    })



"""
==============================================================================================================================================================
    SOBRE A AGENCIA
==============================================================================================================================================================
"""
@login_required
def informacoes_adicionais(request):
    user = request.user

    sede = Agencia.objects.filter(
        ce_utilizador=user,
        matriz__isnull=True
    ).first()

    if request.method == "POST":
        if not sede:
            return JsonResponse({'status': 'erro', 'mensagem': 'Sem sede registada.'})

        action = request.POST.get('action')

        if action == 'eliminar':
            sede.agencia_missao = None
            sede.agencia_visao = None
            sede.agencia_objectivo = None
            sede.save()
            return JsonResponse({'status': 'ok', 'mensagem': 'Conteúdo eliminado com sucesso.'})

        sede.agencia_missao = request.POST.get('missao')
        sede.agencia_visao = request.POST.get('visao')
        sede.agencia_objectivo = request.POST.get('objectivo')
        sede.save()

        return JsonResponse({'status': 'ok', 'mensagem': 'Informações guardadas com sucesso.'})

    return render(request, 'agencias/informacoes-adicionais.html', {
        'sede': sede,
    })

"""
==============================================================================================================================================================
    REDES SOCIAIS
==============================================================================================================================================================
"""
@login_required
def redes_sociais(request):
    user = request.user

    sede = Agencia.objects.filter(
        ce_utilizador=user,
        matriz__isnull=True
    ).first()

    if request.method == "POST":
        if not sede:
            return JsonResponse({'status': 'erro', 'mensagem': 'Sem sede registada.'})

        action = request.POST.get('action')
        campo = request.POST.get('campo')

        if action == 'eliminar':
            setattr(sede, campo, None)
            sede.save()
            return JsonResponse({'status': 'ok', 'mensagem': 'Rede social eliminada com sucesso.'})

        valor = request.POST.get('valor')
        setattr(sede, campo, valor)
        sede.save()
        return JsonResponse({'status': 'ok', 'mensagem': 'Rede social guardada com sucesso.'})

    return render(request, 'agencias/redes-sociais.html', {
        'sede': sede,
    })

"""
==============================================================================================================================================================
    REDES SOCIAIS
==============================================================================================================================================================
"""
@login_required
def configurar_perfil(request):
    user = request.user

    sede = Agencia.objects.filter(
        ce_utilizador=user,
        matriz__isnull=True
    ).first()

    agencias = Agencia.objects.filter(
        ce_utilizador=user
    ).order_by('matriz_id')

    agencia_utilizadores = AgenciaUtilizador.objects.filter(
        ce_filia_sede__ce_utilizador=user
    ).select_related('ce_utilizador', 'ce_filia_sede')

    if request.GET.get('action') == 'pesquisar':
        q = request.GET.get('q', '').strip()
        
        if len(q) < 2:
            return JsonResponse({'utilizadores': []})

        perfis = AuthUserProfile.objects.filter(
            Q(utilizador__username__icontains=q) |
            Q(primeiro_nome__icontains=q) |
            Q(sobre_nome__icontains=q)
        ).values(
            'utilizador__id',
            'utilizador__username',
            'primeiro_nome',
            'sobre_nome'
        )[:10]

        return JsonResponse({'utilizadores': list(perfis)})

    if request.GET.get('action') == 'lista_utilizadores':
        data = []
        for au in agencia_utilizadores:
            perfil = AuthUserProfile.objects.filter(utilizador=au.ce_utilizador).first()
            data.append({
                'agencia_utilizador_id': au.agencia_utilizador_id,
                'username': au.ce_utilizador.username,
                'nome': (perfil.primeiro_nome + ' ' + perfil.sobre_nome).strip() if perfil else '-',
                'agencia': au.ce_filia_sede.agencia,
            })
        return JsonResponse({'utilizadores': data})

    if request.method == "POST":
        action = request.POST.get('action')

        if action == 'apagar':
            agencia_utilizador_id = request.POST.get('agencia_utilizador_id')
            try:
                au = AgenciaUtilizador.objects.get(agencia_utilizador_id=agencia_utilizador_id, ce_filia_sede__ce_utilizador=user)
            except AgenciaUtilizador.DoesNotExist:
                return JsonResponse({'status': 'erro', 'mensagem': 'Registo não encontrado.'})
            
            au.delete()
            return JsonResponse({'status': 'ok', 'mensagem': 'Utilizador removido com sucesso.'})

        utilizador_id = request.POST.get('utilizador_id')
        agencia_id = request.POST.get('agencia_id')

        if not utilizador_id or not agencia_id:
            return JsonResponse({'status': 'erro', 'mensagem': 'Selecione um utilizador e uma agência.'})

        try:
            utilizador = User.objects.get(id=utilizador_id)
            agencia = Agencia.objects.get(agencia_id=agencia_id, ce_utilizador=user)
        except (User.DoesNotExist, Agencia.DoesNotExist):
            return JsonResponse({'status': 'erro', 'mensagem': 'Utilizador ou agência não encontrada.'})

        ja_existe = AgenciaUtilizador.objects.filter(
            ce_utilizador=utilizador,
            ce_filia_sede=agencia
        ).exists()

        if ja_existe:
            return JsonResponse({'status': 'erro', 'mensagem': 'Este utilizador já está associado a esta agência.'})

        AgenciaUtilizador.objects.create(
            ce_utilizador=utilizador,
            ce_filia_sede=agencia,
            criado_por=user
        )

        return JsonResponse({'status': 'ok', 'mensagem': 'Utilizador adicionado com sucesso.'})

    return render(request, 'agencias/configurar-perfil.html', {
        'sede': sede,
        'agencias': agencias,
        'agencia_utilizadores': agencia_utilizadores,
    })


"""
==============================================================================================================================================================
    LOGOTIPO
==============================================================================================================================================================
"""
@login_required
def logotipo(request):
    user = request.user

    sede = Agencia.objects.filter(
        ce_utilizador=user,
        matriz__isnull=True
    ).first()

    if request.method == "POST":
        if not sede:
            return JsonResponse({'success': False, 'message': 'Sem sede registada.'})

        action = request.POST.get('action')

        if action == 'eliminar':
            if sede.logotipo:
                sede.logotipo.delete(save=False)
                sede.save()
            return JsonResponse({'success': True, 'message': 'Logotipo eliminado com sucesso.'})

        imagem = request.FILES.get('cropped_image')
        if not imagem:
            return JsonResponse({'success': False, 'message': 'Nenhuma imagem recebida.'})

        if sede.logotipo:
            sede.logotipo.delete(save=False)

        sede.logotipo = imagem
        sede.save()

        return JsonResponse({'success': True, 'message': 'Logotipo guardado com sucesso.'})

    return render(request, 'agencias/logotipo.html', {
        'sede': sede,
    })
