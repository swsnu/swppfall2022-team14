from django.db import models
from django.core.validators import RegexValidator

from cocktail.models import Cocktail
from ingredient.models import Ingredient
from user.models import User


class Store(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='store', null=False
    )
    ingredient = models.ForeignKey(
        Ingredient, on_delete=models.PROTECT, related_name='store', null=False
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user','ingredient'], name='unique_user_ingredient_combination'
            )
        ]
