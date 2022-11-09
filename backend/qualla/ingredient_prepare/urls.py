from django.urls import path
from . import views

urlpatterns = [
    path('<int:cocktail_id>/ingredients/', views.ingredient_list,
         name='need ingredient list'),
    path('<int:cocktail_id>/ingredients/<int:ingredient_id>/',
         views.ingredient_prepare_modify, name='cocktail ingredient modify')
]
