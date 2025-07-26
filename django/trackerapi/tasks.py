from celery import shared_task
from confluent_kafka import Producer, Consumer
import json
from django.conf import settings
from Scrapper.parsers.amazon import get_amazon_featured
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

TOPIC = 'featured-products'

@shared_task
def scrape_and_publish():
    items = get_amazon_featured()
    producer = Producer({'bootstrap.servers': settings.KAFKA_BROKER_URL})
    for item in items:
        producer.produce(TOPIC, value=json.dumps(item))
    producer.flush()
    return f"Published {len(items)} products"

@shared_task
def consume_and_broadcast():
    conf = {
        'bootstrap.servers': settings.KAFKA_BROKER_URL,
        'group.id': 'django-group',
        'auto.offset.reset': 'earliest'
    }
    consumer = Consumer(conf)
    consumer.subscribe([TOPIC])
    channel_layer = get_channel_layer()

    while True:
        msg = consumer.poll(1.0)
        if msg and not msg.error():
            product_data = json.loads(msg.value().decode('utf-8'))
            print(product_data)
            async_to_sync(channel_layer.group_send)(
                'featured_group', {'type': 'send_update', 'data': product_data}
            )
