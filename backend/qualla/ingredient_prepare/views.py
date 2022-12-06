from functools import partial
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from cocktail.models import Cocktail
from .serializers import IngredientPrepareSerializer
from django.db import IntegrityError
from .models import IngredientPrepare
from django.forms import ValidationError


@api_view(['GET', 'POST'])
def ingredient_list(request, cocktail_id):
    if request.method == 'GET':
        try:
            cocktail = Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktail matches id={cocktail_id}")

        ingredient_prepare = cocktail.ingredient_prepare.all()
        # id, name, image, ABV, price, amount

        return_data = [{"id": element.ingredient.id, "name": element.ingredient.name, "name_eng": element.ingredient.name_eng, "image": element.ingredient.image, "color": element.ingredient.color, "price": element.ingredient.price,
                       "ABV": element.ingredient.ABV, "unit": element.ingredient.unit_list(), "amount": element.amount, "recipe_unit": element.unit}
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

        except (ValidationError) as e:
            return HttpResponseBadRequest("Validation Error")
        except (IntegrityError) as e:
            return HttpResponseBadRequest("Recipe Alread Exists")
        return JsonResponse(serializer.data, status=201)


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
