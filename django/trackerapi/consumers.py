import json
from channels.generic.websocket import AsyncWebsocketConsumer

class FeaturedConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("✅ Client connected to WebSocket")
        await self.channel_layer.group_add("featured_group", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        print(f"❌ Disconnected: {close_code}")
        await self.channel_layer.group_discard("featured_group", self.channel_name)

    async def receive(self, text_data):
        print(f"📩 Message from client: {text_data}")

    async def send_update(self, event):
        print(f"📢 Broadcasting to WebSocket: {event['data']}")
        await self.send(text_data=json.dumps(event['data']))
