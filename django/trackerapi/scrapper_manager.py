# trackerapi/scraper_manager.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import threading, time

scrapped_products = []

def start_scraper(get_amazon_featured):
    def broadcast_loop():
        channel_layer = get_channel_layer()
        while True:
            print("Scraper running...")
            new_products = get_amazon_featured()
            if new_products:
                scrapped_products.clear()
                scrapped_products.extend(new_products)
            print(f"✅ Scraped {len(scrapped_products)} products")
            async_to_sync(channel_layer.group_send)(
                "featured_group",
                {"type": "notify_update"}
            )
            time.sleep(3600)

    threading.Thread(target=broadcast_loop, daemon=True).start()

