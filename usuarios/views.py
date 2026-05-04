from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.auth import authenticate, login as auth_login
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from leruimoveis.models import AuthUserProfile
from django.contrib.auth import logout as django_logout
from django.contrib.auth import logout 
from django.db import transaction
from leruimoveis.models import PlanoAprovado
from django.core.files.storage import FileSystemStorage
import os
from django.conf import settings

def inscrever_se(request):
    if request.method == 'POST':
        nome_usuario = request.POST.get('nomeUsuario', '').strip()
        email = request.POST.get('email', '').strip()
        senha = request.POST.get('senha', '').strip()
        repetir_senha = request.POST.get('repetirSenha', '').strip()

        errors = {}

        if not nome_usuario:
            errors['nomeUsuario'] = 'O nome de usuário é obrigatório.'
        elif User.objects.filter(username=nome_usuario).exists():
            errors['nomeUsuario'] = 'Este nome de usuário já está em uso.'

        if not email:
            errors['email'] = 'O email é obrigatório.'
        else:
            try:
                validate_email(email)
            except ValidationError:
                errors['email'] = 'Email inválido.'
            if User.objects.filter(email=email).exists():
                errors['email'] = 'Este email já está registado.'

        if not senha:
            errors['senha'] = 'A senha é obrigatória.'
        elif len(senha) < 8:
            errors['senha'] = 'A senha deve ter pelo menos 8 caracteres.'
        if senha != repetir_senha:
            errors['repetirSenha'] = 'As senhas não coincidem.'

        if errors:
            # If using AJAX → return JSON
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': 'Corrige os erros no formulário.',
                    'errors': errors
                }, status=400)

            # If normal POST → show errors in template
            context = {'errors': errors, 'form_data': request.POST}
            return render(request, 'usuarios/inscrever-se.html', context)

        # Success: create user
        User.objects.create_user(
            username=nome_usuario,
            email=email,
            password=senha
        )

        messages.success(request, 'Conta criada com sucesso! Faça login.')
        return redirect('login')  # or 'home' or wherever you want

    # GET: show empty form
    return render(request, 'usuarios/inscrever-se.html')

def login(request):
    if request.method == 'POST':
        username = request.POST.get('nomeUsuario', '').strip()
        password = request.POST.get('senha', '').strip()

        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)
            return JsonResponse({
                'success': True,
                'message': 'Login efetuado com sucesso!'
            })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Nome de usuário ou senha incorretos.'
            }, status=401)

    return render(request, 'usuarios/login.html')


def signout(request):
    logout(request)
        
    return redirect('home')

@login_required
def profile(request):
    user = request.user
    
    # Tenta obter o perfil existente
    perfil_existente = None
    if user.is_authenticated:
        # Usamos select_related para trazer os dados do User numa única query (mais rápido)
        perfil_existente = AuthUserProfile.objects.select_related('utilizador').filter(utilizador=user).first()

    if request.method == 'POST':
        primeiroNome = request.POST.get('primeiroNome', '').strip()
        ultimoNome = request.POST.get('ultimoNome', '').strip()
        telefone = request.POST.get('telefone', '').strip()
        email = request.POST.get('email', '').strip()
        endereco = request.POST.get('endereco', '').strip()
        sobreMim = request.POST.get('sobreMim', '').strip()

        errors = {}

        if not user.is_authenticated:
            errors['user'] = 'Login necessário.'

        if not primeiroNome:
            errors['primeiroNome'] = 'O primeiro nome é obrigatório.'

        if not ultimoNome:
            errors['ultimoNome'] = 'O último nome é obrigatório.'

        if not email:
            errors['email'] = 'O email é obrigatório.'
        else:
            try:
                validate_email(email)
            except ValidationError:
                errors['email'] = 'Email inválido.'
            
            # Valida se o email já existe noutro utilizador (excluindo o próprio)
            if User.objects.filter(email=email).exclude(id=user.id).exists():
                errors['email'] = 'Este email já está registado por outro utilizador.'

        if errors:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': 'Corrige os erros no formulário.',
                    'errors': errors
                }, status=400)

            return render(request, 'usuarios/perfil.html', {
                'errors': errors, 
                'formData': request.POST, 
                'perfil': perfil_existente
            })

        # Atualiza ou cria o perfil
        perfil, created = AuthUserProfile.objects.update_or_create(
            utilizador=user,
            defaults={
                'primeiro_nome': primeiroNome,
                'sobre_nome': ultimoNome,
                'telefone': telefone,
                'email': email,
                'endereco': endereco,
                'sobreMim': sobreMim,
            }
        )

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True, 
                'message': 'Perfil guardado com sucesso!',
                'data': {
                    'username': user.username, # Aqui enviamos o username para o front
                    'email': email
                }
            })

        messages.success(request, 'Perfil guardado com sucesso!')
        return redirect('/usuarios/perfil/')

    # No GET, enviamos o perfil. O username já está acessível via {{ perfil.utilizador.username }}
    return render(request, 'usuarios/perfil.html', {
        'perfil': perfil_existente,
        'username': user.username if user.is_authenticated else ''
    })


@login_required
def encerrar(request):
    if request.method == 'POST':
        try:
            user = request.user
            
            with transaction.atomic():
                # 1. Tentar apagar o perfil primeiro (se existir)
                # Usamos .filter().delete() porque não causa erro se não encontrar nada
                AuthUserProfile.objects.filter(utilizador=user).delete()
                
                # 2. Apagar o utilizador
                user.delete()

            return JsonResponse({'success': True})
            
        except Exception as e:
            # Isto vai ajudar-te a ver o erro real no terminal do VS Code / PyCharm
            print(f"Erro no Encerramento: {str(e)}") 
            return JsonResponse({
                'success': False, 
                'message': f'Erro interno: {str(e)}'
            }, status=500)

    return render(request, 'usuarios/encerrar.html')

@login_required
def foto(request):
    user = request.user
    
    # IMPORTANTE: Definir o perfil logo no início, fora de qualquer IF.
    # Assim, ele existirá tanto no GET como no POST.
    perfil, created = AuthUserProfile.objects.get_or_create(utilizador=user)

    if request.method == 'POST':
        if not request.FILES.get('cropped_image'):
            return JsonResponse({'success': False, 'message': 'Nenhum ficheiro enviado.'}, status=400)

        try:
            nova_foto = request.FILES['cropped_image']
            
            # Apagar foto antiga se existir
            if perfil.foto_utilizador:
                caminho_antigo = os.path.join(settings.MEDIA_ROOT, str(perfil.foto_utilizador))
                if os.path.exists(caminho_antigo):
                    os.remove(caminho_antigo)

            # Guardar nova foto
            fs = FileSystemStorage()
            filename = f'perfil/{user.id}_{nova_foto.name}'
            saved_filename = fs.save(filename, nova_foto)
            
            # Atualizar BD
            perfil.foto_utilizador = saved_filename
            perfil.save()

            return JsonResponse({
                'success': True, 
                'message': 'Foto de perfil atualizada com sucesso!'
            })

        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Erro: {str(e)}'}, status=500)

    # Aqui é o GET: a variável 'perfil' já foi definida lá em cima
    context = {
        'perfil': perfil
    }
    return render(request, 'usuarios/foto.html', context)
    

@login_required
def subscricao(request):
    user = request.user

    plano_vinculado = PlanoAprovado.objects.select_related('plano__tipo_plano').filter(utilizador=user).first()
        
    context = {
        'plano_aprovado': plano_vinculado,
    }

    return render(request, 'usuarios/subscricao.html', context)


def logout_view(request):

    django_logout(request)

    return render(request, 'usuarios/logout.html')
    
