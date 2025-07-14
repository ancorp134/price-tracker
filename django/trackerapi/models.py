from django.db import models
from nanoid import generate

def generate_id():
    return generate(size=12)

class UserModel(models.Model):
    id = models.CharField(primary_key=True, default=generate_id, editable=False, max_length=12)
    first_name = models.CharField(max_length=20, null=False)
    middle_name = models.CharField(max_length=20, blank=True)
    last_name = models.CharField(max_length=20, null=False)
    email = models.EmailField(null=False, unique=True)
    password = models.CharField(max_length=10, null=False)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class TrackedProduct(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="tracked_products")
    product_url = models.URLField(null=False)
    product_title = models.CharField(max_length=500, null=False)
    current_price = models.FloatField(null=False)
    target_price = models.FloatField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_title} for {self.user.email}"

class PriceHistory(models.Model):
    product = models.ForeignKey(TrackedProduct, on_delete=models.CASCADE, related_name="price_history")
    price = models.FloatField()
    checked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.product_title} at {self.price} on {self.checked_at}"
