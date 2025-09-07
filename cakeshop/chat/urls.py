from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat_view, name='chat'),
    path('messages/<int:chat_id>/', views.chat_messages, name='chat_messages'),
]
