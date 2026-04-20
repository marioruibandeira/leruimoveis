from django.urls import path
from . import views

urlpatterns = [
    path("favorito/", views.favorito, name='favorito'),
]