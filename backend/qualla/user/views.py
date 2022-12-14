from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse, HttpResponseNotFound
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from exception.errno import ErrorCode
from exception.exception_response import ExceptionResponse
from .models import User
from .serializers import UserInfoSerializer, UserNameSerializer
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import permissions, authentication


@api_view(['POST'])
def signup(request):
    if request.method == 'POST':

        try:
            req_data = request.data.copy()
            username = req_data['username']
            password = req_data['password']

            user = User.objects.create_user(
                username=username, password=password)
            Token.objects.create(user=user)

            return HttpResponse(status=201)
        except Exception as e:
            print(e)
            return HttpResponse(status=400)


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


@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def signout(request):
    if request.method == 'POST':
        user = request.user
        if user.is_authenticated:
            user.logged_in = False
            user.save()
            logout(request)

            return HttpResponse(status=200)


@api_view(['GET'])
def get_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return HttpResponseNotFound(f"No User matches id={user_id}")

    data = UserNameSerializer(user).data
    return JsonResponse({"username": data['username']}, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def retrieve_my_info(request):
    if request.method == 'GET':
        user = request.user
        if user.is_authenticated:
            data = UserInfoSerializer(user).data
            return JsonResponse(data, safe=False)

    elif request.method == 'PUT':
        user = request.user
        if user.is_authenticated:
            req_data = json.loads(request.body.decode())

            if check_password(req_data['org_password'], user.password):
                password = req_data['password']

                user.set_password(password)
                user.save()

                login(request, user)

                data = UserInfoSerializer(user).data
                return JsonResponse(data, safe=False)
            else:
                return ExceptionResponse(status=401, detail="password incorrect", code=ErrorCode.USER_PASSWORD_INCORRECT).to_response()

    elif request.method == 'DELETE':
        user = request.user

        if user.is_authenticated:
            user.delete()
            return HttpResponse(status=200)


@ensure_csrf_cookie
@api_view(['GET'])
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
