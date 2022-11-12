from django.http import HttpResponse, HttpResponseNotAllowed
from django.contrib.auth import login, authenticate
import json
from rest_framework.decorators import api_view
from .models import User


@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']

        User.objects.create_user(username=username, password=password)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['PUT'])
def signin(request):
    if request.method == 'PUT':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)

            user.logged_in = True
            user.save()

            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['PUT'])