import os
import sys
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

# Устанавливаем DJANGO_SETTINGS_MODULE до импорта chat
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cakeshop.settings")

# добавляем корень проекта в PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# вызываем get_asgi_application чтобы инициализировать Django
django_asgi_app = get_asgi_application()

import chat.routing  # теперь можно импортировать модели

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
