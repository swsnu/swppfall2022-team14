from functools import partial
from json import JSONDecodeError
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from django.db import IntegrityError
from django.db.models import Q
from cocktail.permissions import AvailableCocktailPermission
from exception.errno import ErrorCode
from exception.exception_response import ExceptionResponse
from ingredient_prepare.models import IngredientPrepare
from ingredient.models import Ingredient
from tag.models import Tag, CocktailTag
from .models import Cocktail
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import permissions, authentication
from .serializers import CocktailDetailSerializer, CocktailListSerializer, CocktailPostSerializer
from .utils import color_similarity, order_queryset_by_id
from django.db.models import Case, When

# FILTER FUNCTIONS HERE


def process_text_param(request, filter_q):
    text = request.query_params.get("name_param", None)

    if (text is not None and text != ""):
        filter_q.add(Q(name__contains=text), Q.AND)


def process_get_list_params(request, filter_q):
    def get_ABV_range(request):
        if request == "weak":
            return (0, 15)
        elif request == "medium":
            return (15, 30)
        elif request == "strong":
            return (30, 40)
        elif request == "extreme":
            return (40, 100)
        else:
            raise ValueError("invalid ABV type")

    filter_type_one_list = request.query_params.getlist("type_one[]", None)
    filter_type_two_list = request.query_params.getlist("type_two[]", None)
    filter_type_ABV = request.query_params.getlist(
        "type_three[]", None)  # 도수

    try:
        assert (all([x in ['클래식', '트로피컬'] for x in filter_type_one_list]) and
                all([x in ['롱 드링크', '숏 드링크', '샷'] for x in filter_type_two_list])), "Invalid Filter Type"
    except AssertionError:
        raise AssertionError

    if filter_type_one_list is not None and len(filter_type_one_list) != 0:
        filter_q.add(Q(filter_type_one__in=filter_type_one_list), Q.AND)

    if filter_type_two_list is not None and len(filter_type_two_list) != 0:
        filter_q.add(Q(filter_type_two__in=filter_type_two_list), Q.AND)

    if len(filter_type_ABV) != 0:
        try:
            abv_range = get_ABV_range(filter_type_ABV[0])
        except (ValueError):
            raise ValueError
        filter_q.add(Q(ABV__range=(abv_range)), Q.AND)


# user - store 정보 활용하여 내가 만들 수 있는 칵테일 필터
def get_only_available_cocktails(request, filter_q):
    if not request.user.is_authenticated:
        raise AttributeError
    user = request.user
    store_ingredients = user.store.all()

    # 내 재료 id list
    my_ingredients = [
        store_ingredient.ingredient.id for store_ingredient in store_ingredients]

    cocktail_all = Cocktail.objects.all()
    available_cocktails_id = []

    for cocktail in cocktail_all:
        ingredient_prepare = [
            ingredient_prepare.ingredient.id for ingredient_prepare in cocktail.ingredient_prepare.all()]

        # 만약 해당 칵테일 재료가 내 재료의 subset이면
        if set(ingredient_prepare).issubset(set(my_ingredients)):
            available_cocktails_id.append(cocktail.id)

    # 매칭된 칵테일 없음 없음
    if (not available_cocktails_id):
        filter_q.add(Q(id__in=[-1]), Q.AND)
    else:
        filter_q.add(Q(id__in=available_cocktails_id), Q.AND)


@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([AvailableCocktailPermission])
def cocktail_list(request):
    if request.method == 'GET':

        filter_q = Q()

        # Add params Filter
        try:
            process_get_list_params(request, filter_q)
        except (ValueError, AssertionError) as e:
            return HttpResponseBadRequest('Invalid ABV or Filter Type', e)

        # Add ingredient filter : 나중에 재료만으로 검색 기능 추가시 활용.
        # get_cocktail_list_by_ingredient(request, filter_q)

        # Add text filter
        process_text_param(request, filter_q)

        if request.query_params.get("available_only", None) == 'true':
            try:
                get_only_available_cocktails(request, filter_q)
            except AttributeError:
                return HttpResponse(status=401)

        # Add Type Filter
        type = request.GET.get('type')
        if type == 'standard':
            filter_q.add(Q(type='ST'), Q.AND)
        elif type == 'custom':
            filter_q.add(Q(type='CS'), Q.AND)
        else:
            return HttpResponseBadRequest('Cocktail type is \'custom\' or \'standard\'')

        cocktails = Cocktail.objects.filter(filter_q)
        # calculate color similarity locally if needed
        filter_color = request.query_params.get("color")
        if filter_color is not None:

            color_sort_id = [cocktail.id for cocktail in sorted(cocktails, key=lambda cocktail: color_similarity(
                cocktail.color, filter_color))]

            cocktails = order_queryset_by_id(cocktails, color_sort_id)
        data = CocktailListSerializer(cocktails, many=True, context={
                                      'user': request.user}).data
        return JsonResponse({"cocktails": data, "count": cocktails.count()}, safe=False)


