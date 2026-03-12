from django.shortcuts import render

def precos(request):
    return render(request, 'precos/precos.html') 

def profissionais(request):
    return render(request, 'precos/profissionais.html') 

def empreendimentos(request):
    return render(request, 'precos/empreendimentos.html') 
