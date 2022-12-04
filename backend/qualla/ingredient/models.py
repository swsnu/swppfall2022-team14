from django.db import models


class Ingredient(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)
    name_eng = models.CharField(max_length=50, null=True, unique=True)
    image = models.CharField(max_length=500, null=False)
    ABV = models.FloatField(null=True)
    price = models.FloatField(null=False)  # Can this be null?
    introduction = models.CharField(max_length=500, null=False)
    unit = models.CharField(max_length=50, null=False, default='oz|ml')
    color = models.CharField(max_length=6, null=True)  # FFFFFF

    def __str__(self):
        return self.name

    def unit_list(self):
        return self.unit.split('|')
