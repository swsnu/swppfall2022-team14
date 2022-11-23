from functools import partial
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from cocktail.models import Cocktail
from .serializers import IngredientPrepareSerializer
from django.db import IntegrityError
from .models import IngredientPrepare


@api_view(['GET', 'POST'])
def ingredient_list(request, cocktail_id):
    if request.method == 'GET':
        try:
            cocktail = Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktail matches id={cocktail_id}")

        ingredient_prepare = cocktail.ingredient_prepare.all()
        # id, name, image, ABV, price, amount
        return_data = [{"id": element.ingredient.id, "name": element.ingredient.name, "image": element.ingredient.image,
                       "ABV": element.ingredient.ABV, "price": element.ingredient.price, "amount": element.amount, "unit":element.ingredient.unit_list()}
                       for element in ingredient_prepare]

        return JsonResponse(return_data, safe=False)
    elif request.method == 'POST':
        try:
            cocktail = Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktail matches id={cocktail_id}")

        try:
            data = request.data.copy()
            # When edit/post custom cocktail
            # Request with ingredient_id
            data['cocktail'] = cocktail_id
            serializer = IngredientPrepareSerializer(
                data=data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()

        except (IntegrityError) as e:
            return HttpResponseBadRequest("Recipe Alread Exists")
        return JsonResponse(serializer.data, status=201)
    # else:
    #     return HttpResponseNotAllowed(['GET', 'POST'])


@api_view(['PUT', 'DELETE'])
def ingredient_prepare_modify(request, cocktail_id, ingredient_id):
    if request.method == 'PUT':
        try:
            # need constraint check
            ingredient_prepare = IngredientPrepare.objects.get(
                cocktail_id=cocktail_id, ingredient_id=ingredient_id)
        except IngredientPrepare.DoesNotExist:
            return HttpResponseNotFound(f"No recipe matches cocktail_id {cocktail_id}, ingredient_id {ingredient_id}")

        serializer = IngredientPrepareSerializer(
            ingredient_prepare, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data, status=200)
    elif request.method == 'DELETE':
        try:
            # need constraint check
            ingredient_prepare = IngredientPrepare.objects.get(
                cocktail_id=cocktail_id, ingredient_id=ingredient_id)
        except IngredientPrepare.DoesNotExist:
            return HttpResponseNotFound(f"No recipe matches cocktail_id {cocktail_id}, ingredient_id {ingredient_id}")

        ingredient_prepare.delete()
        return HttpResponse(status=200)
    # else:
    #     return HttpResponseNotAllowed(['PUT', 'DELETE'])
