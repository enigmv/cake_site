from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Chat
from django.utils.timezone import localtime
from datetime import timedelta

@login_required
def chat_view(request):
    user = request.user

    if user.profile.role == "MA":  # менеджер
        chats = Chat.objects.filter(manager=user)

        chat_data = []
        for chat in chats:
            has_unread = chat.messages.filter(is_read=False).exclude(sender=user).exists()
            chat_data.append({
                "chat": chat,
                "has_unread": has_unread
            })

        context = {"chats": chat_data}

    else:  # заказчик
        chat = get_object_or_404(Chat, customer=user)
        has_unread = chat.messages.filter(is_read=False).exclude(sender=user).exists()

        context = {
            "chat": chat,
            "has_unread": has_unread
        }

    return render(request, "chat/chat.html", context)

@login_required
def chat_messages(request, chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    messages = chat.messages.all().order_by("created_at")

    data = []
    for msg in messages:
        ts = localtime(msg.created_at) + timedelta(hours=3)
        data.append({
            "sender": msg.sender.username,
            "message": msg.text,
            "image": msg.image.url if msg.image else None,
            "created_at": ts.strftime('%H:%M'),
            "is_read": msg.is_read
        })
    return JsonResponse(data, safe=False)
