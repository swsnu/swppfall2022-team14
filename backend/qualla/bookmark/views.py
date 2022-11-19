from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from bookmark.models import Bookmark
from cocktail.models import Cocktail
from cocktail.serializers import CocktailListSerializer
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

@api_view(['GET'])
def bookmarked_cocktails_by_user(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    user = request.user.id
    try:
        cocktails = [bookmark.cocktail for bookmark in Bookmark.objects.filter(user=user)]
    except Bookmark.DoesNotExist:
        cocktails = []

    data = CocktailListSerializer(cocktails, many=True).data
    return JsonResponse({"cocktails": data, "count": len(cocktails)}, safe=False)

@api_view(['PUT'])
def toggle_bookmark(request, cocktail_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    user = request.user
    try:
        Bookmark.objects.get(cocktail=cocktail_id, user=user).delete()
        return HttpResponse(status=200)
    except Bookmark.DoesNotExist:
        cocktail = Cocktail.objects.get(id=cocktail_id)
        Bookmark.objects.create(cocktail=cocktail, user=user)
        return HttpResponse(status=201)