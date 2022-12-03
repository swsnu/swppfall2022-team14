from django.db import models
from django.core.validators import RegexValidator
from django.forms import ValidationError

from cocktail.models import Cocktail
from ingredient.models import Ingredient


class IngredientPrepare(models.Model):
    cocktail = models.ForeignKey(
        Cocktail, on_delete=models.CASCADE, related_name='ingredient_prepare', null=False)
    ingredient = models.ForeignKey(
        Ingredient, on_delete=models.PROTECT, related_name='ingredient_prepare', null=False)

    amount = models.FloatField(null=False)
    unit = models.CharField(max_length=50, null=False, default='oz|ml')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['cocktail', 'ingredient'], name='unique_cocktail_ingredient_combination'
            )
        ]

    def clean(self):
        if not self.amount in self.ingredient.unit_list():
            raise ValidationError(('Ingredient Unit Error'))

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)
