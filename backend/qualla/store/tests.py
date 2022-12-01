from django.test import TestCase
from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from .models import User
from ingredient_prepare.models import IngredientPrepare
from ingredient.models import Ingredient
from tag.models import CocktailTag, Tag
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
import json

# Create your tests here.

class StoreTestCase(TestCase):

    def setUp(self):
        login_user = User.objects.create_user(username="login", password="login")
        user = authenticate(username="login", password="login")
        token = Token.objects.create(user=login_user)
        ingredient = Ingredient(id=1, name="1", image='img', ABV=0, price=0)
        ingredient.save()
        ingredient = Ingredient(id=2, name="2", image='img', ABV=0, price=0)
        ingredient.save()

    def test_user_store(self):
        client = Client()
        #Not Auth case
        response = client.get('/api/v1/store/')
        self.assertEqual(response.status_code, 401)
        #Auth case
        #valide login
        response = client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)
        #get ingredients
        response = client.get('/api/v1/store/')
        self.assertEqual(response.status_code, 200)
        #post my ingredients correct
        response = client.post('/api/v1/store/',json.dumps({'ingredients': [1]}),
                                content_type='application/json')
        self.assertEqual(response.status_code,201)
        #post my ingredients not exist
        response = client.post('/api/v1/store/',json.dumps({'ingredients': [4]}),
                                content_type='application/json')
        self.assertEqual(response.status_code,404)
        #post my ingredients duplciated
        response = client.post('/api/v1/store/',json.dumps({'ingredients': [1]}),
                                content_type='application/json')
        self.assertEqual(response.status_code,400)

    def test_modify_user_store(self):
        client = Client()
        #Not Auth case
        response = client.delete('/api/v1/store/13/')
        self.assertEqual(response.status_code, 401)
        #Auth case
        #valide login
        response = client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)
        #post my ingredients correct
        response = client.post('/api/v1/store/',json.dumps({'ingredients': [1]}),
                                content_type='application/json')
        self.assertEqual(response.status_code,201)
        #delete not exist
        response = client.delete('/api/v1/store/12/')
        self.assertEqual(response.status_code,404)
        #delete correct
        response = client.delete('/api/v1/store/1/')
        self.assertEqual(response.status_code,200)