@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def cocktail_post(request):
    if request.method == 'POST':
        try:
            if request.user.is_authenticated:
                data = request.data.copy()

        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest("Unvalid Token")

        # TODO: change fields that is derived automatically
        #data['author_id'] = 1
        data['type'] = 'CS'
        print(data)

        serializer = CocktailPostSerializer(
            data=data, context={"request": request})
        print(serializer.initial_data["name_eng"])

        if not serializer.is_valid():
            err = serializer.errors
            # return first error
            first_err = next(iter(err))
            if first_err == 'name':
                if err['name'][0].code == 'blank':
                    return ExceptionResponse(status=400, detail="name_blank", code=ErrorCode.COCKTAIL_NAME_BLANK).to_response()
                elif err['name'][0].code == 'unique':
                    return ExceptionResponse(status=400, detail="name_not_unique", code=ErrorCode.COCKTAIL_NAME_ALREADY_EXIST).to_response()
            elif first_err == 'name_eng':
                return ExceptionResponse(status=400, detail="english_name_not_unique", code=ErrorCode.COCKTAIL_ENG_NAME_ALREADY_EXIST).to_response()
            elif first_err == 'color':
                return ExceptionResponse(status=400, detail="color_blank", code=ErrorCode.COCKTAIL_COLOR_BLANK).to_response()
            elif first_err == 'introduction':
                return ExceptionResponse(status=400, detail="intro_blank", code=ErrorCode.COCKTAIL_INTRO_BLANK).to_response()
            elif first_err == 'recipe':
                return ExceptionResponse(status=400, detail="recipe_blank", code=ErrorCode.COCKTAIL_RECIPE_BLANK).to_response()
        print(serializer.errors)
        cocktail = serializer.save()
        try:
            tags = data['tags']
        except (KeyError, JSONDecodeError) as e:
            tags = []
        for t in tags:
            try:
                tag = Tag.objects.get(content=t)
            except Tag.DoesNotExist:
                tag = Tag.objects.create(content=t)
            # try:
            #     CocktailTag.objects.create(tag=tag, cocktail=cocktail)
            CocktailTag.objects.create(tag=tag, cocktail=cocktail)
            # except IntegrityError:
            #     return HttpResponseBadRequest("tag must not be duplicated")

        try:
            ingredient_list = data['ingredients']
        except (KeyError, JSONDecodeError) as e:
            ingredient_list = []
        for ingredient in ingredient_list:
            try:
                _ingredient = Ingredient.objects.get(id=ingredient["id"])

            except Ingredient.DoesNotExist:
                return HttpResponseNotFound("ingredient does not exist")

            IngredientPrepare.objects.create(
                cocktail=cocktail, ingredient=_ingredient, amount=ingredient["amount"], unit=ingredient["unit"])

        return JsonResponse(CocktailDetailSerializer(cocktail, context={'user': request.user}).data, status=201)
    # else:
    #     return HttpResponseNotAllowed(['GET', 'POST'])


