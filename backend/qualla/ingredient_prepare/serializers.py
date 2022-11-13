from rest_framework import serializers
from ingredient.models import Ingredient
from .models import IngredientPrepare
from django.db import models
from django.core.validators import RegexValidator


class IngredientPrepareSerializer(serializers.ModelSerializer):

    class Meta:
        model = IngredientPrepare
        fields = (
            "id",
            "cocktail",
            "ingredient",
            "amount"
        )


# class IngredientDetailSerializer(IngredientListSerializer):
#     class Meta(IngredientListSerializer.Meta):
#         fields = IngredientListSerializer.Meta.fields + ("introduction",)
