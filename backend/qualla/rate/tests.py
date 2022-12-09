from django.test import TestCase
from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from .models import Rate
from ingredient_prepare.models import IngredientPrepare
from ingredient.models import Ingredient
from cocktail.models import Cocktail
from tag.models import CocktailTag, Tag
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
import json
from rest_framework.test import APIClient
from user.models import User
# Create your tests here.

class RateTestCase(TestCase):

    def setUp(self):
        login_user = User.objects.create_user(
            username="login", password="login")
        token = Token.objects.create(user=login_user)
        
        self.client = APIClient()
        self.client.login(username='login', password='login')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)


        login_user_2 = User.objects.create_user(
            username="login2", password="login2")
        token = Token.objects.create(user=login_user_2)
        self.client_norate = APIClient()
        self.client_norate.login(username='login2', password='login2')
        self.client_norate.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        
        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST', name="1")
        cocktail.save()
        cocktail2 = Cocktail(id=3, ABV=0.0, price_per_glass=0.0, type='ST', name="3")
        cocktail2.save()

        rate = Rate(id=1,cocktail=cocktail,user=login_user,score = 0)
        rate.save()
   



    def test_rate_list(self):
      
        response = self.client.get('/api/v1/rates/1/')
        self.assertEqual(response.status_code, 200)
        
        response = self.client.get('/api/v1/rates/2/')
        self.assertEqual(response.status_code, 404)

    def test_rate_list_user(self):

        response = self.client.get('/api/v1/rates/1/user/')
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/v1/rates/2/user/')
        self.assertEqual(response.status_code, 404)

        client_norate = APIClient()
        response = client_norate.get('/api/v1/rates/1/user/')
        self.assertEqual(response.status_code, 401)
    
    def test_rate_list_user_modify(self):

        # POST Case
        # Testing 1. Valid, 2. No Cocktail Exists 
        response = self.client.post('/api/v1/rates/3/user/',json.dumps({"score":0}),content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = self.client.post('/api/v1/rates/10/user/',json.dumps({"score":0}),content_type='application/json')
        self.assertEqual(response.status_code, 404)


        # PUT Case
        # Testing 1. Valid, 2. No Rate Exists, 3. No Cocktail Exists 

        response = self.client.put('/api/v1/rates/1/user/',json.dumps({"score":1}),content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = self.client_norate.put('/api/v1/rates/1/user/',json.dumps({"score":1}),content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = self.client.put('/api/v1/rates/10/user/',json.dumps({"score":1}),content_type='application/json')
        self.assertEqual(response.status_code, 404)

        
        

        # Delete Case
        # Testing 1. Valid, 2. No Rate Exists, 3. No Cocktail Exists 
        response = self.client.delete('/api/v1/rates/1/user/')
        self.assertEqual(response.status_code, 200)
        response = self.client_norate.delete('/api/v1/rates/1/user/')
        self.assertEqual(response.status_code, 404)

        response = self.client.delete('/api/v1/rates/10/user/')
        self.assertEqual(response.status_code, 404)