from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from .models import UserModel,TrackedProduct,PriceHistory
from .serializers import UserSerializer,TrackedProductSerializer,PriceHistorySerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response



class Hello(APIView):

    def get(self,request):
        return Response({'title' : "Ankit Tyagi"},status=200)

# Create your views here.
