from django.shortcuts import render
from leruimoveis.models import Beneficio, ParceiroBeneficios, TipoParceiro
from precos.views import get_pais

def partners(request):
    return render(request, 'parceiros/partners.html')

def fidelity(request):
    tipos = list(
        TipoParceiro.objects.prefetch_related('parceiropreco_set__ce_moeda')
        .order_by('tip_parceiro_id')
    )
    beneficios = list(Beneficio.objects.all())
    ligacoes = {
        (l.ce_tipo_parceiro_id, l.ce_beneficio_id): l
        for l in ParceiroBeneficios.objects.all()
    }
 
    planos = []
    for tipo in tipos:
        precos = {p.ce_moeda.codigo: p for p in tipo.parceiropreco_set.all()}
        planos.append({
            'tipo': tipo,
            'beneficios': [
                {'nome': b.beneficio, 'valor': ligacoes[(tipo.pk, b.pk)].valor}
                for b in beneficios
                if (tipo.pk, b.pk) in ligacoes
            ],
            'preco_eur': precos.get('EUR'),
            'preco_aoa': precos.get('AOA'),
        })
 
    linhas = [
        {
            'beneficio': b,
            'celulas': [ligacoes.get((tipo.pk, b.pk)) for tipo in tipos],
        }
        for b in beneficios
    ]
 
    return render(request, 'parceiros/fidelity.html', {
        'planos': planos,
        'linhas': linhas,
        'angola_checked': get_pais(request) == 'Angola',
    }) 

def sales(request):
    return render(request, 'parceiros/partners-sales.html')

def partner(request):
    return render(request, 'parceiros/partner.html')

def partners_details(request):
    return render(request, 'parceiros/partners-details.html')

  

