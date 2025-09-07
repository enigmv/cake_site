import json
import base64
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.core.files.base import ContentFile
from .models import Chat, Message
from django.utils.timezone import localtime

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return

        self.chat_id = self.scope['url_route']['kwargs'].get('chat_id')
        self.room_group_name = f'chat_{self.chat_id or self.user.id}'

        profile = await sync_to_async(lambda: self.user.profile)()
        self.role = profile.role

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # 👇 при входе в чат все непрочитанные помечаем как прочитанные
        if self.chat_id:
            await sync_to_async(
                lambda: Message.objects.filter(chat_id=self.chat_id, is_read=False)
                .exclude(sender=self.user).update(is_read=True)
            )()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        text = data.get('message', '').strip()
        image_data = data.get('image', None)

        if not text and not image_data:
            return

        if self.chat_id:
            chat = await sync_to_async(Chat.objects.get)(id=self.chat_id)
        else:
            chat = await sync_to_async(lambda: self.user.chats.first())()

        msg_kwargs = {
            'chat': chat,
            'sender': self.user,
            'text': text
        }

        if image_data:
            try:
                format, imgstr = image_data.split(';base64,')
                ext = format.split('/')[-1]
                file_name = f"{uuid.uuid4()}.{ext}"
                msg_kwargs['image'] = ContentFile(base64.b64decode(imgstr), name=file_name)
            except Exception as e:
                print("Ошибка при обработке изображения:", e)

        msg = await sync_to_async(Message.objects.create)(**msg_kwargs)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': msg.text,
                'sender': msg.sender.username,
                'image': msg.image.url if msg.image else None,
                'timestamp': localtime(msg.created_at).strftime('%H:%M'),
                'is_read': msg.is_read,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))
