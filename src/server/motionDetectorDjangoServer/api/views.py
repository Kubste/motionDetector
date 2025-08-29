from django.shortcuts import render
from rest_framework import viewsets
from .serializers import *
from auth_manager.permissions import AdminWritePermission

class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer

class ImageInfoViewSet(viewsets.ModelViewSet):
    queryset = ImageInfo.objects.all()
    serializer_class = ImageInfoSerializer

class TensorFlowModelViewSet(viewsets.ModelViewSet):
    queryset = TensorFlowModel.objects.all()
    serializer_class = TensorFlowModelSerializer
    permission_classes = [AdminWritePermission]     # 'user' role can only use safe methods

class TensorFlowOutputViewSet(viewsets.ModelViewSet):
    queryset = TensorFlowOutput.objects.all()
    serializer_class = TensorFlowOutputSerializer
    permission_classes = [AdminWritePermission]     # 'user' role can only use safe methods

class StorageViewSet(viewsets.ModelViewSet):
    queryset = Storage.objects.all()
    serializer_class = StorageSerializer
    permission_classes = [AdminWritePermission]     # 'user' role can only use safe methods
