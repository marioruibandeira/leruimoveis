from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import logout
from django.shortcuts import redirect

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

def profile(request):
    return render(request, 'usuarios/perfil.html')
    

