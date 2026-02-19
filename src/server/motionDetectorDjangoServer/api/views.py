import os
import sys
import time

from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from auth_manager.authentication import CookieTokenAuthentication
from auth_manager.serializers import UsersSerializer
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from .serializers import *
from auth_manager.permissions import AdminWritePermission
from rest_framework import status, filters
from django.http import FileResponse, Http404
from PIL import Image
from django.http import HttpResponse
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
import io, os, mimetypes

class PaginationClass(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_page_size(self, request):
        if request.query_params.get('page_size') == "-1":
            return sys.maxsize
        return super().get_page_size(request)

class CameraViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    serializer_class = CameraSerializer
    pagination_class = PaginationClass
    filter_backends = [filters.OrderingFilter]
    ordering_fields = "__all__"
    ordering = ['id']  # default order

    def get_queryset(self):
        if self.request.user.role == "sup":
            return Camera.objects.all()
        elif self.request.user.role == "admin":
            return Camera.objects.filter(admins=self.request.user)
        else:
            return Camera.objects.filter(user=self.request.user)

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
    filter_backends = [filters.OrderingFilter]
    ordering_fields = "__all__"
    ordering = ['id']       # default order

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

    @action(detail=True, methods=['get'], url_path="get-image")
    def get_image(self, request, pk=None):
        try:
            image = ImageInfo.objects.get(id=pk)
        except ImageInfo.DoesNotExist:
            return Response({"success": False, "error": "Image does not exist"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        role = user.role
        path = image.storage.path

        if role == "sup" or (role == "admin" and user in image.camera.admins.all()) or (role == "user" and user == image.camera.user):
            if not os.path.exists(path):
                return Response({"success": False, "error": "Cannot find image"}, status=status.HTTP_404_NOT_FOUND)

            mime, _ = mimetypes.guess_type(path)
            file = open(path, "rb")
            response = FileResponse(file, content_type=mime)
            response["Content-Disposition"] = f'inline; filename="{image.filename}"'    # can display image in window without downloading it to client filesystem
            return response

        else:
            raise PermissionDenied("User does not have access to this image")

    @action(detail=True, methods=['get'], url_path="get-thumbnail")
    def get_thumbnail(self, request, pk=None):
        try:
            image = ImageInfo.objects.get(id=pk)
        except ImageInfo.DoesNotExist:
            return Response({"success": False, "error": "Image does not exist"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        role = user.role
        path = image.storage.path

        if role not in ["sup", "admin", "user"]:
            raise PermissionDenied("User does not have access to this image")

        if role == "admin" and user not in image.camera.admins.all():
            raise PermissionDenied("User does not have access to this image")

        if role == "user" and user != image.camera.user:
            raise PermissionDenied("User does not have access to this image")

        if not os.path.exists(path):
            return Response({"success": False, "error": "Cannot find image"}, status=status.HTTP_404_NOT_FOUND)


        try:
            thumb_size = (300, 300)
            with Image.open(path) as img:
                img.thumbnail(thumb_size)
                buf = io.BytesIO()
                img_format = img.format if img.format else "JPEG"
                img.save(buf, format=img_format)
                buf.seek(0)

                mime = mimetypes.guess_type(path)[0] or "image/jpeg"
                return HttpResponse(buf, content_type=mime)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
    pagination_class = PaginationClass
    filter_backends = [filters.OrderingFilter]
    ordering_fields = "__all__"
    ordering = ['id']  # default order

    def get_serializer_class(self):
        if self.action == "list":
            return TensorFlowModelSerializer
        return TensorFlowModelDetailsSerializer

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
