from http import client
from urllib import response
from django.test import TestCase, Client
from .models import IngredientPrepare
from cocktail.models import Cocktail
from ingredient.models import Ingredient
import json
from rest_framework.test import APIClient
from user.models import User
from rest_framework.authtoken.models import Token


class Ingredient_PrepareTestCase(TestCase):

    def setUp(self):
        login_user = User.objects.create_user(
            username="login", password="login")
        token = Token.objects.create(user=login_user)

        self.client = APIClient()
        self.client.login(username='login', password='login')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        ingredient = Ingredient(id=1, price=0, name="name1")
        ingredient.save()
        ingredient2 = Ingredient(id=2, price=0, name="name2")
        ingredient2.save()
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient, amount=1, unit="oz")
        ingredient_prepare.save()

    def test_ingredient_lists(self):
        existing_ingredient = json.dumps(
            {"ingredient": 2, "amount": 1, "unit": "oz"})
        prepared_ingredient = json.dumps(
            {"ingredient": 1, "amount": 1, "unit": "oz"})

        # TESTING GET
        # for 1. Vaild, 2. not existing cocktail cases
        response = self.client.get('/api/v1/cocktails/1/ingredients/')
        self.assertEqual(response.status_code, 200)
        # get_list to not exist cocktail
        response = self.client.get('/api/v1/cocktails/2/ingredients/')
        self.assertEqual(response.status_code, 404)

        # TESTING POST
        # for 1. Vaild, 2. not existing cocktail 3. already existing recipe cases
        response = self.client.post(
            '/api/v1/cocktails/1/ingredients/', existing_ingredient, content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = self.client.post(
            '/api/v1/cocktails/2/ingredients/', existing_ingredient, content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = self.client.post(
            '/api/v1/cocktails/1/ingredients/', prepared_ingredient, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_ingredient_prepare_modify(self):

        existing_ingredient = json.dumps(
            {"ingredient": 1, "amount": 1, "unit": "oz"})

        response = self.client.put(
            '/api/v1/cocktails/1/ingredients/1/', existing_ingredient, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = self.client.put(
            '/api/v1/cocktails/1/ingredients/3/', existing_ingredient, content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = self.client.delete(
            '/api/v1/cocktails/1/ingredients/1/')
        self.assertEqual(response.status_code, 200)

        response = self.client.delete(
            '/api/v1/cocktails/1/ingredients/3/')
        self.assertEqual(response.status_code, 404)
