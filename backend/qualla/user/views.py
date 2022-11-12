from django.http import HttpResponse, HttpResponseNotAllowed
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