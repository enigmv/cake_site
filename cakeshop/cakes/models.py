from django.db import models
from django.contrib.auth.models import User

class CakeCard(models.Model):
    image = models.ImageField(upload_to='chat_images/')
    name = models.CharField(max_length=50)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name



# корзина
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Корзина {self.user.username}"

# что в корзине
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    cake = models.ForeignKey(CakeCard, on_delete=models.CASCADE, null=True, blank=True)
    # Если кастомный торт, храним отдельно
    custom_cake = models.ForeignKey("CustomCake", on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.cake or self.custom_cake} x{self.quantity}"

# кастомный торты
class CustomCake(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Кастомный торт {self.name} ({self.user.username})"

# заказ
class Order(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "В обработке"),
        ("CONFIRMED", "Подтвержден"),
        ("IN_PROGRESS", "Готовится"),
        ("DELIVERED", "Доставлен"),
        ("CANCELLED", "Отменен"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    def __str__(self):
        return f"Заказ #{self.id} от {self.user.username}"

# сохранение заказа на момент заказа
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    cake = models.ForeignKey(CakeCard, on_delete=models.SET_NULL, null=True, blank=True)
    custom_cake = models.ForeignKey(CustomCake, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # фиксируем цену на момент заказа

    def __str__(self):
        return f"{self.cake or self.custom_cake} x{self.quantity}"
