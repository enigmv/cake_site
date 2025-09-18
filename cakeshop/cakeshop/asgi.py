import os
import sys
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import chat.routing


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cakeshop.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
