from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='sign up'),
    path('login/', views.signin, name='log in'),
    path('logout/', views.signout, name='log out'),
]