"""
URL configuration for tracker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from trackerapi.views import UserLoginView,UserLogoutView,UserProfileView,UserRegisterView,RefreshTokenView,TrackProductView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/login/',UserLoginView.as_view()),
    path('api/v1/logout/',UserLogoutView.as_view()),
    path('api/v1/register/',UserRegisterView.as_view()),
    # path('api/v1/user/<str:id>/update/',UserProfileUpdateView.as_view()),
    # path('api/featured-products/', GetFeaturedProducts.as_view(), name='featured-products'),
    path('api/v1/me/',UserProfileView.as_view()),
    # path("test-broadcast/", test_broadcast),
    path('api/v1/token/refresh/',RefreshTokenView.as_view()),
    # path('api/v1/test/',Testapi.as_view()),
    path('api/v1/track-product/',TrackProductView.as_view()),
    
]
