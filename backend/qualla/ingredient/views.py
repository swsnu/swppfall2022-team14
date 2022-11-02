from functools import partial
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
from .models import Ingredient
from rest_framework.decorators import api_view
from .serializers import IngredientListSerializer, IngredientDetailSerializer


@api_view(['GET'])
def ingredient_list(request):
    if request.method == 'GET':
        ingredients = Ingredient.objects
        data = IngredientListSerializer(ingredients, many=True).data
        return JsonResponse({"Ingredients": data, "count": ingredients.count()}, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])


@api_view(['GET'])
def retrieve_ingredient(request, pk):
    if request.method == 'GET':
        try:
            ingredient = Ingredient.objects.get(id=pk)
        except Ingredient.DoesNotExist:
            return HttpResponseNotFound(f"No Ingredients matches id={pk}")

        data = IngredientDetailSerializer(ingredient).data
        return JsonResponse(data, safe=False)

    else:
        return HttpResponseNotAllowed(['GET'])
