from django import views
from django.urls import path
from . import views

urlpatterns = [
    path('', views.cocktail_list, name='cocktail list'),
    path('post/', views.cocktail_post, name='cocktail post'),
    path('<int:pk>/', views.retrieve_cocktail, name='retrieve cocktail'),
    path('<int:pk>/edit/', views.cocktail_edit, name='cocktail edit'),
    path('<int:pk>/rate/', views.cocktail_rate_edit, name='cocktail rate edit'),
    path('me/', views.retrieve_my_cocktail, name='retrieve my cocktails')
]
