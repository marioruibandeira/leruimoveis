from django.shortcuts import render

def partners(request):
    return render(request, 'parceiros/partners.html')

def fidelity(request):
    return render(request, 'parceiros/fidelity.html')

def sales(request):
    return render(request, 'parceiros/partners-sales.html')

def partner(request):
    return render(request, 'parceiros/partner.html')

def partners_details(request):
    return render(request, 'parceiros/partners-details.html')

def perfil_imobiliario(request):
    return render(request, 'parceiros/perfil-imobiliario.html')

def redes_sociais(request):
    return render(request, 'parceiros/redes-sociais.html')

def sobre_agencia(request):
    return render(request, 'parceiros/sobre-agencia.html')  

def logotipo(request):
    return render(request, 'parceiros/logotipo.html')  

def informacoes_adicionais_parceiros(request):
    return render(request, 'parceiros/informacoes-adicionais-parceirosipo.html') 