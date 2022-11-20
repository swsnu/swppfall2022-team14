from dataclasses import field
from email.policy import default
from django.forms import models
from rest_framework import serializers
from bookmark.models import Bookmark
from cocktail.models import Cocktail
import random


class CocktailListSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Cocktail
        fields = (
            "id",
            "name",
            "image",
            "rate",
            "tags",
            "type",
            "author_id",
            "is_bookmarked",
        )

    def get_tags(self, obj):
        return [t.tag.content for t in obj.tags.all()]
    
    def get_is_bookmarked(self, obj):
        try:
            user = self.context['user']
            if user.is_authenticated:
                try:
                    Bookmark.objects.get(user=user.id, cocktail=obj.id)
                except Bookmark.DoesNotExist:
                    return False
                return True
            return False
        except KeyError:
            return False

class CocktailDetailSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Cocktail
        fields = (
            "id",
            "name",
            "image",
            "introduction",
            "recipe",
            "ABV",
            "price_per_glass",
            "rate",
            "tags",
            "type",
            'author_id',
            'created_at',
            'updated_at',
            "is_bookmarked",
        )

    def get_tags(self, obj):
        return [t.tag.content for t in obj.tags.all()]
    
    def get_is_bookmarked(self, obj):
        try:
            user = self.context['user']
            if user.is_authenticated:
                try:
                    Bookmark.objects.get(user=user.id, cocktail=obj.id)
                except Bookmark.DoesNotExist:
                    return False
                return True
            return False
        except KeyError:
            return False

class CocktailPostSerializer(serializers.ModelSerializer):
    image = serializers.CharField(max_length=500, default="default_img.png")
    ABV = serializers.FloatField(default=random.uniform(10.0, 50.0))
    price_per_glass = serializers.FloatField(
        default=random.randint(10, 100)*1000)

    class Meta:
        model = Cocktail
        fields = (
            "name",
            "image",
            "introduction",
            "recipe",
            "ABV",
            "price_per_glass",
            "author_id",
            "type"
        )


class CocktailUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cocktail
        fields = (
            "name",
            "introduction",
            "recipe"
        )
