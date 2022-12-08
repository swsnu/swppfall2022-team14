from django.urls import path
from . import views

urlpatterns = [
    path('<int:cocktail_id>/', views.rate_list, name='rate list'),
    path('<int:cocktail_id>/user/', views.rate_list_user, name='rate list user'),
]