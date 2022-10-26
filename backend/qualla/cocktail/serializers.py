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