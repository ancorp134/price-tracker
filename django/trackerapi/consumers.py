import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.paginator import Paginator
from trackerapi.scrapper_manager import scrapped_products  # Import from manager


class FeaturedConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("✅ Client connected to WebSocket")
        await self.channel_layer.group_add("featured_group", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        print(f"❌ Disconnected: {close_code}")
        await self.channel_layer.group_discard("featured_group", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data.get("action") == "get_page":
            page = int(data.get("page", 1))
            print(len(scrapped_products))
            # Handle empty product list safely
            if not scrapped_products:
                await self.send(text_data=json.dumps({
                    "products": [],
                    "page": page,
                    "total_pages": 1
                }))
                return

            paginator = Paginator(scrapped_products, 8)  # 8 items per page
            page_data = paginator.get_page(page)

            await self.send(text_data=json.dumps({
                "products": page_data.object_list,  # List of dicts from scraper
                "page": page,
                "total_pages": paginator.num_pages
            }))

    async def notify_update(self, event):
        # Notify client that new data is available
        await self.send(text_data=json.dumps({
            "type": "update_available"
        }))
