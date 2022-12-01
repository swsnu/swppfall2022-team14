from django.test import TestCase
from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from .models import User
from ingredient_prepare.models import IngredientPrepare
from ingredient.models import Ingredient
from tag.models import CocktailTag, Tag
from cocktail.models import Cocktail
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
import json

# Create your tests here.
 
class BookmarkTestCase(TestCase):
    def setUp(self):
        login_user = User.objects.create_user(username="login", password="login")
        user = authenticate(username="login", password="login")
        token = Token.objects.create(user=login_user)
        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()

    def test_bookmarked_cocktails_by_user(self):
        client = Client()
        #not valid
        response = client.get('/api/v1/bookmark/me/')
        self.assertEqual(response.status_code, 401)

        #valid login
        response = client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)

        user = authenticate(username='login', password='password')
        token = Token.objects.get(user__username='login')
        #get bookmark
        response = client.get('/api/v1/bookmark/me/',headers={'Authorization': 'Token ' + token.key})
        self.assertEqual(response.status_code, 200)

    def test_toggle_bookmark(self):
        client = Client()
        #not valid
        response = client.put('/api/v1/bookmark/cocktails/1/')
        self.assertEqual(response.status_code, 401)

        #valid login
        response = client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)

        #bookmark no exist cocktail
        response = client.put('/api/v1/bookmark/cocktails/123/')
        self.assertEqual(response.status_code, 404)

        #bookmark exist cocktail
        response = client.put('/api/v1/bookmark/cocktails/1/')
        #self.assertEqual(response.status_code, 200)
        #bookkmark delete
        response = client.put('/api/v1/bookmark/cocktails/1/')