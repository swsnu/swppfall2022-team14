from dataclasses import field
from email.policy import default
from django.forms import models
from rest_framework import serializers
from cocktail.models import Cocktail
import random

class CocktailListSerializer(serializers.ModelSerializer):
    rate = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    class Meta:
        model = Cocktail
        fields=(
            "id",
            "name",
            "image",
            "rate",
            "tags",
            "type",
        )
    
    def get_rate(self, obj):
        # aggregate avg of rating
        return random.uniform(0.0, 5.0)

    def get_tags(self, obj):
        return ["this", "is", "so", "delicious"]

class CustomCocktailListSerializer(CocktailListSerializer):
    class Meta(CocktailListSerializer.Meta):
        fields=CocktailListSerializer.Meta.fields + ('author_id',)

class CocktailDetailSerializer(serializers.ModelSerializer):
    rate = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Cocktail
        fields=(
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
        )

    def get_rate(self, obj):
        # aggregate avg of rating
        return random.uniform(0.0, 5.0)

    def get_tags(self, obj):
        return ["this", "is", "so", "delicious"]

class CustomCocktailDetailSerializer(CocktailDetailSerializer):
    class Meta(CocktailDetailSerializer.Meta):
        fields=CocktailDetailSerializer.Meta.fields + ('author_id', 'created_at', 'updated_at',)

class CocktailPostSerializer(serializers.ModelSerializer):
    image = serializers.CharField(max_length=500, default="default_img.png")
    ABV = serializers.FloatField(default=random.uniform(10.0, 50.0))
    price_per_glass = serializers.FloatField(default=random.randint(10, 100)*1000)

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