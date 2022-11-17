from django.urls import path
from . import views
from .views import IngredientViewSet

ingredient_list = IngredientViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

ingredient_detail = IngredientViewSet.as_view({
    'put': 'partial_update',
    'delete' : 'destroy'
})


urlpatterns = [
    path('<int:cocktail_id>/ingredients/', ingredient_list,
         name='need ingredient list'),
    path('<int:cocktail_id>/ingredients/<int:ingredient_id>/',
         ingredient_detail, name='cocktail ingredient modify')
]
