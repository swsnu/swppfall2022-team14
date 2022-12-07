from django.urls import path
from . import views

urlpatterns = [
    path('cocktails/<int:cocktail_id>/',
         views.comment_list, name='comment list'),
    path('cocktails/<int:cocktail_id>/post/', views.comment_post, name='comment post'),
    path('<int:pk>/', views.retrieve_comment, name='comment'),
    path('<int:pk>/edit/', views.edit_comment, name='comment'),
    path('<int:pk>/delete/', views.delete_comment, name='comment'),
    path('me/', views.retrieve_my_comment, name='my comment')
]