@api_view(['PUT'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def cocktail_edit(request, pk):
    try:
        cocktail = Cocktail.objects.get(id=pk)
    except Cocktail.DoesNotExist:
        return HttpResponseNotFound(f"No Cocktails matches id={pk}")
    serializer = CocktailDetailSerializer(
        cocktail, data=request.data, partial=True, context={'user': request.user})
    data = request.data.copy()
    if not serializer.is_valid():
        err = serializer.errors
        # return first error
        first_err = next(iter(err))
        if first_err == 'name':
            if err['name'][0].code == 'blank':
                return ExceptionResponse(status=400, detail="name_blank", code=ErrorCode.COCKTAIL_NAME_BLANK).to_response()
            elif err['name'][0].code == 'unique':
                return ExceptionResponse(status=400, detail="name_not_unique", code=ErrorCode.COCKTAIL_NAME_ALREADY_EXIST).to_response()
        elif first_err == 'name_eng':
            return ExceptionResponse(status=400, detail="english_name_not_unique", code=ErrorCode.COCKTAIL_ENG_NAME_ALREADY_EXIST).to_response()
        elif first_err == 'color':
            return ExceptionResponse(status=400, detail="color_blank", code=ErrorCode.COCKTAIL_COLOR_BLANK).to_response()
        elif first_err == 'introduction':
            return ExceptionResponse(status=400, detail="intro_blank", code=ErrorCode.COCKTAIL_INTRO_BLANK).to_response()
        elif first_err == 'recipe':
            return ExceptionResponse(status=400, detail="recipe_blank", code=ErrorCode.COCKTAIL_RECIPE_BLANK).to_response()

    serializer.save()

    CocktailTag.objects.filter(cocktail=pk).delete()
    try:
        tags = data['tags']
    except (KeyError, JSONDecodeError) as e:
        tags = []
    for t in tags:
        try:
            tag = Tag.objects.get(content=t)
        except Tag.DoesNotExist:
            tag = Tag.objects.create(content=t)
        # try:
        CocktailTag.objects.create(tag=tag, cocktail=cocktail)
        # except IntegrityError:
        #     return HttpResponseBadRequest("tag must not be duplicated")

    try:
        ingredient_list = data['ingredients']
    except (KeyError, JSONDecodeError) as e:
        ingredient_list = []
    IngredientPrepare.objects.filter(cocktail=cocktail).delete()
    for ingredient in ingredient_list:
        try:
            _ingredient = Ingredient.objects.get(id=ingredient["id"])
        except Ingredient.DoesNotExist:
            return HttpResponseNotFound("ingredient does not exist")
        IngredientPrepare.objects.create(
            cocktail=cocktail, ingredient=_ingredient, amount=ingredient["amount"], unit=ingredient["unit"])
    return JsonResponse(data=CocktailDetailSerializer(cocktail, context={'user': request.user}).data, status=200)


@api_view(['GET'])
def retrieve_cocktail(request, pk):
    try:
        cocktail = Cocktail.objects.get(id=pk)
    except Cocktail.DoesNotExist:
        return HttpResponseNotFound(f"No Cocktails matches id={pk}")
    return JsonResponse(CocktailDetailSerializer(cocktail, context={'user': request.user}).data, safe=False)

    # else:
    #     return HttpResponseNotAllowed(['GET', 'PUT'])


@api_view(['PUT'])
def cocktail_rate_edit(request, pk):

    try:
        cocktail = Cocktail.objects.get(id=pk)
    except Cocktail.DoesNotExist:
        return HttpResponseNotFound(f"No Cocktails matches id={pk}")

    serializer = CocktailDetailSerializer(
        cocktail, data=request.data, partial=True, context={'user': request.user})
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return JsonResponse(serializer.data, status=200)


@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def retrieve_my_cocktail(request):
    user = request.user

    # TODO: author_id=request.user.id
    cocktails = Cocktail.objects.filter(author_id=user.id, type='CS')
    data = CocktailListSerializer(cocktails, many=True, context={
                                  'user': request.user}).data
    return JsonResponse({"cocktails": data, "count": cocktails.count()}, safe=False)


@api_view(['DELETE'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def delete_cocktail(request, pk):
    user = request.user
    if not user.is_authenticated:
        return HttpResponse(status=401)
    try:
        cocktail = Cocktail.objects.get(id=pk)
    except Cocktail.DoesNotExist:
        return HttpResponseNotFound(f"No Cocktails matches id={pk}")
    if cocktail.author_id != user.id:
        return HttpResponse(status=401)
    # TODO: author_id=request.user.id
    cocktail.delete()
    return HttpResponse(status=204)


@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
def get_init_cocktail(request):

    filter_q = Q()
    type = request.GET.get('type')
    if type == 'standard':
        filter_q.add(Q(type='ST'), Q.AND)
    elif type == 'custom':
        filter_q.add(Q(type='CS'), Q.AND)
    else:
        return HttpResponseBadRequest('Cocktail type is \'custom\' or \'standard\'')

    cocktails = Cocktail.objects.filter(
        filter_q).order_by('-rate', 'name')[:15]
    data = CocktailListSerializer(cocktails, many=True, context={
        'user': request.user}).data
    return JsonResponse({"cocktails": data, "count": cocktails.count()}, safe=False)
