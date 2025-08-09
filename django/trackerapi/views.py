# trackerapi/views.py
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication  # optional, not used here
from .models import UserModel
from .serializers import UserSerializer
from django.contrib.auth.hashers import check_password

# token lifetimes
ACCESS_TOKEN_LIFETIME = timedelta(minutes=15)
REFRESH_TOKEN_LIFETIME = timedelta(days=7)


def generate_tokens_for_user(user):
    """
    Returns a dict: { 'access': <token>, 'refresh': <token> }
    Tokens have token_type claim so we can validate usage.
    """
    now = datetime.utcnow()
    access_payload = {
        'user_id': user.id,
        'exp': now + ACCESS_TOKEN_LIFETIME,
        'iat': now,
        'token_type': 'access'
    }
    refresh_payload = {
        'user_id': user.id,
        'exp': now + REFRESH_TOKEN_LIFETIME,
        'iat': now,
        'token_type': 'refresh'
    }

    access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm='HS256')
    refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm='HS256')

    # jwt.encode returns a str in PyJWT>=2.x; ensure string
    if isinstance(access_token, bytes):
        access_token = access_token.decode('utf-8')
    if isinstance(refresh_token, bytes):
        refresh_token = refresh_token.decode('utf-8')

    return {'access': access_token, 'refresh': refresh_token}


# -------------------------
# Register
# -------------------------
class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# Login
# -------------------------
class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

        user = UserModel.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # check_password expects a hashed password; ensure serializer hashes on create
        if not check_password(password, user.password):
            return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = generate_tokens_for_user(user)

        response = Response({
            "message": "Login successful",
            "access": tokens['access']
        }, status=status.HTTP_200_OK)

        # Set refresh token as HttpOnly cookie (works for browsers). For local dev secure=False.
        response.set_cookie(
            key='refresh_token',
            value=tokens['refresh'],
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Strict',
            max_age=int(REFRESH_TOKEN_LIFETIME.total_seconds())
        )

        return response


# -------------------------
# Profile
# -------------------------
from .authentication import CustomJWTAuthentication  # import here to avoid circular imports

class UserProfileView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# -------------------------
# Refresh Token (cookie or JSON body)
# -------------------------
class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Prefer cookie
        refresh_token = request.COOKIES.get('refresh_token')
        # fallback to JSON body for Postman ease
        if not refresh_token:
            refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({"error": "Refresh token missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response({"error": "Refresh token expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

        if payload.get('token_type') != 'refresh':
            return Response({"error": "Token provided is not a refresh token"}, status=status.HTTP_400_BAD_REQUEST)

        user_id = payload.get('user_id')
        try:
            user = UserModel.objects.get(id=user_id)
        except UserModel.DoesNotExist:
            return Response({"detail": "User not found", "code": "user_not_found"}, status=status.HTTP_401_UNAUTHORIZED)

        # Issue a new access token (do not rotate refresh here; rotation would require storing/blacklisting)
        now = datetime.utcnow()
        access_payload = {
            'user_id': user.id,
            'exp': now + ACCESS_TOKEN_LIFETIME,
            'iat': now,
            'token_type': 'access'
        }
        access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm='HS256')
        if isinstance(access_token, bytes):
            access_token = access_token.decode('utf-8')

        return Response({"access": access_token}, status=status.HTTP_200_OK)


# -------------------------
# Logout
# -------------------------
class UserLogoutView(APIView):
    # If you want to restrict logout to authenticated users uncomment:
    # authentication_classes = [CustomJWTAuthentication]
    # permission_classes = [IsAuthenticated]

    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie('refresh_token')
        return response
