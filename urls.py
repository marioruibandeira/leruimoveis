# leruimoveis/urls.py (in the main project directory)
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('leruimoveis.urls'))
]