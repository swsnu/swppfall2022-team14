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
        )
    
    def get_rate(self, obj):
        # aggregate avg of rating
        return random.uniform(0.0, 5.0)

    def get_tags(self, obj):
        return ["this", "is", "so", "delicious"]