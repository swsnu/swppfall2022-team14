from dataclasses import field
from email.policy import default
from django.forms import models
from rest_framework import serializers
from .models import Comment
from cocktail.models import Cocktail
from cocktail.serializers import CocktailListSerializer
from user.models import User
from django.db import models


class CommentSerializer(serializers.ModelSerializer):
    cocktail = CocktailListSerializer(read_only=True)
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = (
            "id",
            "cocktail",
            "author_id",
            "author_name",
            "parent_comment",
            "content",
            "created_at",
            "updated_at",
            "is_deleted"
        )

    def get_author_name(self, obj):
        try:
            user = User.objects.get(id=obj.author_id)
        except User.DoesNotExist:
            return "abc"
        return user.username


class CommentPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = (
            "id",
            "cocktail",
            "author_id",
            "parent_comment",
            "content",
            "created_at",
            "updated_at"
        )