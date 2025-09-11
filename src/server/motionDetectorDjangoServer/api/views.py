from rest_framework import viewsets
from .serializers import *
from auth_manager.permissions import AdminWritePermission

class CameraViewSet(viewsets.ModelViewSet):
    serializer_class = CameraSerializer

    def get_queryset(self):
        if self.request.user.role in ["sup", "admin"]:
            return Camera.objects.all()
        else:
            return Camera.objects.filter(user=self.request.user)

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
