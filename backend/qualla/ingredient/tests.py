from http import client
from pydoc import cli
from urllib import response
from django.test import TestCase, Client
from .models import Ingredient
import json


class CommentTestCase(TestCase):

    def test_get_lists(self):
        client = Client()

        ingredient = Ingredient(id=1, name="asdf", image='img', ABV=0, price=0)
        ingredient.save()
        response = client.get(
            f'/api/v1/ingredients/')
        self.assertEqual(response.status_code, 200)

    def test_retrieve_ingredient(self):
        client = Client()

        ingredient = Ingredient(id=1, name="asdf", image='img', ABV=0, price=0)
        ingredient.save()
        response = client.get(
            f'/api/v1/ingredients/1/')
        self.assertEqual(response.status_code, 200)
        response = client.get(
            f'/api/v1/ingredients/2/')
        self.assertEqual(response.status_code, 404)
        print(ingredient.__str__())
