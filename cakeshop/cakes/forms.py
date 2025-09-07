from .models import CakeCard
from django.forms import ModelForm, ClearableFileInput, TextInput, Textarea, NumberInput

class CakeCardForm(ModelForm):
    class Meta:
        model = CakeCard
        fields = ['image', 'name', 'description', 'price']
        labels = {
            'image': 'Изображение',
            'name': 'Название',
            'description': 'Описание',
            'price': 'Цена',
        }
        widgets = {
            'image': ClearableFileInput(attrs={
                'id': 'photo',
                'accept': 'image/*',
                'class': 'form-control'
            }),
            'name': TextInput(attrs={
                'id': 'name',
                'required': True,
                'class': 'form-control'
            }),
            'description': Textarea(attrs={
                'id': 'description',
                'rows': 6,
                'required': True,
                'class': 'form-control'
            }),
            'price': NumberInput(attrs={
                'id': 'price',
                'min': 0,
                'required': True,
                'class': 'form-control'
            }),
        }