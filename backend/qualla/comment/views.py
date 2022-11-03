from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from .models import Comment
from cocktail.models import Cocktail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CommentSerializer, CommentPostSerializer


@api_view(['GET', 'POST'])
def comment_list(request, cocktail_id):
    if request.method == 'GET':
        try:
            cocktail = Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktails matches id={cocktail_id}")
        comments = cocktail.comments.all()
        data = CommentSerializer(comments, many=True).data
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


@api_view(['GET', 'PUT', 'DELETE'])
def retrieve_comment(request, pk):
    if request.method == 'GET':
        try:
            comment = Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            return HttpResponseNotFound(f"No Comment matches id={pk}")

        data = CommentSerializer(comment).data
        return JsonResponse(data, safe=False)

    elif request.method == 'PUT':
        try:
            comment = Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            return HttpResponseNotFound(f"No Comment matches id={pk}")

        serializer = CommentSerializer(
            comment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data, status=200)

    elif request.method == 'DELETE':
        try:
            comment = Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            return HttpResponseNotFound(f"No Comment matches id={pk}")

        # 대댓글 존재시 is_deleted = True
        # 추후 내 댓글 목록 GET 시 is_deleted = False 로 filter하여 주어야 함.
        if (not comment.replies.exists()):
            comment.delete()
        else:
            comment.is_deleted = True
            comment.content = "삭제된 댓글입니다."
            comment.author_id = None
            comment.save()
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])
