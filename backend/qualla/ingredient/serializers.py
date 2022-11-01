from rest_framework import serializers
from ingredient.models import Ingredient


class IngredientListSerializer(serializers.ModelSerializer):
    rate = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Ingredient
        fields = (
            "id",
            "name",
            "image",
            "abv"
        )


class IngredientDetailSerializer(IngredientListSerializer):
    class Meta(IngredientListSerializer.Meta):
        fields = IngredientListSerializer.Meta.fields + ("introduction",)
