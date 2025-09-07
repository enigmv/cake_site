from django.conf import settings
from django.db import models


User = settings.AUTH_USER_MODEL  # стандартная ссылка на модель пользователя

class Chat(models.Model):
    customer = models.ForeignKey(User, related_name="customer_chats", on_delete=models.CASCADE)
    manager = models.ForeignKey(User, related_name="manager_chats", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat: {self.customer.username} ↔ {self.manager.username}"


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(blank=True)
    image = models.ImageField(upload_to='chat_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"[{self.created_at}] {self.sender.username}: {self.text[:30]}"
