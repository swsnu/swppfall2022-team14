from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponse
from .models import Comment
from cocktail.models import Cocktail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CommentSerializer, CommentPostSerializer
from rest_framework import viewsets

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def list(self, request, cocktail_id):
        try:
            cocktail = Cocktail.objects.get(id=cocktail_id)
        except Cocktail.DoesNotExist:
            return HttpResponseNotFound(f"No Cocktails matches id={cocktail_id}")

        comments = cocktail.comments.all()
        data = self.serializer_class(comments, many=True).data
        return JsonResponse({"comments": data, "count": comments.count()}, safe=False)

    def create(self, request, cocktail_id):
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
        comment = serializer.save()
        return Response(self.serializer_class(comment).data, status=201)
    
    def retrieve(self, request, pk):
        try:
            comment = self.queryset.get(id=pk)
        except Comment.DoesNotExist:
            return HttpResponseNotFound(f"No Comment matches id={pk}")

        data = self.serializer_class(comment).data
        return JsonResponse(data, safe=False)

    def partial_update(self, request, pk):
        try:
            comment = self.queryset.get(id=pk)
        except Comment.DoesNotExist:
            return HttpResponseNotFound(f"No Comment matches id={pk}")

        serializer = self.serializer_class(
            comment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data, status=200)

    def destroy(self, request, pk):
        try:
            comment = self.queryset.get(id=pk)
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

    def retrieve_my_comment(self, request):
        # TODO: author_id=request.user.id
        comments = self.queryset.filter(author_id=1)
        data = self.serializer_class(comments, many=True).data
        return JsonResponse({"comments": data, "count": comments.count()}, safe=False)
