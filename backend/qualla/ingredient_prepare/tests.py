from http import client
from urllib import response
from django.test import TestCase, Client
from .models import IngredientPrepare
from cocktail.models import Cocktail
from ingredient.models import Ingredient
import json


class CommentTestCase(TestCase):

    def test_lists(self):
        client = Client()

        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        ingredient = Ingredient(id=2, price=0, name="name1")
        ingredient.save()
        ingredient2 = Ingredient(id=3, price=0, name="name2")
        ingredient2.save()
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient)
        ingredient_prepare.save()
        post_data = json.dumps({
            "ingredient": 3,
            "amount": "1 oz"})
        response = client.get(
            f'/api/v1/cocktails/1/ingredients/')
        self.assertEqual(response.status_code, 200)

        response = client.get(
            f'/api/v1/cocktails/2/ingredients/')
        self.assertEqual(response.status_code, 404)

        response = client.post(
            f'/api/v1/cocktails/2/ingredients/', post_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.post(
            f'/api/v1/cocktails/1/ingredients/', post_data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = client.post(
            f'/api/v1/cocktails/1/ingredients/', post_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_ingredient_prepare_modify(self):

        client = Client()

        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        ingredient = Ingredient(id=2, price=0, name="name1")
        ingredient.save()
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient)
        ingredient_prepare.save()
        post_data = json.dumps({
            "ingredient": 2,
            "amount": "1 oz"})

        response = client.put(
            f'/api/v1/cocktails/1/ingredients/2/', post_data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.put(
            f'/api/v1/cocktails/1/ingredients/3/', post_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.delete(
            f'/api/v1/cocktails/1/ingredients/2/')
        self.assertEqual(response.status_code, 200)

        response = client.delete(
            f'/api/v1/cocktails/1/ingredients/3/')
        self.assertEqual(response.status_code, 404)
