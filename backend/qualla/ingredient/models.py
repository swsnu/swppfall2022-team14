from django.db import models


class Ingredient(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)
    image = models.CharField(max_length=500, null=False)
    ABV = models.FloatField(null=True)
    price = models.FloatField(null=False)
    introduction = models.CharField(max_length=500, null=False)
