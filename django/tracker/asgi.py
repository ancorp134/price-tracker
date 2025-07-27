from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
import trackerapi.routing
import os,django
from Scrapper.parsers.amazon import get_amazon_featured
from channels.layers import *
from asgiref.sync import async_to_sync
import threading

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tracker.settings')
django.setup() 

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(trackerapi.routing.websocket_urlpatterns)
        )
    ),
})


def broadcast_loop():
    channel_layer = get_channel_layer()
    while True:
        items = get_amazon_featured()  # Scrape latest products
        async_to_sync(channel_layer.group_send)(
            "featured_group", {"type": "send_update", "data": items}
        )
        time.sleep(120)  # Broadcast every 10 seconds

threading.Thread(target=broadcast_loop, daemon=True).start()
