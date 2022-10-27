from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
from .models import Cocktail
from .serializers import CocktailDetailSerializer, CocktailListSerializer, CustomCocktailDetailSerializer, CustomCocktailListSerializer

def cocktail_list(request):
    if request.method == 'GET':
        type = request.GET.get('type')
        if type == 'standard':
            standard_cocktails = Cocktail.objects.filter(type='ST')
            data = CocktailListSerializer(standard_cocktails, many=True).data
            return JsonResponse({"cocktails": data, "count": standard_cocktails.count()}, safe=False)
        elif type == 'custom':
            custom_cocktails = Cocktail.objects.filter(type='CS')
            data = CustomCocktailListSerializer(custom_cocktails, many=True).data
            return JsonResponse({"cocktails": data, "count": custom_cocktails.count()}, safe=False)
        else:
            return HttpResponseBadRequest('Cocktail type is \'custom\' or \'standard\'')
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def retrieve_cocktail(request, pk):
    if request.method == 'GET':
        try:
            cocktail = Cocktail.objects.get(id=pk)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktails matches id={pk}")
        if cocktail.type == 'ST':
            data = CocktailDetailSerializer(cocktail).data
        else:
            data = CustomCocktailDetailSerializer(cocktail).data
        return JsonResponse(data, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])