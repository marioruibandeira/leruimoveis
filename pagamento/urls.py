from django.urls import path
from . import views

urlpatterns = [
    path('', views.pagamento, name='pagamento'), 
    path('pesquisar-agencias/', views.pesquisar_agencias, name='pesquisar_agencias'),
    path('pagar/<str:referencia>/', views.fazer_pagamento, name='fazer_pagamento'), 
]