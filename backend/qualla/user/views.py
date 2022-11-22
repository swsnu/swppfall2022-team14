from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from .models import User
from .serializers import UserInfoSerializer
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import permissions, authentication


@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']

        user = User.objects.create_user(username=username, password=password)
        Token.objects.create(user=user)

        return HttpResponse(status=201)
    else:
        #return HttpResponse(status = 300)
        return HttpResponseNotAllowed(['POST'])


@api_view(['POST'])
def signin(request):
    if request.method == 'POST':
        req_data = request.data.copy()
        username = req_data['username']
        password = req_data['password']
        

        user = authenticate(username=username, password=password)

        if user is not None:

            login(request, user)

            token = Token.objects.get(user=user)
            user.logged_in = True
            user.save()
            

            user_data = UserInfoSerializer(user).data
            data = {'user_data': user_data, 'token': token.key}
            return Response(data)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])


@api_view(['POST'])
def signout(request):
    if request.method == 'POST':
        user = request.user
        if user.is_authenticated:
            user.logged_in = False
            user.save()
            logout(request)

            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])


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

@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponse(status=213)
