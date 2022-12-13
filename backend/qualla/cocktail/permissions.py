# config/permissions.py

from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission, SAFE_METHODS

class AvailableCocktailPermission(BasePermission):
    # 작성자만 접근
    def has_object_permission(self, request, view, obj):
        if request.query_params.get("available_only", None) == 'true':
            if request.user.is_authenticated:
                return True
            else:
                return False
        else:
            return True