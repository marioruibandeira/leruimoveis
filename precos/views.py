from django.shortcuts import render

def precos(request):
    return render(request, 'precos/precos.html')
