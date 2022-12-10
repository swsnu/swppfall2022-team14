from rest_framework.response import Response


class ExceptionResponse:
    status = None
    detail = ""
    code = 0

    def __init__(self, status, detail, code):
        self.status = status
        self.detail = detail
        self.code = code

    def to_response(self):
        return Response(
            status=self.status,
            data={
                "code":self.code.value,
                "detail":self.detail
            }
        )