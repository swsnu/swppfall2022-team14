from rest_framework import serializers
from .models import User


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "password",
            "nickname",
            "intro",
            "profile_img",
            "logged_in",
        )