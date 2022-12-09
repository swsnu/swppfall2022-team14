from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
import json
from rest_framework.decorators import api_view
from cocktail.models import Cocktail
from .models import Rate
from .serializers import RateSerializer, RatePostSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import permissions, authentication


@api_view(['GET'])
def rate_list(request, cocktail_id):
    if request.method == 'GET':
        try:
            cocktail = Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktail matches id={cocktail_id}")

        rates = cocktail.rate_set.all()
        data = RateSerializer(rates, many=True).data
        score = 0
        if data:
            score = sum(rate['score'] for rate in data) / len(data)
        cocktail.rate = score
        cocktail.save()
        return JsonResponse({"score": score}, safe=False)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def rate_list_user(request, cocktail_id):
    if request.method == 'GET':
        user = request.user
        if user.is_authenticated:
            try:
                rate = Rate.objects.get(
                    cocktail_id=cocktail_id, user_id=user.id)
                cocktail = Cocktail.objects.get(id=cocktail_id)
            except:
                return JsonResponse(None, status=404, safe=False)

            data = RateSerializer(rate).data['score']

            rates = cocktail.rate_set.all()
            _data = RateSerializer(rates, many=True).data
            score = 0
            if _data:
                score = sum(rate['score'] for rate in _data) / len(_data)
            cocktail.rate = score
            cocktail.save()
            return JsonResponse(data, safe=False)

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
            serializer = RatePostSerializer(
                data=data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            rates = cocktail.rate_set.all()
            _data = RateSerializer(rates, many=True).data
            score = 0
            if _data:
                score = sum(rate['score'] for rate in _data) / len(_data)
            cocktail.rate = score
            cocktail.save()
            return JsonResponse(serializer.data, status=201)

    elif request.method == 'PUT':
        user = request.user
        if user.is_authenticated:
            try:
                cocktail = Cocktail.objects.get(id=cocktail_id)
            except Cocktail.DoesNotExist:
                return HttpResponseNotFound(f"No Cocktail matches id={cocktail_id}")

            try:
                rate = Rate.objects.get(
                    cocktail_id=cocktail_id, user_id=user.id)
            except Rate.DoesNotExist:
                return HttpResponseNotFound(f"No Rate matches cocktail_id {cocktail_id}, user_id {user.id}")

            serializer = RateSerializer(rate, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            rates = cocktail.rate_set.all()
            _data = RateSerializer(rates, many=True).data
            score = 0
            if _data:
                score = sum(rate['score'] for rate in _data) / len(_data)
            cocktail.rate = score
            cocktail.save()
            return JsonResponse(serializer.data, status=200)
    elif request.method == 'DELETE':
        user = request.user
        if user.is_authenticated:
            try:
                cocktail = Cocktail.objects.get(id=cocktail_id)
            except Cocktail.DoesNotExist:
                return HttpResponseNotFound(f"No Cocktail matches id={cocktail_id}")

            try:
                rate = Rate.objects.get(
                    cocktail_id=cocktail_id, user_id=user.id)
            except Rate.DoesNotExist:
                return HttpResponseNotFound(f"No Rate matches cocktail_id {cocktail_id}, user_id {user.id}")

            rate.delete()
            rates = cocktail.rate_set.all()
            _data = RateSerializer(rates, many=True).data
            score = 0
            if _data:
                score = sum(rate['score'] for rate in _data) / len(_data)
            cocktail.rate = score
            cocktail.save()
            return HttpResponse(status=200)
