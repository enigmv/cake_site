# chat/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import Profile
from .models import Chat
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=Profile)
def create_chat_for_customer(sender, instance, created, **kwargs):
    if created and instance.role == "CU":
        manager = User.objects.filter(profile__role="MA").first()
        if manager:
            Chat.objects.create(customer=instance.user, manager=manager)
