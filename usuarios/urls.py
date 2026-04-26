from django.urls import path
from . import views

urlpatterns = [
    path("inscrever-se/", views.inscrever_se, name='inscrever-se'),
    path("login/", views.login, name='login'),
    path('signout/', views.signout, name='signout'),
    path('perfil/', views.profile, name='perfil'),
    path('encerrar/', views.encerrar, name='encerrar'), 
    path('foto/', views.foto, name='foto'),
    path('subscricao/', views.subscricao, name='subscricao'),
    path('logout/', views.logout_view, name='logout'),
]