from django import views
from django.urls import path
from . import views

urlpatterns = [
    path('ping/', views.ping, name='ping test'),

]
