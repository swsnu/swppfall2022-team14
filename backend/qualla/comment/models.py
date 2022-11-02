from django.db import models
from django.db.models import CheckConstraint, Q
from cocktail.models import Cocktail


class Comment(models.Model):

    # FKs
    cocktail = models.ForeignKey(
        Cocktail, on_delete=models.CASCADE, related_name='comments', null=False)
    author_id = models.IntegerField(null=False, default=None)
    parent_comment = models.ForeignKey(
        'self', on_delete=models.SET_NULL, related_name='replies', null=True)  # Set null when parent deleted

    content = models.CharField(max_length=500, null=False)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)
