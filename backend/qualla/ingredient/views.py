from functools import partial
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from .models import Ingredient
from rest_framework.decorators import api_view
from .serializers import IngredientListSerializer, IngredientDetailSerializer, IngredientRecommendSerializer
from cocktail.models import Cocktail


@api_view(['GET'])
def ingredient_list(request):
    if request.method == 'GET':
        ingredients = Ingredient.objects
        data = IngredientListSerializer(ingredients, many=True).data
        return JsonResponse({"Ingredients": data, "count": ingredients.count()}, safe=False)
    # else:
    #     return HttpResponseNotAllowed(['GET'])


@api_view(['GET'])
def retrieve_ingredient(request, pk):
    if request.method == 'GET':
        try:
            ingredient = Ingredient.objects.get(id=pk)
        except Ingredient.DoesNotExist:
            return HttpResponseNotFound(f"No Ingredients matches id={pk}")

        data = IngredientDetailSerializer(ingredient).data
        return JsonResponse(data, safe=False)

    # else:
    #     return HttpResponseNotAllowed(['GET'])


# 최대 추천 재료 수
num_recommend = 3


@api_view(['GET'])
def recommend_ingredient(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    user = request.user
    my_ingredients = [
        store_ingredient.ingredient.id for store_ingredient in user.store.all()]

    # 모든 칵테일에 대해 : 재료들 - 내 재료 값 = 1일 때, 그 재료 id set에 마킹 --> 마킹이 가장 많은 순서대로 최대 3개 리턴
    # key: ingredient id / value: [cocktails], (len(value) 기준으로 정렬)
    score_map = {}

    cocktail_all = Cocktail.objects.all()
    for cocktail in cocktail_all:
        ingredient_prepare = [
            str(ingredient_prepare.ingredient.id) for ingredient_prepare in cocktail.ingredient_prepare.all()]

        needed_ingredient = list(set(ingredient_prepare) - set(my_ingredients))
        if len(needed_ingredient) == 1:
            if needed_ingredient[0] not in score_map:
                score_map[needed_ingredient[0]] = [cocktail]
            else:
                score_map[needed_ingredient[0]].append(cocktail)

    score_map_sorted = sorted(
        score_map.items(), key=lambda item: len(item[1]), reverse=True)

    recommended_ingredient_list = [{"ingredient": marked_ingredient[0], "cocktails":marked_ingredient[1]}
                                   for marked_ingredient in score_map_sorted[:num_recommend]]

    ingredients = Ingredient.objects.filter(
        id__in=[x['ingredient'] for x in recommended_ingredient_list])

    data = IngredientListSerializer(ingredients, many=True).data
    breakpoint()
    return JsonResponse({"Ingredients": data, "count": ingredients.count()}, safe=False)
