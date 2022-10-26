from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse
from .models import Cocktail
from .serializers import CocktailListSerializer, CustomCocktailListSerializer

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
            return HttpResponseBadRequest('Cocktail type is needed!')
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])