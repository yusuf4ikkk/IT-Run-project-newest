from django.urls import path, include
from django.conf.urls.i18n import i18n_patterns
from . import views

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),  # обязательно, для set_language
]

urlpatterns += i18n_patterns(
    path('', views.index, name='index'),
)