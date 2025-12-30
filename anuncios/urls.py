from django.urls import path
from . import views

urlpatterns = [
    path('', views.anuncios_control, name='anuncios_control'), 
    path('delete/<int:pk>/', views.delete_property, name='delete_property'),
    path('info-adicionais/', views.info_adicionais, name='info_adicionais'),
    path('fotos-adicionais/', views.fotos_adicionais, name='fotos_adicionais'),
    path("caracteristicas/get/<int:listagem_id>/", views.get_caracteristicas, name="get_caracteristicas"), 
    path("caracteristicas/save/", views.save_caracteristicas, name="save_caracteristicas"),
]
