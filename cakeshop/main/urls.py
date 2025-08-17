from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('catalog', views.catalog, name='catalog'),
    path('basket', views.basket, name='basket'),
    path('custom', views.custom, name='custom'),
]
