from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from .models import Cocktail
from ingredient_prepare.models import IngredientPrepare
from ingredient.models import Ingredient
from tag.models import CocktailTag, Tag
import json
from .serializers import CocktailListSerializer


class CocktailTestCase(TestCase):

    def test_get_lists(self):
        client = Client()

        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        ingredient = Ingredient(id=2, price=0)
        ingredient.save()
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient)
        ingredient_prepare.save()

        for text in ['text', '']:
            for type in ['standard', 'custom', 'inv']:
                for type1 in ['_CL', '_TP', 'inv']:
                    for type2 in ['LONG', 'SHORT', 'SHOT', 'inv']:
                        for type3 in ['weak', 'medium', 'strong', 'extreme', 'inv']:
                            response = client.get(
                                f'/api/v1/cocktails/?type={type}&filter_type_one={type1}&filter_type_two={type2}&filter_type_three={type3}&text={text}')
                            if ('inv' in [text, type, type1, type2, type3]):
                                self.assertEqual(response.status_code, 400)
                            else:
                                self.assertEqual(response.status_code, 200)

        response = client.get(
            f'/api/v1/cocktails/?ingredients[]=2')
        self.assertEqual(response.status_code, 400)
        response = client.get(
            f'/api/v1/cocktails/?ingredients[]=1&ingredients[]=4')
        self.assertEqual(response.status_code, 400)

    def test_post_item(self):
        client = Client()
        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        ingredient = Ingredient(id=2, price=0)
        ingredient.save()
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient)
        ingredient_prepare.save()
        tag = Tag(id=1, content='test2')
        cocktail_tag = CocktailTag(cocktail=cocktail, tag=tag)
        cocktail_post_data = json.dumps({"name": "0",
                                         "image": "img",
                                         "introduction": "intro",
                                         "recipe": "rec",
                                         "ABV": 1,
                                         "price_per_glass": 1,
                                         "author_id": 1,
                                         "type": "CS"})

        cocktail_post_data_tag = json.dumps({'name': '1', 'image': 'img', 'introduction': 's', 'recipe': 'ss', 'ABV': 20,
                                            'price_per_glass': 80000, 'tags': ['test1'], 'author_id': 1, 'ingredients': [], 'type': 'CS'})
        cocktail_post_data_ingredient = json.dumps({'name': '2', 'image': 'img', 'introduction': 's', 'recipe': 'ss', 'ABV': 20,
                                                    'price_per_glass': 80000, 'author_id': 1, 'ingredients': [{"id": 2}], 'type': 'CS'})
        cocktail_post_data_ingredient_not = json.dumps({'name': '3', 'image': 'img', 'introduction': 's', 'recipe': 'ss', 'ABV': 20,
                                                        'price_per_glass': 80000, 'author_id': 1, 'ingredients': [{"id": 10}], 'type': 'CS'})
        response = client.post(
            f'/api/v1/cocktails/', cocktail_post_data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = client.post(
            f'/api/v1/cocktails/', cocktail_post_data_tag, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = client.post(
            f'/api/v1/cocktails/', cocktail_post_data_ingredient, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = client.post(
            f'/api/v1/cocktails/', cocktail_post_data_ingredient_not, content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.delete(
            f'/api/v1/cocktails/', cocktail_post_data, content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_retrieve_cocktail(self):
        client = Client()
        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        ingredient = Ingredient(id=2, price=0)
        ingredient.save()
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient)
        ingredient_prepare.save()
        tag = Tag(id=1, content='test2')
        cocktail_tag = CocktailTag(cocktail=cocktail, tag=tag)

        response = client.get(
            f'/api/v1/cocktails/1/')
        self.assertEqual(response.status_code, 200)

        response = client.get(
            f'/api/v1/cocktails/2/')
        self.assertEqual(response.status_code, 404)

        cocktail_post_data = json.dumps({"name": "0",
                                         "image": "img",
                                         "introduction": "intro",
                                         "recipe": "rec",
                                         "ABV": 1,
                                         "price_per_glass": 1,
                                         "author_id": 1,
                                         "type": "CS"})

        cocktail_post_data_tag = json.dumps({'name': '1', 'image': 'img', 'introduction': 's', 'recipe': 'ss', 'ABV': 20,
                                            'price_per_glass': 80000, 'tags': ['test1'], 'author_id': 1, 'ingredients': [], 'type': 'CS'})
        response = client.put(
            f'/api/v1/cocktails/1/', cocktail_post_data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.put(
            f'/api/v1/cocktails/1/', cocktail_post_data_tag, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = client.put(
            f'/api/v1/cocktails/2/')
        self.assertEqual(response.status_code, 404)

        response = client.post(
            f'/api/v1/cocktails/2/')
        self.assertEqual(response.status_code, 405)

    def test_retrieve_my_cocktail(self):
        client = Client()
        response = client.get(
            f'/api/v1/cocktails/me/')
        self.assertEqual(response.status_code, 200)
