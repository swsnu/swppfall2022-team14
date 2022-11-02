from django.urls import path
from . import views

urlpatterns = [
    path('<int:cocktail_id>/ingredients/', views.ingredient_list,
         name='need ingredient list')
]
