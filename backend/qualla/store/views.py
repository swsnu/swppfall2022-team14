from django.shortcuts import render
from functools import partial
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from user.models import User
from .serializers import StoreSerializer
from django.db import IntegrityError

# Create your views here.

@api_view(['GET', 'POST'])
def user_store(request, user_id):
    if request.method == 'GET':
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return HttpResponseNotFound(f"No User matches id={user_id}")

        store_ingredients = user.store.all()
        # id, name, image, ABV, price, amount
        return_data = [{"id": element.ingredient.id, "name": element.ingredient.name, "image": element.ingredient.image,
                       "ABV": element.ingredient.ABV, "price": element.ingredient.price}
                       for element in store_ingredients]

        return JsonResponse(return_data, safe=False)
    elif request.method == 'POST':
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktail matches id={user_id}")

        try:
            data = request.data.copy()
            # When edit/post custom cocktail
            # Request with ingredient_id
            data['user'] = user_id
            serializer = StoreSerializer(
                data=data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()

        except (IntegrityError) as e:
            return HttpResponseBadRequest("Ingredient Alread Exists")
        return JsonResponse(serializer.data, status=201)