from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from rest_framework.decorators import api_view


@api_view(['GET'])
def ping(request):
    return HttpResponse(status=200)


