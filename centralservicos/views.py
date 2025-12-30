from django.shortcuts import render

def central_servicos(request):
    return render(request, 'centralservicos/central_servicos.html')
    
def registar_profissional(request):
    return render(request, 'centralservicos/registar_profissional.html')
    
def detalhes_profissional(request):
    return render(request, 'centralservicos/detalhes_profissional.html')
    
def informacao_completa(request):
    return render(request, 'centralservicos/informacoes_completa.html')
    
def verificar_profissional(request):
    return render(request, 'centralservicos/verificar_profissional.html')
