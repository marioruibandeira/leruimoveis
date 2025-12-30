
from django.urls import path
from . import views

urlpatterns = [
    path('', views.partners, name='partners'), 
    path('fidelity/', views.fidelity, name='fidelity'),
    path('sales/', views.sales, name='sales'),
    path('partner/', views.partner, name='partner'),
]