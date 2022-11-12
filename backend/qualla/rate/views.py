from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
import json
from rest_framework.decorators import api_view
from .models import Rate


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def rate_list(request, cocktail_id):
    if request.method == 'GET':
        pass
    elif request.method == 'POST':
        pass
    elif request.method == 'PUT':
        pass
    elif request.method == 'DELETE':
        pass
    else:
        return HttpResponseNotAllowed(['GET', 'POST', 'PUT', 'DELETE'])