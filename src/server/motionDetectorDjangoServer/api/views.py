from rest_framework import viewsets
from .serializers import *
from auth_manager.permissions import AdminWritePermission
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class CameraViewSet(viewsets.ModelViewSet):
    serializer_class = CameraSerializer

    def get_queryset(self):
        if self.request.user.role in ["sup", "admin"]:
            return Camera.objects.all()
        else:
            return Camera.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_admins(self, request, pk=None):
        camera = self.get_object()

        if request.user.role != "sup":
            raise PermissionDenied("Only superuser can add camera admins")      # will return 403 Forbidden in response

        ids = request.data.get("admins", [])
        if not ids:
            return Response({"success": False, "error": "No admins provided"}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(ids, list):
            return Response({"success": False, "error": "Admins IDs should be a list"}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(id__in=ids)
        if users.count() != len(ids):
            return Response({"success": False, "error": "Users IDs do not match"}, status=status.HTTP_400_BAD_REQUEST)

        for user in users:
            if user.role != "admin":
                return Response({"success": False, "error": f"User with ID: {user.id} is not an admin"}, status=status.HTTP_400_BAD_REQUEST)

        camera.admins.add(*ids)
        return Response({"success": True}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'])
    def remove_admins(self, request, pk=None):
        camera = self.get_object()

        if request.user.role != "sup":
            raise PermissionDenied("Only superuser can remove camera admins")   # will return 403 Forbidden in response

        ids = request.data.get("admins", [])
        if not ids:
            return Response({"success": False, "error": "No admins provided"}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(ids, list):
            return Response({"success": False, "error": "Admins IDs should be a list"}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(id__in=ids)
        if users.count() != len(ids):
            return Response({"success": False, "error": "Users IDs do not match"}, status=status.HTTP_400_BAD_REQUEST)

        for user in users:
            if not camera.admins.filter(id=user.id).exists():
                return Response({"success": False, "error": f"User with ID: {user.id} is not assigned to camera: {camera.id}"}, status=status.HTTP_400_BAD_REQUEST)

            if user.role != "admin":
                return Response({"success": False, "error": f"User with ID: {user.id} is not an admin"}, status=status.HTTP_400_BAD_REQUEST)

        camera.admins.remove(*ids)
        return Response({"success": True}, status=status.HTTP_200_OK)


class ImageInfoViewSet(viewsets.ModelViewSet):
    serializer_class = ImageInfoSerializer

    def get_queryset(self):
        if self.request.user.role in ["sup", "admin"]:
            return ImageInfo.objects.all()
        else:
            return ImageInfo.objects.filter(user=self.request.user)

class TensorFlowModelViewSet(viewsets.ModelViewSet):
    queryset = TensorFlowModel.objects.all()
    serializer_class = TensorFlowModelSerializer
    permission_classes = [AdminWritePermission]     # 'user' role can only use safe methods

class TensorFlowOutputViewSet(viewsets.ModelViewSet):
    serializer_class = TensorFlowOutputSerializer
    permission_classes = [AdminWritePermission]     # 'user' role can only use safe methods

    def get_queryset(self):
        if self.request.user.role in ["sup", "admin"]:
            return TensorFlowOutput.objects.all()
        else:
            return TensorFlowOutput.objects.filter(imageinfo__camera__user=self.request.user)

class StorageViewSet(viewsets.ModelViewSet):
    serializer_class = StorageSerializer
    permission_classes = [AdminWritePermission]     # 'user' role can only use safe methods

    def get_queryset(self):
        if self.request.user.role in ["sup", "admin"]:
            return Storage.objects.all()
        else:
            return Storage.objects.filter(imageinfo__camera__user=self.request.user)
