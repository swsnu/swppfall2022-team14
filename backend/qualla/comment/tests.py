from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from .models import Cocktail
from ingredient_prepare.models import IngredientPrepare
from ingredient.models import Ingredient
from tag.models import CocktailTag, Tag
from comment.models import Comment
import json


class CommentTestCase(TestCase):

    def test_get_lists(self):
        client = Client()

        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        comment = Comment(id=1, author_id=1,
                          cocktail=cocktail, content='content')
        comment.save()
        comment_data = json.dumps({"id": 2,
                                   "content": "content",
                                   })
        response = client.get(
            f'/api/v1/comment/cocktails/1/')
        self.assertEqual(response.status_code, 200)
        response = client.get(
            f'/api/v1/comment/cocktails/2/')
        self.assertEqual(response.status_code, 404)

        response = client.post(
            f'/api/v1/comment/cocktails/1/', comment_data, content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_retrieve_comment(self):
        client = Client()
        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        comment = Comment(id=1, author_id=1,
                          cocktail=cocktail, content='content')
        comment.save()
        comment_child = Comment(id=3, author_id=1,
                                cocktail=cocktail, content='content', parent_comment=comment)
        comment_child.save()
        response = client.get(
            f'/api/v1/comment/1/')
        self.assertEqual(response.status_code, 200)

        response = client.get(
            f'/api/v1/comment/2/')
        self.assertEqual(response.status_code, 404)

        comment_data = json.dumps({"id": 2,
                                   "content": "content",
                                   })
        response = client.put(
            f'/api/v1/comment/1/', comment_data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.put(
            f'/api/v1/comment/2/', comment_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.delete(
            f'/api/v1/comment/1/')
        self.assertEqual(response.status_code, 200)

        response = client.delete(
            f'/api/v1/comment/2/')
        self.assertEqual(response.status_code, 404)

        response = client.delete(
            f'/api/v1/comment/3/')
        self.assertEqual(response.status_code, 200)

    def test_my_comment(self):
        client = Client()
        cocktail = Cocktail(id=1, ABV=0.0, price_per_glass=0.0, type='ST')
        cocktail.save()
        comment = Comment(id=1, author_id=1,
                          cocktail=cocktail, content='content')
        comment.save()
        response = client.get(
            f'/api/v1/comment/me/')
        self.assertEqual(response.status_code, 200)
