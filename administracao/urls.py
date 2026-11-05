from django.urls import path
from . import views

app_name = 'administracao'

urlpatterns = [
    path('pendentes/', views.pendentes, name='pendentes'),
    path('pagamentos/', views.pagamentos, name='pagamentos'),
    path('funcionarios/', views.funcionarios, name='funcionarios'),
    path('pedidos/<int:pedido_id>/confirmar/', views.confirmar_pedido, name='confirmar_pedido'),
]