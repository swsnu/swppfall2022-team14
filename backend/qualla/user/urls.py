from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='sign up'),
    path('signin/', views.signin, name='sign in'),
]