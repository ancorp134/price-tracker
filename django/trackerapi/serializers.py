from .models import UserModel,TrackedProduct,PriceHistory
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.hashers import make_password


class UserSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['id','first_name','last_name','email','password']
    
    def create(self, validate_data):
        validate_data['password'] = make_password(validate_data['password'])
        return super().create(validate_data)
    

class TrackedProductSerializer(ModelSerializer):
    class Meta:
        model = TrackedProduct
        fields = ['product_url','product_title','current_price','target_price','current_price']
        read_only_fields = ['user']


class PriceHistorySerializer(ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = ['price']
        read_only_fields = ['product']
        