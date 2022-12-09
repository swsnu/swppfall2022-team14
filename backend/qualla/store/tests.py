from django.test import TestCase
from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from .models import User, Store
from ingredient_prepare.models import IngredientPrepare
from ingredient.models import Ingredient
from tag.models import CocktailTag, Tag
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
import json
from rest_framework.test import APIClient
# Create your tests here.

class StoreTestCase(TestCase):

    def setUp(self):
        login_user = User.objects.create_user(
            username="login", password="login")
        self.token = Token.objects.create(user=login_user)

        self.client = APIClient()
        self.client.login(username='login', password='login')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        ingredient = Ingredient(id=1, name="1", image='img', ABV=0, price=0)
        ingredient.save()
        ingredient = Ingredient(id=2, name="2", image='img', ABV=0, price=0)
        ingredient.save()
        store = Store(user = login_user, ingredient = ingredient)
        store.save()

    def test_user_store(self):
      
        response = self.client.get('/api/v1/store/')
        self.assertEqual(response.status_code, 200)
        #post my ingredients correctly
        response = self.client.post('/api/v1/store/',json.dumps({'ingredients': [1]}),
                                content_type='application/json')
        self.assertEqual(response.status_code,201)
        #post my ingredients do not exist
        response = self.client.post('/api/v1/store/',json.dumps({'ingredients': [4]}),
                                content_type='application/json')
        self.assertEqual(response.status_code,404)
        #post my ingredients duplciated
        response = self.client.post('/api/v1/store/',json.dumps({'ingredients': [1]}),
                                content_type='application/json')
        self.assertEqual(response.status_code,400)
       

    def test_modify_user_store(self):
        
        #delete not exist
        response = self.client.delete('/api/v1/store/12/')
        self.assertEqual(response.status_code,404)
        #delete correct
        response = self.client.delete('/api/v1/store/2/')
        self.assertEqual(response.status_code,200)