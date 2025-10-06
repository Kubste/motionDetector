from django.contrib.messages.api import success
from knox.views import LogoutAllView
from rest_framework import generics, status, permissions, viewsets
from knox.models import AuthToken
from knox.auth import TokenAuthentication
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from databaseApp.models import Camera
from .models import User
from .serializers import RegisterSerializer, PasswordChangeSerializer, AuthManagerSerializer, UsersSerializer
from .permissions import IsAdmin, IsSuperuser, IsSuperuserOrAdmin

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
        return Response({"user_id": user.id, "username": user.username, "role": user.role, "token": token}, status=status.HTTP_200_OK)

class LogoutOutAllUsers(generics.GenericAPIView):
    permission_classes = [IsSuperuser]

    def post(self, request, *args, **kwargs):
        AuthToken.objects.all().delete()
        return Response({"detail": "All users have been logged out."}, status=status.HTTP_200_OK)

# generics.CreateAPIView - only POST method allowed
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [IsSuperuserOrAdmin]                       # only superuser or admin can register

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)         # using RegisterSerializer
        serializer.is_valid(raise_exception=True)                   # automatically checks token, if wrong -> returns 400
        user = serializer.save()                                    # calls serializer.create() - no instance parameter in .get_serializer()

        return Response({"success": True, "user": self.get_serializer(user).data}, status=status.HTTP_201_CREATED)

class PasswordChangeView(generics.UpdateAPIView):
    serializer_class = PasswordChangeSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    # getting user object
    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(instance=request.user, data=request.data)  # using PasswordChangeSerializer
        serializer.is_valid(raise_exception=True)                                   # automatically validates passwords
        serializer.save()                                                           # calls serializer.update() - given instance parameter in .get_serializer()

        return Response({"success": True, "user_id": request.user.id}, status=status.HTTP_200_OK)

class UsersView(viewsets.ReadOnlyModelViewSet):
    serializer_class = UsersSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'sup':
            return User.objects.all()
        elif user.role == 'admin':
            return User.objects.filter(camera__admins=user).distinct()      # return all users with cameras assigned to given admin
        else:
            return User.objects.none()

class AuthManagerView(viewsets.ModelViewSet):
    serializer_class = AuthManagerSerializer

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)