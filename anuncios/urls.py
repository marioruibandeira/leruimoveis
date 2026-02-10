from django.urls import path
from . import views

urlpatterns = [
    path('', views.anuncios_control, name='anuncios_control'), 
    path('delete/<int:pk>/', views.delete_property, name='delete_property'),
    path('info-adicionais/', views.info_adicionais, name='info_adicionais'),
    path('fotos-adicionais/', views.fotos_adicionais, name='fotos_adicionais'),
    path("caracteristicas/get/<int:listagem_id>/", views.get_caracteristicas, name="get_caracteristicas"), 
    path("caracteristicas/save/", views.save_caracteristicas, name="save_caracteristicas"),
    path("api/fotos/<int:id>/", views.api_fotos, name="api_fotos"),
    path("delete-all-fotos/<int:pk>/", views.delete_all_fotos, name="delete_all_fotos"),
    path("delete-foto/<int:pk>/", views.delete_foto, name="delete_foto"),
]
