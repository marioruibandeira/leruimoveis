from django.urls import path
from . import views

urlpatterns = [
    path("inscrever-se/", views.inscrever_se, name='inscrever-se'),
    path("login/", views.login, name='login'),
    path('signout/', views.signout, name='signout'),
    path('perfil/', views.profile, name='perfil'),
]