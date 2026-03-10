
from django.urls import path
from . import views

urlpatterns = [
    path('', views.partners, name='partners'), 
    path('fidelity/', views.fidelity, name='fidelity'),
    path('sales/', views.sales, name='sales'),
    path('partner/', views.partner, name='partner'),
    path('partners-details/', views.partners_details, name='partners-details'),
    path('perfil-imobiliario/', views.perfil_imobiliario, name='perfil-imobiliario'),
    path('redes-sociais/', views.redes_sociais, name='redes-sociais'),
    path('sobre-agencia/', views.sobre_agencia, name='sobre-agencia'),
    path('logotipo/', views.logotipo, name='logotipo'),
    path('informacoes-adicionais-parceiros/', views.informacoes_adicionais_parceiros, name='informacoes-adicionais-parceiros'),
]