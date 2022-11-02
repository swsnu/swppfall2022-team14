from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
from .models import Comment
from cocktail.models import Cocktail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CommentListSerializer, CommentPostSerializer


@api_view(['GET', 'POST'])
def comment_list(request, cocktail_id):
    if request.method == 'GET':
        try:
            cocktail = Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktails matches id={cocktail_id}")
        comments = cocktail.comments.all()
        data = CommentListSerializer(comments, many=True).data
        return JsonResponse({"Comments": data, "count": comments.count()}, safe=False)
    elif request.method == 'POST':

        parent_comment = request.query_params.get("parent_comment", None)
        # breakpoint()
        data = request.data.copy()

        data["cocktail"] = cocktail_id
        # TODO : user로 대체
        data["author_id"] = 1
        data['parent_comment'] = parent_comment

        serializer = CommentPostSerializer(
            data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])
