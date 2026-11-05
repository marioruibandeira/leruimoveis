from django.urls import path
from . import views

app_name = 'admin_destaques'

urlpatterns = [  
    path('', views.novo_destaque, name='novo_destaque'),
    path('pagos/', views.destaques_pagos, name='destaques_pagos'),
    path('pesquisar-utilizador/', views.pesquisar_utilizador, name='pesquisar_utilizador'),
    path('listagens/<int:utilizador_id>/', views.listagens_por_utilizador, name='listagens_por_utilizador'),
    path('precos/', views.destaques_precos, name='destaques_precos'),
    path('tipo-cliente-precos/<int:utilizador_id>/', views.tipo_cliente_e_precos_destaque, name='tipo_cliente_precos'),
    path('guardar/', views.guardar_destaque, name='guardar_destaque'),
    path('apagar/<int:destaque_id>/', views.apagar_destaque, name='apagar_destaque'),
    path('detalhes/<int:destaque_id>/', views.destaque_detalhes, name='destaque_detalhes'),
    path('precos-destaque/', views.precos_destaque, name='precos_destaque'),
    path('listar-destaques/', views.listar_destaques, name='listar_destaques'),
    path('precos-destaque/', views.precos_destaque, name='precos_destaque'),
    path('precos-destaque/ajax/', views.precos_destaque_ajax, name='precos_destaque_ajax'),
    path('escolher-destaque/', views.escolher_destaque, name='escolher_destaque'),
    path('precos/detalhes/<int:preco_id>/', views.preco_destaque_detalhes, name='preco_destaque_detalhes'),
    path('precos/atualizar/<int:preco_id>/', views.atualizar_preco_destaque, name='atualizar_preco_destaque'),
]