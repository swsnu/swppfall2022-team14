from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from .models import Cocktail
from ingredient_prepare.models import IngredientPrepare
from ingredient.models import Ingredient
from tag.models import CocktailTag, Tag
from rate.models import Rate
import json
from .serializers import CocktailListSerializer
from user.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient


class CocktailTestCase(TestCase):

    def setUp(self):

        login_user = User.objects.create_user(
            username="login", password="login")
        token = Token.objects.create(user=login_user)

        self.client = APIClient()
        self.client.login(username='login', password='login')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        cocktail = Cocktail(
            id=2, ABV=0.0, price_per_glass=0.0, type='ST', name="2")
        cocktail.save()
        cocktail = Cocktail(
            id=3, ABV=0.0, price_per_glass=0.0, type='ST', name="3")
        cocktail.save()
        cocktail = Cocktail(
            id=4, ABV=0.0, price_per_glass=0.0, type='ST', name="4")
        cocktail.save()
        ingredient = Ingredient(id=1, price=0, name="name1")
        ingredient.save()
        ingredient3 = Ingredient(id=3, price=0, name="name3")
        ingredient3.save()
        ingredient4 = Ingredient(id=4, price=0, name="name4")
        ingredient4.save()
        ingredient5 = Ingredient(id=5, price=0, name="name5")
        ingredient5.save()
        ingredient6 = Ingredient(id=6, price=0, name="name6")
        ingredient6.save()
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient, amount=1, unit="oz")
        ingredient_prepare.save()

    def test_get_lists(self):
        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        ingredient = Ingredient(id=2, price=0)
        ingredient.save()
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient, amount=1, unit="oz")
        ingredient_prepare.save()

        ############ test case ############
        for name_param in ['text', '']:
            for type in ['standard', 'custom', 'inv']:
                for type1 in ['CL', 'TP', 'inv']:
                    for type2 in ['LONG', 'SHORT', 'SHOT', 'inv']:
                        for type3 in ['weak', 'medium', 'strong', 'extreme', 'inv']:
                            response = self.client.get(f"/api/v1/cocktails/?type={type}", {"type_one[]": [
                                type1], "type_two[]": [type2], "type_three[]": [type3], "available_only": "true", "name_param": name_param}, HTTP_ACCEPT='application/json')

                            response = self.client.get(f"/api/v1/cocktails/?type={type}", {"type_one": [
                                type1], "type_two": [type2], "type_three": [type3]}, HTTP_ACCEPT='application/json')

                            if ('inv' not in [name_param, type, type1, type2, type3]):
                                self.assertEqual(response.status_code, 400)
                            else:
                                self.assertEqual(response.status_code, 400)
        response = self.client.get(
            f'/api/v1/cocktails/?ingredients[]=2')
        self.assertEqual(response.status_code, 400)
        response = self.client.get(
            f'/api/v1/cocktails/?ingredients[]=1&ingredients[]=4')
        self.assertEqual(response.status_code, 400)

    def test_post_item(self):
        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        ingredient = Ingredient(id=2, price=0)
        ingredient.save()
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient, amount=1, unit="oz")
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

        # valid login
        response = self.client.post('/api/v1/auth/login/', json.dumps({'username': 'login', 'password': 'login'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = self.client.post(
            '/api/v1/cocktails/post/', cocktail_post_data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = self.client.post(
            '/api/v1/cocktails/post/', cocktail_post_data_tag, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = self.client.post(
            '/api/v1/cocktails/post/', cocktail_post_data_ingredient, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.client.post(
            '/api/v1/cocktails/post/', cocktail_post_data_ingredient_not, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = self.client.delete(
            '/api/v1/cocktails/post/', cocktail_post_data, content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_retrieve_cocktail(self):
        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        ingredient = Ingredient(id=2, price=0)
        ingredient.save()
        ingredient_prepare = IngredientPrepare(
            cocktail=cocktail, ingredient=ingredient, amount=1, unit="oz")
        ingredient_prepare.save()
        tag = Tag(id=1, content='test2')
        cocktail_tag = CocktailTag(cocktail=cocktail, tag=tag)

        response = self.client.get(
            '/api/v1/cocktails/1/')
        self.assertEqual(response.status_code, 200)

        response = self.client.get(
            '/api/v1/cocktails/2/')
        self.assertEqual(response.status_code, 200)

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
        response = self.client.put(
            '/api/v1/cocktails/1/', cocktail_post_data, content_type='application/json')
        self.assertEqual(response.status_code, 405)
        response = self.client.put(
            '/api/v1/cocktails/1/', cocktail_post_data_tag, content_type='application/json')
        self.assertEqual(response.status_code, 405)

        response = self.client.put(
            '/api/v1/cocktails/2/')
        self.assertEqual(response.status_code, 405)

        response = self.client.post(
            '/api/v1/cocktails/2/')
        self.assertEqual(response.status_code, 405)

    def test_cocktail_edit(self):
        cocktail_post_data = json.dumps({"name": "0",
                                         "image": "img",
                                         "introduction": "intro",
                                         "recipe": "rec",
                                         "ABV": 1,
                                         "price_per_glass": 1,
                                         "author_id": 1,
                                         "type": "CS",
                                         "ingredients": [{"id": 1, "amount": 1, "unit": "oz"}]})

        # VALID
        response = self.client.put('/api/v1/cocktails/2/edit/',
                                   cocktail_post_data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # COCKTAIL NOT EXISTING

        response = self.client.put('/api/v1/cocktails/0/edit/',
                                   cocktail_post_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_retrieve_my_cocktail(self):

        # VALID
        response = self.client.get('/api/v1/cocktails/me/')
        self.assertEqual(response.status_code, 200)

    def test_cocktail_rate_edit(self):
        cocktail = Cocktail.objects.get(id=2)
        user = User.objects.get(username="login")
        rate = Rate(id=1, cocktail=cocktail, user=user, score=0)
        rate.save()

        response = self.client.put("/api/v1/cocktails/2/rate/",)
        self.assertEqual(response.status_code, 200)

        response = self.client.put("/api/v1/cocktails/1/rate/")
        self.assertEqual(response.status_code, 404)
