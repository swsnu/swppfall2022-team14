from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import authenticate, login, logout
import json
from rest_framework.decorators import api_view
from .models import User
from .serializers import UserInfoSerializer


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


@api_view(['PUT'])
def signout(request):
    if request.method == 'PUT':
        user = request.user
        if user.is_authenticated:
            logout(request)

            user.logged_in = False
            user.save()

            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['PUT'])


@api_view(['GET', 'PUT', 'DELETE'])
def retrieve_my_info(request):
    if request.method == 'GET':
        user = request.user
        if user.is_authenticated:
            data = UserInfoSerializer(user).data
            return JsonResponse(data, safe=False)
        else:
            return HttpResponse(status=401)
    elif request.method == 'PUT':
        user = request.user
        if user.is_authenticated:
            req_data = json.loads(request.body.decode())
            password = req_data['password']
            nickname = req_data['nickname']
            intro = req_data['intro']
            profile_img = req_data['profile_img']

            user.set_password(password)
            user.nickname = nickname
            user.intro = intro
            user.profile_img = profile_img
            user.save()

            login(request, user)

            data = UserInfoSerializer(user).data
            return JsonResponse(data, safe=False)
        else:
            return HttpResponse(status=401)
    elif request.method == 'DELETE':
        user = request.user
        if user.is_authenticated:
            user.delete()
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])