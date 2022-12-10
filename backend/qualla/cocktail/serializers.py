from dataclasses import field
from email.policy import default
from django.forms import models
from rest_framework import serializers
from bookmark.models import Bookmark
from rate.models import Rate
from cocktail.models import Cocktail
import random


class CocktailListSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()

    class Meta:
        model = Cocktail
        fields = (
            "id",
            "name",
            "name_eng",
            "image",
            "rate",
            "tags",
            "type",
            "author_id",
            "is_bookmarked",
            "score",
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

    def get_score(self, obj):
        try:
            user = self.context['user']
            if user.is_authenticated:
                try:
                    score = Rate.objects.get(
                        user=user.id, cocktail=obj.id).score
                except Rate.DoesNotExist:
                    return 0
                return score
            return 0
        except KeyError:
            return 0


class CocktailDetailSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()

    class Meta:
        model = Cocktail
        fields = (
            "id",
            "name",
            "name_eng",
            "color",
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
            "score",
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

    def get_score(self, obj):
        try:
            user = self.context['user']
            if user.is_authenticated:
                try:
                    score = Rate.objects.get(
                        user=user.id, cocktail=obj.id).score
                except Rate.DoesNotExist:
                    return 0
                return score
            return 0
        except KeyError:
            return 0


class CocktailPostSerializer(serializers.ModelSerializer):
    image = serializers.CharField(max_length=500, default="default_img.png")
    # name_eng = serializers.CharField(max_length=50, default=None)
    # ABV = serializers.FloatField(default=random.uniform(10.0, 50.0))
    # price_per_glass = serializers.FloatField(
    #     default=random.randint(10, 100)*1000)

    class Meta:
        model = Cocktail
        fields = (
            "name",
            "name_eng",
            "color",
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
