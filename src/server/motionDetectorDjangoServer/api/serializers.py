from rest_framework import serializers
from databaseApp.models import *

class CameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camera
        fields = "__all__"

class ImageInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageInfo
        fields = "__all__"

class TensorFlowModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TensorFlowModel
        fields = "__all__"

class TensorFlowOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = TensorFlowOutput
        fields = "__all__"

class StorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Storage
        fields = "__all__"