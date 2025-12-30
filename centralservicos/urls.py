from django.urls import path
from . import views

urlpatterns = [
    path('', views.central_servicos, name='central_servicos'), 
    path('registar/', views.registar_profissional, name='registar_profissional'),
    path('detalhes/', views.detalhes_profissional, name='detalhes_profissional'),
    path('informacao/', views.informacao_completa, name='informacao_completa'),
    path('verificacao/', views.verificar_profissional, name='verificar_profissional')
]