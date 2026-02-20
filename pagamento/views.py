from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

@login_required
def pagamento(request):
    return render(request, 'pagamento/pagamento.html')

