import os
import tempfile
from django.utils import timezone
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APITestCase
from auth_manager.models import User
from databaseApp.models import Camera, Storage, ImageInfo, TensorFlowModel

class GetImageTests(APITestCase):
    def setUp(self):
        self.sup = User.objects.create_user(
            username="sup",
            email="sup@example.com",
            password="pass",
            role="sup",
            phone_number="123456789",
            first_name="sup",
            last_name="sup",
        )

        self.admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="pass",
            role="admin",
            phone_number="123456798",
            first_name="admin",
            last_name="admin",
        )

        self.other_admin = User.objects.create_user(
            username="other_admin",
            email="other.admin@example.com",
            password="pass",
            role="admin",
            phone_number="123156798",
            first_name="other_admin",
            last_name="other_admin",
        )

        self.owner = User.objects.create_user(
            username="owner",
            email="owner@example.com",
            password="pass",
            role="user",
            phone_number="123256789",
            first_name="owner",
            last_name="owner",
        )

        self.other_user = User.objects.create_user(
            username="other_user",
            email="other@example.com",
            password="pass",
            role="user",
            phone_number="1234523789",
            first_name="user",
            last_name="user",
        )

        self.tf_model = TensorFlowModel.objects.create(
            model_name="TestModel",
            model_version="v1",
            model_url="https://example.com/model",
        )

        self.camera = Camera.objects.create(
            camera_name="Test camera",
            board_name="ESP32-CAM",
            location="Test location",
            address="192.168.100.1",
            resolution="1600x1200",
            process_image=True,
            confidence_threshold=0.3,
            user=self.owner,
            model=self.tf_model,
        )
        self.camera.admins.add(self.admin)

        tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
        tmp.write(b"FAKE-IMAGE-DATA")
        tmp.close()
        self.image_path = tmp.name

        self.storage = Storage.objects.create(
            path=self.image_path,
            camera_directory=self.camera.id,
        )

        self.image = ImageInfo.objects.create(
            filename="test.jpg",
            file_size=os.path.getsize(self.image_path),
            file_type="JPEG",
            resolution="1600x1200",
            timestamp=timezone.now(),
            is_processed=False,
            camera=self.camera,
            storage=self.storage,
            output=None,
            model=self.tf_model,
        )

    # removing test file after tests
    def tearDown(self):
        if os.path.exists(self.image_path):
            os.remove(self.image_path)

    # returning endpoint address with primary key
    def get_endpoint(self, pk=None):
        if pk is None:
            pk = self.image.id
        return reverse("api:image-info-get-image", args=[pk])

    def test_get_image_no_imageinfo(self):
        self.client.force_authenticate(user=self.owner)     # bypassing authentication


        response = self.client.get(self.get_endpoint(pk=99999), secure=True)    # setting HTTPS

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["success"], False)
        self.assertEqual(response.data["error"], "Image does not exist")

    def test_get_image_forbidden(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.get(self.get_endpoint(), secure=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.other_admin)

        response = self.client.get(self.get_endpoint(), secure=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_image_no_file(self):
        os.remove(self.image_path)

        self.client.force_authenticate(user=self.owner)

        response = self.client.get(self.get_endpoint(), secure=True)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["success"], False)
        self.assertEqual(response.data["error"], "Cannot find image")

    def test_get_image_success_owner(self):
        self.client.force_authenticate(user=self.owner)

        response = self.client.get(self.get_endpoint(), secure=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_image_success_admin(self):
        self.client.force_authenticate(user=self.owner)

        response = self.client.get(self.get_endpoint(), secure=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_image_success_sup(self):
        self.client.force_authenticate(user=self.owner)

        response = self.client.get(self.get_endpoint(), secure=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
