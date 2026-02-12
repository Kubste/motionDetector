from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from databaseApp.models import *

class TensorFlowModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TensorFlowModel
        fields = ['id', 'model_name', 'model_version']

class TensorFlowModelDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TensorFlowModel
        fields = "__all__"

class BaseCameraSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ["admins"]       # admins will be ignored by serializer if sent

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

        return super().update(instance, validated_data)

class CameraSerializer(BaseCameraSerializer):
    class Meta:
        model = Camera
        fields = ['id', 'camera_name', 'model']

class CameraDetailsSerializer(BaseCameraSerializer):
    model = TensorFlowModelSerializer(read_only=True)

    class Meta:
        model = Camera
        fields = "__all__"

    # creating new camera
    def create(self, validated_data):
        model_id = self.context['request'].data.get('model_id')
        if model_id:
            validated_data['model_id'] = model_id
        return super().create(validated_data)

    # updating model foreign key
    def update(self, instance, validated_data):
        model_id = self.context['request'].data.get('model_id')
        if model_id is not None:
            instance.model_id = model_id
        return super().update(instance, validated_data)

# base serializer for image info - providing update function
class BaseImageInfoSerializer(serializers.ModelSerializer):

    # only superuser and admin can change file_size, file_type and timestamp
    def update(self, instance, validated_data):
        user_role = self.context['request'].user.role

        if ('file_size' in validated_data or 'file_type' in validated_data or 'timestamp' in validated_data) and user_role not in ['sup', 'admin']:
            raise PermissionDenied

        return super().update(instance, validated_data)

class StorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Storage
        fields = "__all__"

# serializer for a list of all image info records - only selected fields
class ImageInfoSerializer(BaseImageInfoSerializer):
    path = serializers.SerializerMethodField()

    class Meta:
        model = ImageInfo
        fields = ['id', 'filename', 'path', 'timestamp', 'is_processed']

    # getting file path
    def get_path(self, instance):
        if instance.storage and instance.storage.path:
            path_segments = instance.storage.path.split('/')[-3:]
            return "/".join(path_segments)
        return None

class TensorFlowOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = TensorFlowOutput
        fields = "__all__"

# serializer for a specific image info record - all fields
class ImageInfoDetailsSerializer(BaseImageInfoSerializer):
    camera = serializers.SlugRelatedField(read_only=True, slug_field='camera_name')     # getting camera name from foreign key
    output = TensorFlowOutputSerializer(read_only=True)
    model = TensorFlowModelSerializer(read_only=True)

    class Meta:
        model = ImageInfo
        fields = "__all__"