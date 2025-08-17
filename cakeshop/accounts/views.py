from django.contrib.auth import logout
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView
from .forms import RegisterUserForm, LoginUserForm
from .models import Profile

class RegisterUser(CreateView):
    form_class = RegisterUserForm
    template_name = 'accounts/register.html'
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        response = super().form_valid(form)
        Profile.objects.create(
            user=self.object,
            role='CU',
            is_email_verified=True
        )

        return response

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class LoginUser(LoginView):
    form_class = LoginUserForm
    template_name = 'accounts/authorization.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
    def get_success_url(self):
        return reverse_lazy('home')


def profile(request):
    return render(request, 'accounts/profile.html')

def logout_user(request):
    logout(request)
    return redirect('login')