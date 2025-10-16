import os
from auth_manager.serializers import UsersSerializer
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from .serializers import *
from auth_manager.permissions import AdminWritePermission
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class PaginationClass(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CameraViewSet(viewsets.ModelViewSet):
    serializer_class = CameraSerializer
    pagination_class = PaginationClass

    def get_queryset(self):
        if self.request.user.role == "sup":
            return Camera.objects.all().order_by('id')
        elif self.request.user.role == "admin":
            return Camera.objects.filter(admins=self.request.user).order_by('id')
        else:
            return Camera.objects.filter(user=self.request.user).order_by('id')

    def get_serializer_class(self):
        if self.action == "list":
            return CameraSerializer
        return CameraDetailsSerializer

    @action(detail=True, methods=['get'], url_path="get-admins")
    def get_admins(self, request, pk=None):
        camera = self.get_object()

        if request.user.role != "sup":
            raise PermissionDenied("Only superuser can get admins list")        # will return 403 Forbidden in response

        admins = camera.admins.all().order_by('id')
        serializer = UsersSerializer(admins, many=True)

        # applying pagination - @action does not inherit it from ViewSet
        page = self.paginate_queryset(admins)
        if page is not None:
            serializer = UsersSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # in case no pagination parameters were given
        return Response({"success": True, "admins": serializer.data})

    @action(detail=True, methods=['get'], url_path="get-new-admins")
    def get_new_admins(self, request, pk=None):
        camera = self.get_object()

        if request.user.role != "sup":
            raise PermissionDenied("Only superuser can get admins list")        # will return 403 Forbidden in response

        admins = User.objects.filter(role="admin").exclude(id__in=camera.admins.all()).order_by('id')   # admins that are not assigned to given camera
        serializer = UsersSerializer(admins, many=True)

        # applying pagination - @action does not inherit it from ViewSet
        page = self.paginate_queryset(admins)
        if page is not None:
            serializer = UsersSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # in case no pagination parameters were given
        return Response({"success": True, "admins": serializer.data})

    @action(detail=True, methods=['post'], url_path="add-admins")
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

    @action(detail=True, methods=['delete'], url_path="remove-admins")
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

    @action(detail=True, methods=['get'], url_path="get-deleted-files")
    def get_deleted_files(self, request, pk=None):
        user = request.user

        if user.role not in ["sup", "admin"]:
            raise PermissionDenied("Only superuser and admin can get deleted files")        # will return 403 Forbidden in response

        if user.role == "admin" and not Camera.objects.filter(id=pk, admins=user).exists():
            raise PermissionDenied("User does not have admin access to this camera")

        storages = Storage.objects.filter(imageinfo__camera__id=pk)                          # getting paths objects from camera directory

        # if user.role == "admin" and not Camera.objects.get(id=pk).admins.filter(id=user.id).exists():
        # User.objects.filter(camera__admins=user).distinct()
        if user.role == "admin" and not Camera.objects.get(id=pk).admins.filter(id=user.id).exists():
            raise PermissionDenied("User does not have admin access to this camera")

        if storages.count() == 0:
            #return Response({"success": True, "paths": []}, status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_204_NO_CONTENT)      #only status code - Django will cut off JSON

        deleted_files = []
        for storage in storages:
            if not os.path.exists(storage.path):
                deleted_files.append([storage.id, storage.path])

        if len(deleted_files) == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)      #only status code - Django will cut off JSON

        return Response({"success": True, "paths": deleted_files}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path="get-all-deleted-files")
    def get_all_deleted_files(self, request):
        user = request.user
        storages = []

        if user.role not in ["sup", "admin"]:
            raise PermissionDenied("Only superuser and admin can get deleted files")        # will return 403 Forbidden in response

        if user.role == "sup":
            storages = Storage.objects.all()
        elif user.role == "admin":
            storages = Storage.objects.filter(imageinfo__camera__admins=user).distinct()

        if storages.count() == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)

        deleted_files = []
        for storage in storages:
            if not os.path.exists(storage.path):
                deleted_files.append([storage.id, storage.path])

        if len(deleted_files) == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)  # only status code - Django will cut off JSON

        return Response({"success": True, "paths": deleted_files}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'])
    def synchronize(self, request, pk=None):
        ids = request.data.get("ids", [])
        user = request.user

        if user.role not in ["sup", "admin"]:
            raise PermissionDenied("Only superuser and admin can synchronize")  # will return 403 Forbidden in response

        if user.role == "admin" and not Camera.objects.get(id=pk).admins.filter(id=user.id).exists():
            raise PermissionDenied("User does not have admin access to this camera")

        if len(ids) == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)

        directories = Storage.objects.filter(id__in=ids).values_list("camera_directory", flat=True)     # getting directories names

        for directory in directories:
            if int(directory) != int(pk):
                return Response({"success": False, "error": f"One of the storage objects does not belong to camera: {pk}"}, status=status.HTTP_400_BAD_REQUEST)

        # deleting corresponding TensorFlowOutput record from database
        TensorFlowOutput.objects.filter(id__in=ImageInfo.objects.filter(storage_id__in=ids).values_list("output_id", flat=True)).delete()
        Storage.objects.filter(pk__in=ids).delete()

        return Response({"success": True, "message": "files have been deleted"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], url_path="synchronize-all")
    def synchronize_all(self, request):
        ids = request.data.get("ids", [])
        user = request.user

        if user.role not in ["sup", "admin"]:
            raise PermissionDenied("Only superuser and admin can synchronize")  # will return 403 Forbidden in response

        if len(ids) == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)

        if user.role == "admin":
            if Storage.objects.filter(id__in=ids).exclude(imageinfo__camera__admins=user).exists():
                raise PermissionDenied("User does not have admin access to some files")

        # deleting corresponding TensorFlowOutput record from database
        TensorFlowOutput.objects.filter(id__in=ImageInfo.objects.filter(storage_id__in=ids).values_list("output_id", flat=True)).delete()
        Storage.objects.filter(pk__in=ids).delete()

        return Response({"success": True, "message": "files have been deleted"}, status=status.HTTP_200_OK)

class ImageInfoViewSet(viewsets.ModelViewSet):
    serializer_class = ImageInfoSerializer
    pagination_class = PaginationClass

    def get_serializer_class(self):
        if self.action == "list":
            return ImageInfoSerializer
        return ImageInfoDetailsSerializer

    def get_queryset(self):
        if self.request.user.role == "sup":
            return ImageInfo.objects.all().order_by('id')
        elif self.request.user.role == "admin":
            return ImageInfo.objects.filter(camera__admins=self.request.user).order_by('id')
        else:
            return ImageInfo.objects.filter(camera__user=self.request.user).order_by('id')

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

        if len(new_filename) > 128:
            return Response({"success": False, "error": "Ensure filename has no more than 128 characters."}, status=status.HTTP_400_BAD_REQUEST)

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
