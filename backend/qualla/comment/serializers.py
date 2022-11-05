from dataclasses import field
from email.policy import default
from django.forms import models
from rest_framework import serializers
from .models import Comment
from cocktail.models import Cocktail
from cocktail.serializers import CocktailDetailSerializer
from django.db import models


class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = (
            "id",
            "cocktail",
            "author_id",
            "parent_comment",
            "content",
            "created_at",
            "updated_at",
            "is_deleted"
        )


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
