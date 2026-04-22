from django.urls import path
from . import views

urlpatterns = [
    path('adicionar_favorito/', views.adicionar_favorito, name='adicionar_favorito'),
    path('favorito/', views.favorito, name='favorito'),
]