from django.urls import path
from . import views


urlpatterns = [
    path('catalog', views.catalog, name='catalog'),
    path('custom', views.custom, name='custom'),
    path('basket', views.basket, name='basket'),
    path('add', views.CakeManageView.as_view(), name='cake_manage'),
    path("add-to-cart/<int:cake_id>/", views.add_to_cart, name="add_to_cart"),
    path('create-order/', views.create_order, name='create_order'),
    path('cart-delete/<int:item_id>/', views.delete_from_cart, name='cart_delete'),
    path('cart-update/<int:item_id>/<str:action>/', views.update_cart_quantity, name='cart_update'),
]