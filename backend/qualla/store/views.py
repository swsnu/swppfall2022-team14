from django.shortcuts import render
from functools import partial
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from user.models import User
from ingredient.models import Ingredient
from store.models import Store
from .serializers import StoreSerializer
from django.db import IntegrityError
from json import JSONDecodeError

# Create your views here.

@api_view(['GET', 'POST'])
def user_store(request, user_id):
    if request.method == 'GET':
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return HttpResponseNotFound(f"No User matches id={user_id}")

        store_ingredients = user.store.all()
        # id, name, image, ABV, price
        return_data = [{"id": element.ingredient.id, "name": element.ingredient.name, "image": element.ingredient.image,
                       "ABV": element.ingredient.ABV, "price": element.ingredient.price}
                       for element in store_ingredients]

        return JsonResponse(return_data, safe=False)
    elif request.method == 'POST':
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return HttpResponseNotFound(f"No User matches id={user_id}")


        ingredient_id_list = request.data.copy()['ingredients']
        return_data_list = []
        
        for i in ingredient_id_list:
            try:
                ingredient = Ingredient.objects.get(id=i)
            except Ingredient.DoesNotExist:
                return HttpResponseNotFound("Ingredient does not exist in Add List")
            try:
                Store.objects.create(user=user, ingredient=ingredient)
            except IntegrityError:
                continue

            return_data_list.append(ingredient)

        return_data = [{"id": element.id, "name": element.name, "image": element.image,
                       "ABV": element.ABV, "price": element.price}
                       for element in return_data_list]

        return JsonResponse(return_data,safe=False,status=201)