from rest_framework import serializers
from ingredient.models import Ingredient
from .models import Store
from django.db import models
from django.core.validators import RegexValidator


class StoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Store
        fields = (
            "id",
            "user",
            "ingredient",
        )
