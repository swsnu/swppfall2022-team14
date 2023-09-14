from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from bookmark.models import Bookmark
from cocktail.models import Cocktail
from cocktail.serializers import CocktailListSerializer, CocktailDetailSerializer
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import permissions, authentication


@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def bookmarked_cocktails_by_user(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    user = request.user.id
    user_bookmark = Bookmark.objects.filter(user=user)
    cocktails = [
        bookmark.cocktail for bookmark in user_bookmark]

    data = CocktailListSerializer(cocktails, many=True, context={
        'user': request.user}).data
    return JsonResponse({"cocktails": data, "count": len(cocktails)}, safe=False)



@api_view(['PUT'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def toggle_bookmark(request, cocktail_id):

    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    user = request.user

    try:
        cocktail = Cocktail.objects.get(id=cocktail_id)
    except Cocktail.DoesNotExist:
        return HttpResponse("Cocktail does not exist", status=404)
    try:
        Bookmark.objects.get(cocktail=cocktail_id, user=user).delete()
        return HttpResponse(status=200)
    except Bookmark.DoesNotExist:
        cocktail = Cocktail.objects.get(id=cocktail_id)
        Bookmark.objects.create(cocktail=cocktail, user=user)
        return HttpResponse(status=201)
