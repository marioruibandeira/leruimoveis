from django.urls import path
from . import views

urlpatterns = [
    path('', views.precos, name='precos'), 
    path('profissionais', views.profissionais, name='profissionais'),
    path('empreendimentos', views.empreendimentos, name='empreendimentos'),
]