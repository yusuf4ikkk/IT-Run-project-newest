from django.contrib import admin
from django.urls import path, include
from django.conf.urls.i18n import i18n_patterns
from main import views

# Обязательно для переключения языка
urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
]

# Все остальные URL с префиксом языка
urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
)