from http import client
from pydoc import cli
from django.test import TestCase, Client
from .models import Cocktail

from comment.models import Comment
from user.models import User
import json
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from datetime import datetime


class CommentTestCase(TestCase):

    def setUp(self):
        login_user = User.objects.create_user(
            username="login", password="login")
        token = Token.objects.create(user=login_user)

        self.client = APIClient()
        self.client.login(username='login', password='login')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        cocktail = Cocktail(id=1, name="1", ABV=0.0,
                            price_per_glass=0.0, type='ST')
        cocktail.save()

        comment = Comment(id=1, author_id=1,

                          cocktail=cocktail, content='content', is_deleted=False, parent_comment=None)
        comment.save()
        comment_child = Comment(id=3, author_id=1,
                                cocktail=cocktail, content='content', parent_comment=comment)
        comment_child.save()

    def test_get_lists(self):

        response = self.client.get(
            '/api/v1/comment/cocktails/1/')
        self.assertEqual(response.status_code, 200)
        response = self.client.get(
            '/api/v1/comment/cocktails/2/')
        self.assertEqual(response.status_code, 404)

    def test_post_lists(self):
        comment_data = json.dumps({"id": 2, "content": "content"})
        response = self.client.post(
            '/api/v1/comment/cocktails/1/post/', comment_data, content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_my_comment(self):
        response = self.client.get(
            '/api/v1/comment/me/')
        self.assertEqual(response.status_code, 200)
