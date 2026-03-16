from django.urls import path
from . import views

urlpatterns = [
    path('particulares', views.particulares, name='particulares'), 
    path('profissionais', views.profissionais, name='profissionais'),
    path('empreendimentos', views.empreendimentos, name='empreendimentos'),
]