from django.urls import path
from . import views

urlpatterns = [
    path('<int:user_id>', views.get_user, name='get user'),
    path('signup/', views.signup, name='sign up'),
    path('login/', views.signin, name='log in'),
    path('logout/', views.signout, name='log out'),
    path('me/', views.retrieve_my_info, name='retrieve my info'),
    path('token/', views.token, name='token'),
]