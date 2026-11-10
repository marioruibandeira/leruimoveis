from django.urls import path
from . import views

urlpatterns = [
    path('', views.pagamento, name='pagamento'), 
    path('pagar/<str:referencia>/', views.fazer_pagamento, name='fazer_pagamento'), 
]