from django.urls import path, re_path
from . import views
from .views import RegisterUser, LoginUser

urlpatterns = [
    path('', LoginUser.as_view(), name='login'),
    path('register', RegisterUser.as_view(), name='register'),
    path('profile', views.profile, name='profile'),
    path('logout', views.logout_user, name='logout_user')
]


