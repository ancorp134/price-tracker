from .models import UserModel,TrackedProduct,PriceHistory
from rest_framework import serializers
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = UserModel
        fields = ('id', 'first_name', 'middle_name', 'last_name', 'email', 'password', 'verified')

    def create(self, validated_data):
        # Hash password before saving
        raw_password = validated_data.pop('password')
        validated_data['password'] = make_password(raw_password)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # If password present, hash it
        if 'password' in validated_data:
            raw = validated_data.pop('password')
            instance.password = make_password(raw)
        return super().update(instance, validated_data)
    

class TrackedProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackedProduct
        fields = ['product_url','product_title','current_price','target_price','current_price']
        read_only_fields = ['user']


class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = ['price']
        read_only_fields = ['product']
        