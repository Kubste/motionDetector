import os
from rest_framework import viewsets
from .serializers import *
from auth_manager.permissions import AdminWritePermission
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class CameraViewSet(viewsets.ModelViewSet):
    serializer_class = CameraSerializer

    def get_queryset(self):
        if self.request.user.role == "sup":
            return Camera.objects.all()
        elif self.request.user.role == "admin":
            return Camera.objects.filter(admins=self.request.user)
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

    def get_serializer_class(self):
        if self.action == "list":
            return ImageInfoSerializer
        return ImageInfoDetailsSerializer

    def get_queryset(self):
        if self.request.user.role == "sup":
            return ImageInfo.objects.all()
        elif self.request.user.role == "admin":
            return ImageInfo.objects.filter(camera__admins=self.request.user)
        else:
            return ImageInfo.objects.filter(camera__user=self.request.user)

    # deleting corresponding file
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        os.remove(instance.storage.path)

        self.perform_destroy(instance)

        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], url_path="change-filename")
    def change_filename(self, request, pk=None):
        image = self.get_object()
        new_filename = request.data.get("filename")

        if not new_filename:
            return Response({"success": False, "error": "No filename provided"}, status=status.HTTP_400_BAD_REQUEST)

        old_path = image.storage.path
        directory = os.path.dirname(old_path)
        new_path = os.path.join(directory, new_filename)

        if os.path.exists(new_path):
            return Response({"success": False, "error": "File with this name already exists"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            os.rename(old_path, new_path)
        except FileNotFoundError:
            return Response({"success": False, "error": "Image does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionError:
            return Response({"success": False, "error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        image.filename = new_filename
        image.storage.path = new_path
        image.save()
        image.storage.save()

        return Response({"success": True}, status=status.HTTP_200_OK)

class TensorFlowModelViewSet(viewsets.ModelViewSet):
    queryset = TensorFlowModel.objects.all()
    serializer_class = TensorFlowModelSerializer
    permission_classes = [AdminWritePermission]     # 'user' role can only use safe methods

class TensorFlowOutputViewSet(viewsets.ModelViewSet):
    serializer_class = TensorFlowOutputSerializer
    permission_classes = [AdminWritePermission]     # 'user' role can only use safe methods

    def get_queryset(self):
        if self.request.user.role == "sup":
            return TensorFlowOutput.objects.all()
        elif self.request.user.role == "admin":
            return TensorFlowOutput.objects.filter(imageinfo__camera__admins=self.request.user)
        else:
            return TensorFlowOutput.objects.filter(imageinfo__camera__user=self.request.user)

class StorageViewSet(viewsets.ModelViewSet):
    serializer_class = StorageSerializer
    permission_classes = [AdminWritePermission]     # 'user' role can only use safe methods

    def get_queryset(self):
        if self.request.user.role == "sup":
            return Storage.objects.all()
        elif self.request.user.role == "admin":
            return Storage.objects.filter(imageinfo__camera__admins=self.request.user)
        else:
            return Storage.objects.filter(imageinfo__camera__user=self.request.user)

    @action(detail=True, methods=['get'], url_path="get-deleted-files")
    def get_deleted_files(self, request, pk=None):
        #user_directory = request.query_params.get('user_directory', None)

        if request.user.role not in ["sup", "admin"]:
            raise PermissionDenied("Only superuser and admin can get deleted files")        # will return 403 Forbidden in response

        storages = Storage.objects.filter(camera_directory=pk)                              # getting paths objects from camera directory

        if storages.count() == 0:
            return Response({"success": True, "paths": []}, status=status.HTTP_204_NO_CONTENT)

        deleted_files = []
        for storage in storages:
            print(f"Storage: {storage.path}", flush=True)
            if not os.path.exists(storage.path):
                deleted_files.append(storage.id)

        return Response({"success": True, "paths": deleted_files}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'])
    def synchronize(self, request, pk=None):
        ids = request.data.get("ids", [])
        user = request.user

        if user.role not in ["sup", "admin"]:
            raise PermissionDenied("Only superuser and admin can synchronize")   # will return 403 Forbidden in response

        if user.role == "admin" and not Camera.objects.get(id=pk).admins.filter(id=user.id).exists():
            raise PermissionDenied("User does not have admin access to this camera")

        if len(ids) == 0:
            return Response({"success": True, "message": "No IDs given"}, status=status.HTTP_204_NO_CONTENT)

        directories = Storage.objects.filter(id__in=ids).values_list("camera_directory", flat=True)

        for directory in directories:
            if int(directory) != int(pk):
                return Response({"success": False, "error": f"One of the storage objects does not belong to camera: {pk}"}, status=status.HTTP_400_BAD_REQUEST)

        # deleting corresponding TensorFlowOutput record from database
        TensorFlowOutput.objects.filter(id__in=ImageInfo.objects.filter(storage_id__in=ids).values_list("output_id", flat=True)).delete()
        Storage.objects.filter(pk__in=ids).delete()

        return Response({"success": True, "message": "files have been deleted"}, status=status.HTTP_200_OK)
