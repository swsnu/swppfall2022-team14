from django import views
from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.bookmarked_cocktails_by_user, name='retrieve my bookmarked cocktails'),
    path('cocktails/<int:cocktail_id>/', views.toggle_bookmark, name='retrieve my bookmarked cocktails'),
]
