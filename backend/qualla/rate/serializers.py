from rest_framework import serializers
from .models import Rate
from cocktail.serializers import CocktailListSerializer


class RateSerializer(serializers.ModelSerializer):
    cocktail = CocktailListSerializer(read_only=True)

    class Meta:
        model = Rate
        fields = (
            "id",
            "cocktail",
            "user",
            "score",
        )