from django.shortcuts import render

# Create your views here.
def partners(request):
    return render(request, 'parceiros/partners.html')

def fidelity(request):
    return render(request, 'parceiros/fidelity.html')

def sales(request):
    return render(request, 'parceiros/partners-sales.html')

def partner(request):
    return render(request, 'parceiros/partner.html')