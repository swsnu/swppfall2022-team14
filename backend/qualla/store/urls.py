from django import views
from django.urls import path
from . import views

urlpatterns = [
    path('<int:user_id>/', views.user_store, name='user ingredient'),
    path('<int:user_id>/<int:ingredient_id>/',
         views.modify_user_store, name='modify user ingredient'),
]
