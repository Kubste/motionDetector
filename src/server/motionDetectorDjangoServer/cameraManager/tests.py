import os
import tempfile
import numpy as np
from unittest.mock import patch
from django.test import SimpleTestCase, RequestFactory
from .utils import detect_human, get_client_ip, save_file

# creating numpy array - fake "tensor"
class FakeTensor:
    arr: np.array

    def __init__(self, arr):
        self.arr = np.array(arr)

    # mocking numpy method to call in detect_human
    def numpy(self):
        return self.arr

class FakeModel:
    classes: list
    scores: list

    def __init__(self, classes, scores):
        self.classes = classes
        self.scores = scores

    # parameter input_tensor required by model function in TensorFlow library
    def __call__(self, input_tensor):
        return {
            "detection_classes": FakeTensor(self.classes),
            "detection_scores": FakeTensor(self.scores),
        }


class DetectHumanTests(SimpleTestCase):
    def run_tests(self, classes, scores, confidence, expected_count, expected_max):
        img = np.zeros((300, 300, 3), np.uint8)
        fake_model = FakeModel(classes, scores)

        with patch("tensorflow_hub.load", return_value=fake_model) as mock:
            count, max_score = detect_human(img, confidence, "fake_url")

            mock.assert_called_once_with("fake_url")    # testing if hub.load(model_url) was even called
            self.assertEqual(count, expected_count)
            self.assertAlmostEqual(max_score, expected_max)

    def test_detect_human_cases(self):
        cases = [
            {
                "classes": [[1, 1, 2]],
                "scores": [[0.9, 0.2, 0.8]],
                "confidence": 0.3,
                "expected_count": 1,
                "expected_max": 0.9
            },
            {
                "classes": [[1, 1]],
                "scores": [[0.3, 0.31]],
                "confidence": 0.3,
                "expected_count": 1,
                "expected_max": 0.31
            },
            {
                "classes": [[2, 3, 4]],
                "scores": [[0.9, 0.8, 0.7]],
                "confidence": 0.3,
                "expected_count": 0,
                "expected_max": 0.0
            },
            {
                "classes": [[1, 1, 2]],
                "scores": [[0.9, 1.1, 0.8]],
                "confidence": 0.3,
                "expected_count": 2,
                "expected_max": 1.0
            },
            {
                "classes": [[1, 1]],
                "scores": [[-0.1, 0.2]],
                "confidence": 0.3,
                "expected_count": 0,
                "expected_max": 0.0
            },
        ]

        for case in cases:
            with self.subTest():
                self.run_tests(case["classes"], case["scores"], case["confidence"], case["expected_count"], case["expected_max"])

class GetClientIPTests(SimpleTestCase):
    def setUp(self):
        self.request_factory = RequestFactory()

    def test_x_forwarded_for_last_ip(self):
        request = self.request_factory.get("/")
        request.META["HTTP_X_FORWARDED_FOR"] = "192.168.1.1, 192.168.2.2, 192.168.3.3"

        ip = get_client_ip(request)

        self.assertEqual(ip, "192.168.3.3")

    def test_x_forwarded_for_one_address(self):
        request = self.request_factory.get("/")
        request.META["HTTP_X_FORWARDED_FOR"] = "192.168.3.3"

        ip = get_client_ip(request)

        self.assertEqual(ip, "192.168.3.3")

    def test_get_remote_addr(self):
        request = self.request_factory.get("/")
        request.META["REMOTE_ADDR"] = "192.168.3.3"

        ip = get_client_ip(request)

        self.assertEqual(ip, "192.168.3.3")

class SaveFileTests(SimpleTestCase):
    def setUp(self):
        self.request_factory = RequestFactory()

    def test_save_file(self):
        camera_id = 999
        file_data = b"TEST-FILE-DATA"

        with tempfile.TemporaryDirectory() as tmpdir:
            with patch("cameraManager.utils.MEDIA_ROOT", tmpdir):
                request = self.request_factory.post("/", file_data, "image/jpeg")

                filename, filepath = save_file(request, camera_id)  # if file exists

                self.assertTrue(os.path.exists(filepath))

                expected_path = os.path.join(tmpdir, filepath)      # if file is in correct directory
                self.assertTrue(filepath.startswith(expected_path))

                expected_extension = ".jpg"                         # if extension is .jpeg
                self.assertTrue(filepath.endswith(expected_extension))

                with open(filepath, "rb") as file:                  # if file content is correct
                    content = file.read()
                self.assertEqual(content, file_data)