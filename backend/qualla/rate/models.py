from django.db import models
from cocktail.models import Cocktail
from user.models import User


class Rate(models.Model):
    cocktail = models.ForeignKey(Cocktail, on_delete=models.CASCADE, related_name='rate_set', null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rate_set', null=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['cocktail', 'user'], name='unique_cocktail_user_combination'
            )
        ]