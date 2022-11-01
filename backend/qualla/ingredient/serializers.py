from rest_framework import serializers
from ingredient.models import Ingredient


class IngredientListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = (
            "id",
            "name",
            "image",
            "ABV"
        )


class IngredientDetailSerializer(IngredientListSerializer):
    class Meta(IngredientListSerializer.Meta):
        fields = IngredientListSerializer.Meta.fields + ("introduction",)
