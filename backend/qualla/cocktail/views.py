from functools import partial
from json import JSONDecodeError
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
from django.db import IntegrityError
from django.db.models import Q
from tag.models import Tag, CocktailTag
from .models import Cocktail
from rest_framework.decorators import api_view
from .serializers import CocktailDetailSerializer, CocktailListSerializer, CocktailPostSerializer, CocktailUpdateSerializer


def process_get_list_params(request,filter_q):
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
    
    filter_type_one_list = request.query_params.get("filter_type_one", None)
    filter_type_two_list = request.query_params.get("filter_type_two", None)
    filter_type_ABV = request.query_params.get(
        "filter_type_three", None)  # 도수
    if (filter_type_one_list is None):
        filter_type_one_list = ""
    if (filter_type_two_list is None):
        filter_type_two_list = ""

    filter_type_one_list = filter_type_one_list.split('_')
    filter_type_two_list = filter_type_two_list.split('_')

    while ("" in filter_type_one_list):
        filter_type_one_list.remove("")
    while ("" in filter_type_two_list):
        filter_type_two_list.remove("")

    for _type in filter_type_one_list:
            filter_q.add(Q(filter_type_one__contains=_type), Q.AND)
    for _type in filter_type_two_list:
        filter_q.add(Q(filter_type_two__contains=_type), Q.AND)

    if (filter_type_ABV is not None and filter_type_ABV != ""):
        try:
            abv_range = get_ABV_range(filter_type_ABV)
        except (ValueError):
            raise ValueError
        filter_q.add(Q(ABV__range=(abv_range)), Q.AND)
    



def get_cocktail_list_by_ingredient(request):
    request_ingredient = request.query_params.get("ingredients", None) # ingredient id
    cocktail_all = Cocktail.objects.all()
    cocktail_return = []
    for cocktail in cocktail_all:
        ingredient_prepare = [ingredient.id for ingredient in cocktail.ingredient_prepare.all()] 
        # 만약 해당 칵테일 재료가 query의 subset이면 
        if set(ingredient_prepare).issubset(set(request_ingredient)):
            cocktail_return.append(cocktail)
    
    return cocktail_return





@api_view(['GET', 'POST'])
def cocktail_list(request):
    if request.method == 'GET':
        
        # Add params Filter
        filter_q = Q()
        try:
            process_get_list_params(request, filter_q)
        except (ValueError):
            return HttpResponseBadRequest('Invalid ABV Type')

        # Add Type(ST,CS) Filter
        type = request.GET.get('type')
        if type == 'standard':
            filter_q.add(Q(type='ST'), Q.AND)
        elif type == 'custom':
            filter_q.add(Q(type='CS'), Q.AND)
        else:
            return HttpResponseBadRequest('Cocktail type is \'custom\' or \'standard\'')

        cocktails = Cocktail.objects.filter(filter_q)
        data = CocktailListSerializer(cocktails, many=True).data
        return JsonResponse({"cocktails": data, "count": cocktails.count()}, safe=False)

        # if type == 'standard':
        #     filter_q.add(Q(type='ST'), Q.AND)
        #     # standard_cocktails = Cocktail.objects.filter(type='ST')
        #     standard_cocktails = Cocktail.objects.filter(filter_q)
        #     data = CocktailListSerializer(standard_cocktails, many=True).data

        #     return JsonResponse({"cocktails": data, "count": standard_cocktails.count()}, safe=False)
        # elif type == 'custom':
        #     filter_q.add(Q(type='CS'), Q.AND)
        #     # custom_cocktails = Cocktail.objects.filter(type='CS')
        #     custom_cocktails = Cocktail.objects.filter(filter_q)
        #     data = CocktailListSerializer(custom_cocktails, many=True).data
        #    return JsonResponse({"cocktails": data, "count": custom_cocktails.count()}, safe=False)
        # else:
        #     return HttpResponseBadRequest('Cocktail type is \'custom\' or \'standard\'')
    elif request.method == 'POST':
        data = request.data.copy()

        # TODO: change fields that is derived automatically
        data['author_id'] = 1
        data['type'] = 'CS'

        serializer = CocktailPostSerializer(
            data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
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
            try:
                CocktailTag.objects.create(tag=tag, cocktail=cocktail)
            except IntegrityError:
                return HttpResponseBadRequest("tag must not be duplicated")

        return JsonResponse(data=CocktailDetailSerializer(cocktail).data, status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


@api_view(['GET', 'PUT'])
def retrieve_cocktail(request, pk):
    if request.method == 'GET':
        try:
            cocktail = Cocktail.objects.get(id=pk)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktails matches id={pk}")
        data = CocktailDetailSerializer(cocktail).data
        return JsonResponse(data, safe=False)
    elif request.method == 'PUT':
        try:
            cocktail = Cocktail.objects.get(id=pk)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktails matches id={pk}")
        serializer = CocktailDetailSerializer(
            cocktail, data=request.data, partial=True)
        data = request.data.copy()
        serializer.is_valid(raise_exception=True)
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
            try:
                CocktailTag.objects.create(tag=tag, cocktail=cocktail)
            except IntegrityError:
                return HttpResponseBadRequest("tag must not be duplicated")

        return JsonResponse(data=CocktailDetailSerializer(cocktail).data, status=200)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])


@api_view(['GET'])
def retrieve_my_cocktail(request):
    if request.method == 'GET':
        # TODO: author_id=request.user.id
        cocktails = Cocktail.objects.filter(author_id=1, type='CS')
        data = CocktailListSerializer(cocktails, many=True).data
        return JsonResponse({"cocktails": data, "count": cocktails.count()}, safe=False)
