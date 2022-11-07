from django.http import JsonResponse
from rest_framework.decorators import api_view
from cocktail.serializers import CocktailListSerializer

from .models import Tag

@api_view(['GET'])
def cocktails_by_tag(request):
    if request.method == 'GET':
        t = request.GET.get('tag')
        try:
            cocktails = [tag.cocktail for tag in  Tag.objects.get(content=t).cocktails.all()]
        except Tag.DoesNotExist:
            cocktails = []

        data = CocktailListSerializer(cocktails, many=True).data
        return JsonResponse({"cocktails": data, "count": len(cocktails)}, safe=False)
