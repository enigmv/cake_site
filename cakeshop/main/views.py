from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'main/index.html')

def catalog(request):
    return render(request, 'main/catalog.html')

def basket(request):
    return render(request, 'main/basket.html')

def custom(request):
    return render(request, 'main/custom.html')


