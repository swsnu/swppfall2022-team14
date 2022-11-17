from django import views
from django.urls import path
from .views import CocktailViewSet

cocktail_list = CocktailViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

cocktail_detail = CocktailViewSet.as_view({
    'get': 'retrieve',
    'put': 'partial_update',
})

retrieve_my_cocktail = CocktailViewSet.as_view({
    'get': 'retrieve_my_cocktail'
})
urlpatterns = [
    path('', cocktail_list, name='cocktail list'),
    path('<int:pk>/', cocktail_detail, name='retrieve cocktail'),
    path('me/', retrieve_my_cocktail, name='retrieve my cocktails')
]
