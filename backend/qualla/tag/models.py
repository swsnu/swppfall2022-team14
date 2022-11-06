from django.db import models
from cocktail.models import Cocktail

class Tag(models.Model):
    content = models.CharField(max_length=50, null=False, unique=True)

class CocktailTag(models.Model):
    cocktail = models.ForeignKey(Cocktail, on_delete=models.CASCADE, related_name="tags")
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name="cocktails")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["cocktail","tag"],
                name="unique_tags_on_same_cocktail",
            ),
        ]