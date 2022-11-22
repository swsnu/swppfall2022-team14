from django.urls import path
from . import views

urlpatterns = [
    path('', views.ingredient_list, name='ingredient list'),
    path('<int:pk>/', views.retrieve_ingredient, name='retrieve ingredient'),
    path('recommend/', views.recommend_ingredient,
         name='ingredient recommendation'),
]
