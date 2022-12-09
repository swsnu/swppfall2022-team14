from functools import partial
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from .models import Ingredient
from rest_framework.decorators import api_view
from .serializers import IngredientListSerializer, IngredientDetailSerializer, IngredientRecommendSerializer
from cocktail.models import Cocktail
from django.db.models import Q
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import permissions, authentication


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
num_recommend = 5


@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def recommend_ingredient(request):

    user = request.user
    my_ingredients = [
        store_ingredient.ingredient.id for store_ingredient in user.store.all()]

    # 모든 칵테일에 대해 : n( {칵테일의 재료들} - {내 재료} ) = 1일 때, 그 재료 id set에 마킹 --> 마킹이 가장 많은 순서대로 최대 3개 리턴
    # score_map: dictionary,    key: ingredient id / value: [cocktails], (len(value) 기준으로 정렬)
    score_map = {}

    cocktail_all = Cocktail.objects.all()

    for cocktail in cocktail_all:
        ingredient_prepare = [
            ingredient_prepare.ingredient.id for ingredient_prepare in cocktail.ingredient_prepare.all()]

        needed_ingredient = list(set(ingredient_prepare) - set(my_ingredients))

        if len(needed_ingredient) == 1:
            if needed_ingredient[0] not in score_map:
                score_map[needed_ingredient[0]] = [cocktail]
            else:
                score_map[needed_ingredient[0]].append(cocktail)

    # 만들 수 있는 칵테일이 많아지는 재료들 top k개 id

    score_map_sorted = sorted(
        score_map.items(), key=lambda item: len(item[1]), reverse=True)
    recommended_ingredient_list = [{"ingredient_id": marked_ingredient[0], "cocktails":[{"name": cocktail.name, "id": cocktail.id, "type": cocktail.type} for cocktail in marked_ingredient[1]]}
                                   for marked_ingredient in score_map_sorted[:num_recommend]]

    recommend_ids = [x['ingredient_id']
                     for x in recommended_ingredient_list]

    ingredients = Ingredient.objects.filter(
        id__in=recommend_ids)

    # 만약 위에서 구한 id 개수 k개 이하일 때 --> 남은 재료들은 칵테일들에 많이 들어가는 && 나한테 없는 재료들로 추천
    if len(recommended_ingredient_list) < num_recommend:
        num_ingredients_to_prepare = num_recommend - \
            len(recommended_ingredient_list)
        # 위에서 구한 재료 | 갖고 있는 재료들을 제외하고 len(ingredient_prepare) 큰 순서로 추출
        ingredient_all = Ingredient.objects.filter(
            ~Q(id__in=recommend_ids+my_ingredients))
        sorted_ingredients_by_prepares_ids = [x.id for x in sorted(
            ingredient_all, key=lambda x: len(x.ingredient_prepare.all()), reverse=True)[:num_ingredients_to_prepare]]

        general_recommended_ingredients = Ingredient.objects.filter(
            id__in=sorted_ingredients_by_prepares_ids)

        ingredients = ingredients | general_recommended_ingredients

        recommended_ingredient_list = recommended_ingredient_list + \
            num_ingredients_to_prepare*[None]
    data = IngredientListSerializer(ingredients, many=True).data
    return JsonResponse({"Ingredients": data, "possible_cocktails": recommended_ingredient_list, "count": ingredients.count()}, safe=False)
