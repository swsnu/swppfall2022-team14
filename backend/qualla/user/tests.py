from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from .models import User
from .serializers import UserInfoSerializer
from ingredient_prepare.models import IngredientPrepare
from ingredient.models import Ingredient
from tag.models import CocktailTag, Tag
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
import json


# Create your tests here.

class UserTestCase(TestCase):

    def setUp(self):
        login_user = User.objects.create_user(username="login", password="login")
        user = authenticate(username="login", password="login")
        token = Token.objects.create(user=login_user)

    def test_signup(self):
        client = Client()
        #sign up
        response = client.post('/api/v1/auth/signup/', json.dumps({'username': 't1', 'password': 't1'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)
        #exist case
        response = client.post('/api/v1/auth/signup/', json.dumps({'username': 'login', 'password': 'login'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signin(self):
        client = Client()
        #sign in
        response = client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)
        #not exist user
        response = client.post('/api/v1/auth/login/', json.dumps({'username': 'test', 'password': 'test'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_signout(self):
        client = Client()
        #valid login
        response = client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)
        #sign out
        response = client.post('/api/v1/auth/logout/')
        self.assertEqual(response.status_code, 200)
        #not exist user
        response = client.post('/api/v1/auth/logout/', json.dumps({'username': 'test', 'password': 'test'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_retrieve_my_info_get(self):
        client = Client()
        #valid login
        response = client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)
        #get_info
        response = client.get('/api/v1/auth/me/')
        self.assertEqual(response.status_code, 200)
        #not exist user
        response = client.post('/api/v1/auth/logout/')
        response = client.get('/api/v1/auth/me/')
        self.assertEqual(response.status_code, 401)

    def test_retrieve_my_info_put(self):
        client = Client()
        #valid login
        response = client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)
        #put_info
        response = client.put('/api/v1/auth/me/', json.dumps({'nickname': 'n_', 'password': 'login_', 'intro': 'intro', 'profile_img': 'img'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)
        #not exist user
        response = client.post('/api/v1/auth/logout/')
        response = client.put('/api/v1/auth/me/',json.dumps({'nickname': 'n_', 'password': 'login_', 'intro': 'intro', 'profile_img': 'img'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_retrieve_my_info_delete(self):
        client = Client()
        #valid login
        response = client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)
        #delete_info
        response = client.delete('/api/v1/auth/me/')
        self.assertEqual(response.status_code, 200)
        #not exist user
        response = client.post('/api/v1/auth/logout/')
        response = client.delete('/api/v1/auth/me/')
        self.assertEqual(response.status_code, 401)

    def test_csrf(self):
        client = Client()
        #valid login
        response = client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                               content_type='application/json')
        response = client.get('/api/v1/auth/token/')
        csrftoken = response.cookies['csrftoken'].value
