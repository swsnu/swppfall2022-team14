from django.urls import path
from . import views

urlpatterns = [
    path('cocktails/<int:cocktail_id>/',
         views.comment_list, name='comment list'),
    path('<int:pk>/', views.retrieve_comment, name='comment'),
    path('me/', views.retrieve_my_comment, name='my comment')
]
