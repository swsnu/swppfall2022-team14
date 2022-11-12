from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    nickname = models.CharField(max_length=50)
    intro = models.CharField(max_length=500)
    profile_img = models.CharField(max_length=500)
    logged_in = models.BooleanField(default=False)