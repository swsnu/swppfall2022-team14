from functools import partial
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from cocktail.models import Cocktail
from .serializers import IngredientPrepareSerializer
from django.db import IntegrityError
from .models import IngredientPrepare
from rest_framework import viewsets

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = IngredientPrepare.objects.all()
    serializer_class = IngredientPrepareSerializer

    def list(self, request, cocktail_id):
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

    def create(self, request, cocktail_id):
        try:
            Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktail matches id={cocktail_id}")

        try:
            data = request.data.copy()
            # When edit/post custom cocktail
            # Request with ingredient_id
            data['cocktail'] = cocktail_id
            serializer = self.serializer_class(
                data=data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()

        except (IntegrityError) as e:
            return HttpResponseBadRequest("Recipe Alread Exists")
        return JsonResponse(serializer.data, status=201)

    def partial_update(self, request, cocktail_id, ingredient_id):
        try:
            # need constraint check
            ingredient_prepare = self.queryset.get(
                cocktail_id=cocktail_id, ingredient_id=ingredient_id)
        except IngredientPrepare.DoesNotExist:
            return HttpResponseNotFound(f"No recipe matches cocktail_id {cocktail_id}, ingredient_id {ingredient_id}")

        serializer = self.serializer_class(
            ingredient_prepare, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

    def destroy(self, request, cocktail_id, ingredient_id):
        try:
            # need constraint check
            ingredient_prepare = self.queryset.get(
                cocktail_id=cocktail_id, ingredient_id=ingredient_id)
        except IngredientPrepare.DoesNotExist:
            return HttpResponseNotFound(f"No recipe matches cocktail_id {cocktail_id}, ingredient_id {ingredient_id}")

        ingredient_prepare.delete()
        return HttpResponse(status=200)