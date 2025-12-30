from django.contrib import admin
from django.urls import path, include
from .views import index
from . import views
from .views import servicedetails
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),
    path('', views.home, name='home'),
    path('properties/', views.properties, name='properties'),
    path('about/', views.about, name='about'),
    path('services/', views.services, name='services'),
    path('login/', views.login, name='login'),
    path('registrar/', views.registrar, name='registrar'),
    path('service-details/', servicedetails, name='servicedetails'),
    path('central-servicos/', include('centralservicos.urls')),
    path('property/<int:property_id>/', views.propertydetails, name='detalhespropriadade'),
    path('anuncios/', include('anuncios.urls')),
    path('partners/', include('parceiros.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
