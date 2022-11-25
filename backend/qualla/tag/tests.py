from http import client
from urllib import response
from django.test import TestCase, Client
from .models import Tag, CocktailTag
from cocktail.models import Cocktail
from ingredient.models import Ingredient
import json


class TagTestCase(TestCase):

    def test_cocktails_by_tag(self):
        client = Client()

        cocktail = Cocktail(id=1, name="name", image='img',
                            ABV=0, price_per_glass=0, type='ST')
        cocktail.save()
        tag = Tag(id=1, content='test1')
        tag.save()
        cocktail_tag = CocktailTag(cocktail=cocktail, tag=tag)
        cocktail_tag.save()

        response = client.get(
            f'/api/v1/tag/?tag=test1')
        self.assertEqual(response.status_code, 200)
        response = client.get(
            f'/api/v1/tag/?tag=test2')
        self.assertEqual(response.status_code, 200)
