from rest_framework import generics, status
from knox.models import AuthToken
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import RegisterSerializer
from .permissions import IsAdmin

class LoginView(generics.GenericAPIView):
    serializer_class = AuthTokenSerializer

    # anyone can log in
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)         # using AuthTokenSerializer
        serializer.is_valid(raise_exception=True)                   # automatically checks username and password, if wrong -> returns 400
        user = serializer.validated_data['user']                    # user object with corresponding username and password

        # creating Knox token
        token = AuthToken.objects.create(user)[1]                   # getting token as string
        return Response({"user_id": user.id, "token": token}, status=status.HTTP_200_OK)

# generics.CreateAPIView - only POST method allowed
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [IsAdmin]                                  # only admin can register

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)         # using RegisterSerializer
        serializer.is_valid(raise_exception=True)                   # automatically checks token, if wrong -> returns 400
        user = serializer.save()                                    # calls serializer.create()

        return Response({"success": True, "user": RegisterSerializer(user).data}, status=status.HTTP_201_CREATED)