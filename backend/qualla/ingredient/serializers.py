from rest_framework import serializers
from ingredient.models import Ingredient


class IngredientListSerializer(serializers.ModelSerializer):
    unit = serializers.SerializerMethodField()
    class Meta:
        model = Ingredient
        fields = (
            "id",
            "name",
            "image",
            "ABV",
            "price",
            "unit"
        )

    def get_unit(self, obj):
        return obj.unit_list()

class IngredientDetailSerializer(IngredientListSerializer):
    class Meta(IngredientListSerializer.Meta):
        fields = IngredientListSerializer.Meta.fields + ("introduction",)


class IngredientRecommendSerializer(IngredientListSerializer):
    class Meta(IngredientListSerializer.Meta):
        fields = IngredientListSerializer.Meta.fields + ("cocktails",)
