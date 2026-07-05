
from django.urls import path
from . import views

urlpatterns = [
    path('perfil-imobiliario/', views.perfil_imobiliario, name='perfil-imobiliario'),
    path('sobre-agencia/', views.sobre_agencia, name='sobre-agencia'),
    path('informacoes-adicionais/', views.informacoes_adicionais, name='informacoes-adicionais'),
    path('redes-sociais/', views.redes_sociais, name='redes-sociais'),
    path('configurar-perfil/', views.configurar_perfil, name='configurar-perfil'),
    path('logotipo/', views.logotipo, name='logotipo'),
]