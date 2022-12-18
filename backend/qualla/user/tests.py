from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from django.test.client import RequestFactory
from .models import User
from .serializers import UserInfoSerializer
from ingredient_prepare.models import IngredientPrepare
from ingredient.models import Ingredient
from tag.models import CocktailTag, Tag
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.test import force_authenticate
from django.contrib.auth import authenticate, login, logout
import json
from rest_framework.test import APIClient


# Create your tests here.

class UserTestCase(TestCase):

    def setUp(self):
        login_user = User.objects.create_user(
            username="login", password="login")
        self.token = Token.objects.create(user=login_user)

        self.client = APIClient()
        self.client.login(username='login', password='login')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.client_not_login = Client()

    def test_signup(self):

        # sign up
        response = self.client.post('/api/v1/auth/signup/', json.dumps({'username': 't1', 'password': 't1'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # if username exists

        response = self.client.post('/api/v1/auth/signup/', json.dumps({'username': 'login', 'password': 'login'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signin(self):

        # sign in
        response = self.client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        # if user does not exists
        response = self.client.post('/api/v1/auth/login/', json.dumps({'username': 'test', 'password': 'test'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_signout(self):

        # sign out
        response = self.client.post('/api/v1/auth/logout/',
                                    {})
        self.assertEqual(response.status_code, 200)

        # when logged out
        response = self.client_not_login.post('/api/v1/auth/logout/', {})
        self.assertEqual(response.status_code, 401)

    def test_retrieve_my_info_get(self):

        # get info
        response = self.client.get('/api/v1/auth/me/')
        self.assertEqual(response.status_code, 200)

        # when logged out
        self.client.logout()
        response = self.client.get('/api/v1/auth/me/')
        self.assertEqual(response.status_code, 401)

    def test_retrieve_my_info_put(self):

        # put_info
        response = self.client.put('/api/v1/auth/me/', json.dumps({'nickname': 'n_', 'password': 'login_','org_password':'login_', 'intro': 'intro', 'profile_img': 'img'}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # when logged out
        self.client.logout()
        response = self.client.put('/api/v1/auth/me/', json.dumps({'nickname': 'n_', 'password': 'login_', 'intro': 'intro', 'profile_img': 'img'}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_retrieve_my_info_delete(self):

        # delete_info
        response = self.client.delete('/api/v1/auth/me/')
        self.assertEqual(response.status_code, 200)

        # when logged out
        self.client.logout()
        response = self.client.delete('/api/v1/auth/me/')
        self.assertEqual(response.status_code, 401)

    def test_get_user(self):
        user = User.objects.get(username="login")
        response = self.client.get(f"/api/v1/auth/{user.id}/")
        self.assertEqual(response.status_code, 200)

        # user does not exist
        response = self.client.get(f"/api/v1/auth/3/")
        self.assertEqual(response.status_code, 404)

    def test_token(self):
        response = self.client.get(f"/api/v1/auth/token/")
        self.assertEqual(response.status_code, 204)

