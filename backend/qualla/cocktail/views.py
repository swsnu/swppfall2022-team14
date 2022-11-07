from functools import partial
from json import JSONDecodeError
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
from django.db import IntegrityError

from tag.models import Tag, CocktailTag
from .models import Cocktail
from rest_framework.decorators import api_view
from .serializers import CocktailDetailSerializer, CocktailListSerializer, CocktailPostSerializer, CocktailUpdateSerializer

@api_view(['GET', 'POST'])
def cocktail_list(request):
    if request.method == 'GET':
        type = request.GET.get('type')
        if type == 'standard':
            standard_cocktails = Cocktail.objects.filter(type='ST')
            data = CocktailListSerializer(standard_cocktails, many=True).data
            return JsonResponse({"cocktails": data, "count": standard_cocktails.count()}, safe=False)
        elif type == 'custom':
            custom_cocktails = Cocktail.objects.filter(type='CS')
            data = CocktailListSerializer(custom_cocktails, many=True).data
            return JsonResponse({"cocktails": data, "count": custom_cocktails.count()}, safe=False)
        else:
            return HttpResponseBadRequest('Cocktail type is \'custom\' or \'standard\'')
    elif request.method == 'POST':
        data = request.data.copy()

        # TODO: change fields that is derived automatically 
        data['author_id'] = 1
        data['type'] = 'CS'

        serializer = CocktailPostSerializer(data=data, context={"request": request})
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
        serializer = CocktailDetailSerializer(cocktail, data = request.data, partial=True)
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
        cocktails = Cocktail.objects.filter(author_id=1, type='CS') # TODO: author_id=request.user.id
        data = CocktailListSerializer(cocktails, many=True).data
        return JsonResponse({"cocktails": data, "count": cocktails.count()}, safe=False)
