from django.db import models
from django.db.models import CheckConstraint, Q


class Cocktail(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)
    image = models.CharField(max_length=500, null=False)
    introduction = models.CharField(max_length=500, null=False)
    recipe = models.CharField(max_length=1000, null=False)
    ABV = models.FloatField(null=False)
    price_per_glass = models.FloatField(null=False)

    class CocktailType(models.TextChoices):
        STADARD = 'ST', ('Standard Cocktail')
        CUSTOM = 'CS', ('Custom Cocktail')

    type = models.CharField(max_length=2, choices=CocktailType.choices)
    author_id = models.IntegerField(null=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            CheckConstraint(
                check=(Q(type__startswith='CS', author_id__isnull=False)
                       | Q(type__startswith='ST')),
                name='custom cocktail should have author'
            )
        ]
