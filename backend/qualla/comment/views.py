from json import JSONDecodeError
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from .models import Comment
from cocktail.models import Cocktail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CommentSerializer, CommentPostSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import permissions, authentication

@api_view(['GET'])
def comment_list(request, cocktail_id):
    if request.method == 'GET':
        try:
            cocktail = Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktails matches id={cocktail_id}")

        comments = cocktail.comments.all()
        data = CommentSerializer(comments, many=True).data
        return JsonResponse({"comments": data, "count": comments.count()}, safe=False)

@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def comment_post(request, cocktail_id):
    if request.method == 'POST':
        try:
            if request.user.is_authenticated:
                data = request.data.copy()
            else:
                return HttpResponseBadRequest("Not Logined User")
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest("Unvalid Token")

        parent_comment = request.query_params.get("parent_comment", None)

        data = request.data.copy()

        data["cocktail"] = cocktail_id
        data["author_id"] = request.user.id
        data['parent_comment'] = parent_comment

        serializer = CommentPostSerializer(
            data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        comment = serializer.save()
        return Response(CommentSerializer(comment).data, status=201)


@api_view(['GET'])
def retrieve_comment(request, pk):
    if request.method == 'GET':
        try:
            comment = Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            return HttpResponseNotFound(f"No Comment matches id={pk}")

        data = CommentSerializer(comment).data
        return JsonResponse(data, safe=False)

@api_view(['PUT'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def edit_comment(request,pk):
    if request.method == 'PUT':
        try:
            if request.user.is_authenticated:
                data = request.data.copy()
            else:
                return HttpResponseBadRequest("Not Logined User")
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest("Unvalid Token")

        try:
            comment = Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            return HttpResponseNotFound(f"No Comment matches id={pk}")

        serializer = CommentSerializer(
            comment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data, status=200)

@api_view(['DELETE'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def delete_comment(request, pk):
    if request.method == 'DELETE':
        try:
            if request.user.is_authenticated:
                data = request.data.copy()
            else:
                return HttpResponseBadRequest("Not Logined User")
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest("Unvalid Token")

        try:
            comment = Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            return HttpResponseNotFound(f"No Comment matches id={pk}")

        # 대댓글 존재시 is_deleted = True
        # 추후 내 댓글 목록 GET 시 is_deleted = False 로 filter하여 주어야 함.
        if (not comment.replies.exists()):
            comment.delete()
            return Response(status=200)
        else:
            comment.is_deleted = True
            comment.content = "삭제된 댓글입니다."
            comment.author_id = None
            comment.save()
            return JsonResponse(CommentSerializer(comment).data, status=200)
    # else:
    #     return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])


@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def retrieve_my_comment(request):
    if request.method == 'GET':
        user = request.user
        if not user.is_authenticated:
            return HttpResponse(status=401)
        # TODO: author_id=request.user.id
        comments = Comment.objects.filter(author_id=user.id)
        print(comments.__str__())
        data = CommentSerializer(comments, many=True).data
        return JsonResponse({"comments": data, "count": comments.count()}, safe=False)
