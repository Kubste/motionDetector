import random
from django.contrib.messages.api import success
from knox.views import LogoutAllView
from rest_framework import generics, status, permissions, viewsets, filters
from knox.models import AuthToken
from knox.auth import TokenAuthentication
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from databaseApp.models import Camera
from .models import User, PasswordCodes
from .serializers import RegisterSerializer, PasswordChangeSerializer, AuthManagerSerializer, UsersSerializer
from .permissions import IsAdmin, IsSuperuser, IsSuperuserOrAdmin
from .utils import send_email_code

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

class PaginationClass(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class UsersView(viewsets.ReadOnlyModelViewSet):
    serializer_class = UsersSerializer
    pagination_class = PaginationClass
    filter_backends = [filters.OrderingFilter]
    ordering_fields = "__all__"
    ordering = ['id']  # default order

    def get_queryset(self):
        user = self.request.user
        if user.role == 'sup':
            return User.objects.all()                                       # for pagination
        elif user.role == 'admin':
            return User.objects.filter(camera__admins=user).distinct()      # return all users with cameras assigned to given admin
        else:
            raise PermissionDenied("Only superuser and admin can get users list")

class AuthManagerView(viewsets.ModelViewSet):
    serializer_class = AuthManagerSerializer

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def send_code(request):
    email = request.data.get('email')

    if not email:
        return Response({"success": False, "error": "No email received"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"success": True, "message": "Code has been sent"}, status=status.HTTP_200_OK)      # for security reason - to not reveal if user with given email exists

    code = str(random.randint(0, 99999999))
    while len(code) < 8:
        code = "0" + code

    try:
        PasswordCodes.objects.create(user=user, code=code)
        send_email_code(email, code)
    except:
        return Response({"success": False, "error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"success": True, "message": "Code has been sent"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def reset_password(request):
    email = request.data.get('email')
    code = request.data.get('code')
    new_password = request.data.get('new_password')

    if not email or not code or not new_password:
        return Response({"success": False, "error": "Invalid data received"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        password_code = PasswordCodes.objects.get(user=user, code=code)
    except User.DoesNotExist:
        return Response({"success": False, "error": "Invalid code or email"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"success": False, "error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if password_code.is_valid():
        user.set_password(new_password)
        user.save()

        return Response({"success": True, "message": "password has been changed"}, status=status.HTTP_200_OK)

    return Response({"success": False, "error": "given code has expired"}, status=status.HTTP_400_BAD_REQUEST)