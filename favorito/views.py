from django.shortcuts import render

def favorito(request):
    return render(request, 'favorito/favorito.html')
