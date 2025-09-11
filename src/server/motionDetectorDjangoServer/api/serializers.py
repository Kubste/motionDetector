from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from databaseApp.models import *

class CameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camera
        fields = "__all__"

    # checking if user is trying to assign camera to other user
    def create(self, validated_data):
        user = self.context['request'].user
        print(user.id, flush=True)      # debug info

        if user.id != validated_data['user'].id and user.role not in ['sup', 'admin']:
            raise PermissionDenied("Only superuser and admin can assign camera to other user")

        return super().create(validated_data)

    # only superuser and admin can change user
    def update(self, instance, validated_data):
        user_role = self.context['request'].user.role

        if 'user' in validated_data and user_role not in ['sup', 'admin']:
            raise PermissionDenied

class ImageInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageInfo
        fields = "__all__"

    # only superuser and admin can change file_size, file_type and timestamp
    def update(self, instance, validated_data):
        user_role = self.context['request'].user.role

        if ('file_size' in validated_data or 'file_type' in validated_data or 'timestamp' in validated_data) and user_role not in ['sup', 'admin']:
            raise PermissionDenied

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