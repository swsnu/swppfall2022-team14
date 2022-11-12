from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
import json
from rest_framework.decorators import api_view
from cocktail.models import Cocktail
from .serializers import RateSerializer


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def rate_list(request, cocktail_id):
    if request.method == 'GET':
        try:
            cocktail = Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktail matches id={cocktail_id}")

        rate_list = cocktail.rate_set.all()
        score = sum(rate.score for rate in rate_list) / len(rate_list)
        return JsonResponse({"score": score}, safe=False)
    elif request.method == 'POST':
        user = request.user
        if user.is_authenticated:
            try:
                cocktail = Cocktail.objects.get(id=cocktail_id)
            except Cocktail.DoesNotExist:
                return HttpResponseNotFound(f"No Cocktail matches id={cocktail_id}")

            data = request.data.copy()
            data['cocktail'] = cocktail_id
            data['user'] = user.id
            serializer = RateSerializer(data=data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        else:
            return HttpResponse(status=401)
    elif request.method == 'PUT':
        pass
    elif request.method == 'DELETE':
        pass
    else:
        return HttpResponseNotAllowed(['GET', 'POST', 'PUT', 'DELETE'])