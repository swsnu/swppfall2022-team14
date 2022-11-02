from functools import partial
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
from rest_framework.decorators import api_view
from cocktail.models import Cocktail
from .serializers import IngredientPrepareSerializer
from django.db import IntegrityError


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
                       "ABV": element.ingredient.ABV, "price": element.ingredient.price, "amount": element.amount}
                       for element in ingredient_prepare]

        return JsonResponse(return_data, safe=False)
    elif request.method == 'POST':
        try:
            cocktail = Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktail matches id={cocktail_id}")

        try:
            data = request.data.copy()
            # TODO: change fields that is derived automatically
            data['cocktail'] = cocktail_id
            serializer = IngredientPrepareSerializer(
                data=data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except (IntegrityError) as e:
            return HttpResponseBadRequest()
        return JsonResponse(serializer.data, status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])
