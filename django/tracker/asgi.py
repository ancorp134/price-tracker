from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
import trackerapi.routing
import os,django
from Scrapper.parsers.amazon import get_amazon_featured
from channels.layers import *
from trackerapi.scrapper_manager import start_scraper


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

start_scraper(get_amazon_featured)
