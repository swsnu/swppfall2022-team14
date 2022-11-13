from django import views
from django.urls import path
from . import views

urlpatterns = [
    path('', views.cocktail_list, name='cocktail list'),
    path('<int:pk>/', views.retrieve_cocktail, name='retrieve cocktail'),
    path('me/', views.retrieve_my_cocktail, name='retrieve my cocktails')
]
