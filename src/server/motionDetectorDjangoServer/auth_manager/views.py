from rest_framework import permissions, generics
from knox.models import AuthToken
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class LoginView(generics.GenericAPIView):
    serializer_class = AuthTokenSerializer

    # anyone can log in
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)     # using AuthTokenSerializer
        serializer.is_valid(raise_exception=True)               # automatically checks username and password, if wrong -> returns 400
        user = serializer.validated_data['user']                # user object with corresponding username and password

        # creating Knox token
        token = AuthToken.objects.create(user)[1]   # getting token as string
        return Response({
            "user_id": user.id,
            "token": token
        })
