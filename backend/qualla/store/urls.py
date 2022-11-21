from django import views
from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_store, name='user ingredient'),
    path('<int:ingredient_id>/',
         views.modify_user_store, name='modify user ingredient'),
]
