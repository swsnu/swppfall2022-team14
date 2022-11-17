from django.urls import path
from . import views
from .views import CommentViewSet

comment_list = CommentViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

comment_detail = CommentViewSet.as_view({
    'get': 'retrieve',
    'put': 'partial_update',
    'delete' : 'destroy'
})

retrieve_my_comment = CommentViewSet.as_view({
    'get': 'retrieve_my_comment'
})

urlpatterns = [
    path('cocktails/<int:cocktail_id>/',
         comment_list, name='comment list'),
    path('<int:pk>/', comment_detail, name='comment'),
    path('me/', retrieve_my_comment, name='my comment')
]
