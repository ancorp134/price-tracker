# trackerapi/authentication.py
import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import UserModel
from datetime import datetime

class CustomJWTAuthentication(authentication.BaseAuthentication):
    """
    Authenticate requests using a JWT in the Authorization header:
    Authorization: Bearer <access_token>
    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None  # no credentials, continue to other auth classes or fail with IsAuthenticated

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            raise exceptions.AuthenticationFailed('Invalid Authorization header. Use: Bearer <token>')

        token = parts[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Access token has expired.')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token.')

        # token should include 'user_id' and 'token_type'
        if payload.get('token_type') != 'access':
            raise exceptions.AuthenticationFailed('Invalid token type.')

        user_id = payload.get('user_id')
        if not user_id:
            raise exceptions.AuthenticationFailed('Token contained no user identification.')

        try:
            user = UserModel.objects.get(id=user_id)
            user.is_authenticated = True
        except UserModel.DoesNotExist:
            raise exceptions.AuthenticationFailed('User not found.')

        return (user, None)
