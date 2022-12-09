from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from .models import Ingredient
from cocktail.models import Cocktail
from store.models import Store
from ingredient_prepare.models import IngredientPrepare
import json
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from user.models import User


class IngredientTestCase(TestCase):
    def setUp(self):
        login_user = User.objects.create_user(
            username="login", password="login")
        token = Token.objects.create(user=login_user)

        self.client = APIClient()
        self.client.login(username='login', password='login')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        cocktail = Cocktail(
            id=1, ABV=0.0, price_per_glass=0.0, type='ST', name="1")
        cocktail.save()
        cocktail = Cocktail(
            id=2, ABV=0.0, price_per_glass=0.0, type='ST', name="2")
        cocktail.save()
        ingredient2 = Ingredient(
            id=2, name="2", image='img', ABV=0, price=0)
        ingredient2.save()
        ingredient5 = Ingredient(
            id=5, name="5", image='img', ABV=0, price=0)
        ingredient5.save()
        ingredient6 = Ingredient(
            id=6, name="6", image='img', ABV=0, price=0)
        ingredient6.save()
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient2, amount=1, unit="oz")
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient6, amount=1, unit="oz")
        ingredient_prepare.save()

    def test_get_lists(self):

        ingredient = Ingredient(id=1, name="asdf",
                                image='img', ABV=0, price=0)
        ingredient.save()
        response = self.client.get(f'/api/v1/ingredients/')
        self.assertEqual(response.status_code, 200)

    def test_retrieve_ingredient(self):

        ingredient = Ingredient(id=1, name="asdf",
                                image='img', ABV=0, price=0)
        ingredient.save()
        response = self.client.get(f'/api/v1/ingredients/1/')
        self.assertEqual(response.status_code, 200)
        response = self.client.get(f'/api/v1/ingredients/1232/')
        self.assertEqual(response.status_code, 404)

    def test_recommend(self):

        response = self.client.post('/api/v1/store/', json.dumps({'ingredients': [2, 5]}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = self.client.get('/api/v1/ingredients/recommend/')
        self.assertEqual(response.status_code, 200)
