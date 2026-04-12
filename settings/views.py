from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from  leruimoveis.models.configuracoes import Configuracoes 

@login_required
def settings(request):
    config, created = Configuracoes.objects.get_or_create(ce_utilizador=request.user)

    if request.method == 'POST':
        # Pega o valor enviado pelo rádio "conservacao"
        valor_publicidade = request.POST.get('conservacao')
        
        # Atualiza o objeto
        config.publicidade = valor_publicidade
        config.save()
        
        return redirect('settings') # Recarrega a página para mostrar que salvou

    context = {
        'config': config
    }

    return render(request, 'settings/settings.html', context)


