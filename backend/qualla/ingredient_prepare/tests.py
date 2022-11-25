from http import client
from urllib import response
from django.test import TestCase, Client
from .models import IngredientPrepare
from cocktail.models import Cocktail
from ingredient.models import Ingredient
import json


class Ingredient_PrepareTestCase(TestCase):

    def setUp(self):
        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        ingredient = Ingredient(id=1, price=0, name="name1")
        ingredient.save()
        ingredient2 = Ingredient(id=2, price=0, name="name2")
        ingredient2.save()
        ingredient_prepare = IngredientPrepare(cocktail=cocktail, ingredient=ingredient, amount="1 oz")
        ingredient_prepare.save()


    def test_ingredient_lists(self):
        client = Client()
        post_data = json.dumps({"ingredient": 2, "amount": "1 oz"})
        post_error = json.dumps({"ingredient": 2, "amount": "1oz"})
        #get_list
        response = client.get('/api/v1/cocktails/1/ingredients/')
        self.assertEqual(response.status_code, 200)
        #get_list not exist cocktail
        response = client.get('/api/v1/cocktails/2/ingredients/')
        self.assertEqual(response.status_code, 404)


        #post unit validation error
        response = client.post(
            f'/api/v1/cocktails/1/ingredients/', post_error, content_type='application/json')
        self.assertEqual(response.status_code, 400)


        #post not exist cocktail
        response = client.post(
            f'/api/v1/cocktails/2/ingredients/', post_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)
    
        #post correct ingredient
        response = client.post(
            f'/api/v1/cocktails/1/ingredients/', post_data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        #post exist ingredient
        response = client.post(
            f'/api/v1/cocktails/1/ingredients/', post_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_ingredient_prepare_modify(self):

        client = Client()
        post_data = json.dumps({"ingredient": 2, "amount": "1 oz"})

        response = client.put(
            f'/api/v1/cocktails/1/ingredients/1/', post_data, content_type='application/json')
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
