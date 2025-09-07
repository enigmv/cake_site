from django.contrib.auth.mixins import UserPassesTestMixin
from .forms import CakeCardForm
from django.views import View
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import CakeCard, Cart, CartItem
from django.http import JsonResponse
from datetime import date, timedelta


def catalog(request):
    cards = CakeCard.objects.all()
    return render(request, 'cakes/catalog.html', {'cards': cards} )

def basket(request):
    return render(request, 'cakes/basket.html')

def custom(request):
    return render(request, 'cakes/custom.html')

class AdminRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_authenticated and self.request.user.profile.role == "MA"

class CakeManageView(AdminRequiredMixin, View):
    template_name = 'cakes/add.html'

    def get(self, request):
        action = request.GET.get('action', 'add')
        pk = request.GET.get('pk')
        cards = CakeCard.objects.all()
        form = None

        if action == 'edit' and pk:
            try:
                card = CakeCard.objects.get(pk=pk)
                form = CakeCardForm(instance=card)
            except CakeCard.DoesNotExist:
                form = None
        elif action == 'add':
            form = CakeCardForm()

        return render(request, self.template_name, {
            'cards': cards,
            'action': action,
            'edit_pk': pk,
            'form': form,
        })

    def post(self, request):
        action = request.POST.get('action')
        pk = request.POST.get('edit_pk')
        if action == 'add':
            form = CakeCardForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
        elif action == 'edit' and pk:
            card = CakeCard.objects.get(pk=pk)
            form = CakeCardForm(request.POST, request.FILES, instance=card)
            if form.is_valid():
                form.save()
        elif action == 'delete' and pk:
            CakeCard.objects.get(pk=pk).delete()

        return redirect('catalog')

# корзина
MAX_CAKE_QUANTITY = 5

@login_required
def add_to_cart(request, cake_id):

    if request.method != 'POST':

        return redirect('catalog')

    cake = get_object_or_404(CakeCard, id=cake_id)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, cake=cake)

    if not created and item.quantity < MAX_CAKE_QUANTITY:
        item.quantity += 1
        item.save()
    elif created:
        item.save()

    cart_total = sum(i.quantity * i.cake.price for i in cart.items.all())

    return JsonResponse({
        "success": True,
        "quantity": item.quantity,
        "item_id": item.id,
        "cart_total": cart_total
    })


def basket(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = cart.items.select_related('cake').all()
    else:
        # для незалогиненных просто пустая корзина (или брать из сессии, если хочешь)
        items = []

    items_with_price = []
    for item in items:
        price = item.cake.price * item.quantity
        items_with_price.append({'item': item, 'price': price})

    total_price = sum(x['price'] for x in items_with_price)
    discount = 200 if request.user.is_authenticated else 0  # например, скидки только авторизованным
    final_price = max(0, total_price - discount)
    min_date = (date.today() + timedelta(days=3)).isoformat()

    return render(request, "cakes/basket.html", {
        "items_with_price": items_with_price,
        "total_price": total_price,
        "final_price": final_price,
        "discount": discount,
        "min_date": min_date,
    })



@login_required
def delete_from_cart(request, item_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method'}, status=400)

    cart, _ = Cart.objects.get_or_create(user=request.user)
    item = get_object_or_404(CartItem, id=item_id, cart=cart)
    item.delete()

    cart_total = sum(i.quantity * i.cake.price for i in cart.items.all())

    return JsonResponse({
        'success': True,
        'cart_total': cart_total,
        'items_count': cart.items.count()
    })


@login_required
def update_cart_quantity(request, item_id, action):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method'}, status=400)

    cart, _ = Cart.objects.get_or_create(user=request.user)
    item = get_object_or_404(CartItem, id=item_id, cart=cart)

    if action == 'increment' and item.quantity < MAX_CAKE_QUANTITY:
        item.quantity += 1
        item.save()
    elif action == 'decrement':

        if item.quantity > 1:
            item.quantity -= 1
            item.save()

    total_price = item.quantity * item.cake.price
    cart_total = sum(i.quantity * i.cake.price for i in cart.items.all())

    return JsonResponse({
        'quantity': item.quantity,
        'total_price': total_price,
        'cart_total': cart_total
    })


def create_order(request):
    if request.method == 'POST':
        pass
    return render(request, 'cakes/create_order.html')