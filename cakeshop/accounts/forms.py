# forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User

class RegisterUserForm(UserCreationForm):
    username = forms.CharField(
        label='',
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Логин'
        })
    )
    email = forms.EmailField(
        label='',
        widget=forms.EmailInput(attrs={
            'class': 'form-input',
            'placeholder': 'Email'
        })
    )
    password1 = forms.CharField(
        label='',
        widget=forms.PasswordInput(attrs={
            'class': 'form-input',
            'placeholder': 'Пароль',
            'id': 'password1'
        })
    )
    password2 = forms.CharField(
        label='',
        widget=forms.PasswordInput(attrs={
            'class': 'form-input',
            'placeholder': 'Повторите пароль',
            'id': 'password2'
        })
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Пользователь с таким email уже существует")
        return email

    def clean_name(self):
        name = self.cleaned_data.get('username')
        if User.objects.filter(username=name).exists():
            raise forms.ValidationError("Пользователь с таким именем уже существует")
        return name


class LoginUserForm (AuthenticationForm):
    username = forms.CharField(label='', widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Имя'}))
    password = forms.CharField(label='', widget=forms.PasswordInput(attrs={'class': 'form-input', 'placeholder': 'Пароль'}))
    email = forms.CharField(label='', widget=forms.EmailInput(attrs={'class': 'form-input', 'placeholder': 'Адрес электронной почты'}))
