from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from .models import UserModel,TrackedProduct,PriceHistory
from .serializers import UserSerializer,TrackedProductSerializer,PriceHistorySerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
import jwt
from django.conf import settings
from rest_framework import status
from django.contrib.auth.hashers import check_password


def get_authenticated_user(request):

    header = request.headers.get('Authorization')

    if not header:
        return None
    
    try:
        token = header.split(' ')[1]
        print(token)
        decode= jwt.decode(token,settings.SECRET_KEY, algorithms=["HS256"])
        user_id = decode.get('user_id')
        user = UserModel.objects.get(id=user_id)
        return user
    except Exception:
        return None

def get_token_for_user(user):
    refresh = RefreshToken()
    refresh['user_id'] = user.id
    refresh['email'] = user.email
    return {
        'refresh' : str(refresh),
        'access' : str(refresh.access_token)
    }

class UserLoginView(APIView):
    def post(self,request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {"error": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        
        user = UserModel.objects.filter(email=email).first()
        if user is None:
            return Response(
                {"error": "User with this email does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        if not check_password(password,user.password):
            return Response(
                {"error": "Invalid password."},
                status=status.HTTP_404_NOT_FOUND
            )
        token = get_token_for_user(user)
        return Response(
            {
                "message": "sucesss",
                "token" : token
            },
            status=status.HTTP_200_OK
        )
    
class UserRegistrationView(APIView):

    def post(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=200)
        return Response(serializer.errors,status=400)
    
    
class UserProfileUpdateView(APIView):

    def patch(self, request, id):
        auth_user = get_authenticated_user(request)

        if auth_user is None:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        
        
        if str(auth_user.id) != id:
            return Response({"error": "You can only update your own profile"}, status=status.HTTP_403_FORBIDDEN)
        
        user = get_object_or_404(UserModel, id=id)
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
