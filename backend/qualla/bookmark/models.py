from django.db import models

from cocktail.models import Cocktail
from user.models import User

class Bookmark(models.Model):
    cocktail = models.ForeignKey(
        Cocktail, on_delete=models.CASCADE, related_name='bookmarks', null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks', null=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["cocktail", "user"],
                name="already bookmarked",
            ),
        ]