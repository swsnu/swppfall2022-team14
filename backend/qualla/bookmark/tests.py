from django.test import TestCase
from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from .models import Bookmark
from ingredient_prepare.models import IngredientPrepare
from ingredient.models import Ingredient
from tag.models import CocktailTag, Tag
from cocktail.models import Cocktail
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
import json
from user.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient


# Create your tests here.


class BookmarkTestCase(TestCase):
    def setUp(self):
        login_user = User.objects.create_user(
            username="login", password="login")
        token = Token.objects.create(user=login_user)

        self.client = APIClient()
        self.client.login(username='login', password='login')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        login_user_without_bookmark = User.objects.create_user(
            username="login2", password="login2")
        token = Token.objects.create(user=login_user_without_bookmark)

        self.client2 = APIClient()
        self.client2.login(username='login2', password='login2')
        self.client2.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        bookmark = Bookmark(id=1, cocktail=cocktail, user=login_user)
        bookmark.save()

    def test_bookmarked_cocktails_by_user(self):

        # VALID
        response = self.client.get('/api/v1/bookmark/me/')
        self.assertEqual(response.status_code, 200)

        # BOOKMARK NOT EXIST --> return empty list
        response = self.client2.get('/api/v1/bookmark/me/')
        self.assertEqual(response.status_code, 200)

    def test_toggle_bookmark(self):

        # VALID
        response = self.client.put('/api/v1/bookmark/cocktails/1/')
        self.assertEqual(response.status_code, 200)

        # NO COCKTAIL EXISTS
        response = self.client.put('/api/v1/bookmark/cocktails/123/')
        self.assertEqual(response.status_code, 404)

        # BOOKMARK NOT EXIST --> create new
        response = self.client2.put('/api/v1/bookmark/cocktails/1/')
        self.assertEqual(response.status_code, 201)
