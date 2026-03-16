from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from leruimoveis.models import Plano
from django.http import JsonResponse

@login_required
def pagamento(request):

    if request.GET.get('format') == 'json':
        p_id = request.GET.get('plano_id')
        
        try:
            plano = get_object_or_404(Plano, plano_id=p_id)

            nome_do_plano = plano.tipo_plano.tipo_plano if plano.tipo_plano else "Plano"

            return JsonResponse({
                'nome': nome_do_plano,
                'preco': str(plano.preco),
                'dias': plano.periodo
            })
        except Exception as e:

            print(f"Erro de Atributo: {e}")
            return JsonResponse({'error': str(e)}, status=404)

    return render(request, 'pagamento/pagamento.html')

