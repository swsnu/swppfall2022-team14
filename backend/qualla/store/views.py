from django.shortcuts import render
from functools import partial
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from user.models import User
from ingredient.models import Ingredient
from .models import Store
from django.db import IntegrityError
from json import JSONDecodeError
from ingredient.serializers import IngredientDetailSerializer
from .serializers import StoreSerializer

# Create your views here.


@api_view(['GET', 'POST'])
def user_store(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    user = request.user

    if request.method == 'GET':

        store_ingredients = user.store.all()
        # id, name, image, ABV, price
        my_ingredients = [
            store_ingredient.ingredient for store_ingredient in store_ingredients]
        data = IngredientDetailSerializer(my_ingredients, many=True).data

        return JsonResponse({"Ingredients": data, "count": len(my_ingredients)}, safe=False)
    elif request.method == 'POST':

        ingredient_id_list = request.data['ingredients']
        return_data_list = []

        _404_id_list = []
        _integrity_error_list = []
        for ingredient_id in ingredient_id_list:
            try:
                ingredient = Ingredient.objects.get(id=ingredient_id)
            except Ingredient.DoesNotExist:
                _404_id_list.append(ingredient_id)
                continue

            try:
                Store.objects.create(user=user, ingredient=ingredient)
            except IntegrityError:
                _integrity_error_list.append(ingredient_id)
                continue
            else:
                return_data_list.append(ingredient)

        if len(_404_id_list) != 0:
            return HttpResponseNotFound(f"No Ingredient(s) exist:{_404_id_list}")
        if len(_integrity_error_list) != 0:
            return HttpResponseBadRequest(f"Already have cocktails: {_integrity_error_list}")

        return_data = IngredientDetailSerializer(
            return_data_list, many=True).data
        return JsonResponse({"Ingredients": return_data, "count": len(return_data_list)}, safe=False, status=201)


@api_view(['DELETE'])
def modify_user_store(request, ingredient_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    user = request.user

    if request.method == 'DELETE':
        # need constraint check
        try:
            user_store = Store.objects.get(
                user=user, ingredient_id=ingredient_id)
        except Store.DoesNotExist:
            return HttpResponseNotFound(f"No user store info found for user id {user.id}, ingredient {ingredient_id}")

        deleted_data = StoreSerializer(
            user_store).data
        user_store.delete()
        return JsonResponse(deleted_data, status=200)
