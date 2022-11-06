from django.urls import path
from . import views

urlpatterns = [
    path('', views.cocktails_by_tag, name='get cocktail list by tag')
]
