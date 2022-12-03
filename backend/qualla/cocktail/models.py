from django.db import models
from django.db.models import CheckConstraint, Q
from django.core.validators import RegexValidator


class Cocktail(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)
    image = models.CharField(max_length=500, null=False)
    name_eng = models.CharField(max_length=50, null=True, unique=True)
    introduction = models.CharField(max_length=500, null=False)
    recipe = models.CharField(max_length=1000, null=False)
    ABV = models.FloatField(null=False)
    price_per_glass = models.FloatField(null=False)
    color = models.CharField(max_length=6, null=True)  # FFFFFF

    class CocktailType(models.TextChoices):
        STADARD = 'ST', ('Standard Cocktail')
        CUSTOM = 'CS', ('Custom Cocktail')

    # REGEX Example : _type1_type2_type3
    filter_type_REGEX = RegexValidator(r'(_[a-z|A-Z|ㄱ-ㅎ|가-힣|0-9]+)*')

    filter_type_one = models.CharField(
        max_length=50, null=True, validators=[filter_type_REGEX])
    filter_type_two = models.CharField(
        max_length=50, null=True, validators=[filter_type_REGEX])
    type = models.CharField(max_length=2, choices=CocktailType.choices)
    author_id = models.IntegerField(null=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    rate = models.FloatField(default=0.0, null=False)

    class Meta:
        constraints = [
            CheckConstraint(
                check=(Q(type__startswith='CS', author_id__isnull=False)
                       | Q(type__startswith='ST')),
                name='custom cocktail should have author'
            )
        ]

    def __str__(self):
        return "{} ({})".format(self.name, self.id)
