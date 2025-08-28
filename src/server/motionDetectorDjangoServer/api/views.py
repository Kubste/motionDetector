from django.shortcuts import render
from rest_framework import viewsets
from .serializers import *

class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer

class ImageInfoViewSet(viewsets.ModelViewSet):
    queryset = ImageInfo.objects.all()
    serializer_class = ImageInfoSerializer

class TensorFlowModelViewSet(viewsets.ModelViewSet):
    queryset = TensorFlowModel.objects.all()
    serializer_class = TensorFlowModelSerializer

class TensorFlowOutputViewSet(viewsets.ModelViewSet):
    queryset = TensorFlowOutput.objects.all()
    serializer_class = TensorFlowOutputSerializer

class StorageViewSet(viewsets.ModelViewSet):
    queryset = Storage.objects.all()
    serializer_class = StorageSerializer
