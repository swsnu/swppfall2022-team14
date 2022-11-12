from django.http import HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
from rest_framework.decorators import api_view
from cocktail.models import Cocktail


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def rate_list(request, cocktail_id):
    if request.method == 'GET':
        try:
            cocktail = Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktail matches id={cocktail_id}")

        rate_list = cocktail.rate_set.all()
        data = [{"cocktail_id": cocktail_id, "user_id": rate.user_id, "score": rate.score}
                for rate in rate_list]
        return JsonResponse(data, safe=False)
    elif request.method == 'POST':
        pass
    elif request.method == 'PUT':
        pass
    elif request.method == 'DELETE':
        pass
    else:
        return HttpResponseNotAllowed(['GET', 'POST', 'PUT', 'DELETE'])