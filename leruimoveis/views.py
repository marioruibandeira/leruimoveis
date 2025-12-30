# leruimoveis/views.py
from django.shortcuts import render, get_object_or_404
from leruimoveis.models import Conteudo, Listagem  # ← IMPORTA Listagem

def index(request):
    properties = Listagem.objects.all().order_by('-id')[:9]
    return render(request, 'leruimoveis/index.html', {"properties": properties})
    
def properties(request):
    allProperties = Listagem.objects.all().order_by('-id')  
    return render(request, 'leruimoveis/properties.html', {"properties": allProperties})
    
def home(request):
    properties = Listagem.objects.all().order_by('-id')[:9]
    return render(request, 'leruimoveis/index.html', {"properties": properties})

def about(request):
    return render(request, 'leruimoveis/about.html')

def services(request):
    return render(request, 'leruimoveis/services.html')
    
def login(request):
    return render(request, 'leruimoveis/login.html')
    
def registrar(request):
    return render(request, 'leruimoveis/registrar.html')
    
def servicedetails(request):
    service_id = request.GET.get('id')
    try:
        service = Conteudo.objects.get(conteudo_id=service_id)
    except Conteudo.DoesNotExist:
        service = None
    return render(request, 'leruimoveis/service-details.html', {'service': service})


def propertydetails(request, property_id):
    property = get_object_or_404(Listagem, id=property_id)  
    return render(request, 'leruimoveis/property.html', {'property': property})


    
    
 
    