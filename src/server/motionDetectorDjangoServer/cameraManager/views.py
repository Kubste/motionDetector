import cv2
import json
import numpy as np
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from databaseApp.models import Camera
from auth_manager.models import User
from .utils import save_file, save_file_metadata, get_client_ip, change_resolution, send_email, detect_human, save_tensor_flow_output
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from knox.auth import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


# changing the camera resolution
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_camera_resolution(request):
    # getting POST request from frontend
    if request.method != "POST":
        return Response({"success": False, "error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    # getting data from JSON
    try:
        data = json.loads(request.body)
        camera_id = data.get("camera_id")
        resolution = data.get("resolution")
    except json.JSONDecodeError:
        return Response({"success": False, "error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)

    # getting camera address
    try:
        camera = Camera.objects.get(id=camera_id)
        address = camera.address
        camera.resolution = resolution
        camera.save()
    except Camera.DoesNotExist:
        return Response({"success": False, "error": "Camera not found"}, status=status.HTTP_404_NOT_FOUND)

    if not change_resolution(resolution, address):
        return Response({"success": False, "error": "Error while sending resolution change request"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response({"success": True}, status=status.HTTP_200_OK)


# uploading new image to filesystem
@csrf_exempt
@require_POST
def upload_image(request):
    try:
        ip_addr = get_client_ip(request)
        print(f"Request from: {ip_addr}", flush=True)      # debug info
        camera = Camera.objects.get(address=ip_addr)
        user = User.objects.get(id=camera.user_id)
    except Camera.DoesNotExist:
        return JsonResponse({"success": False, "error": "Unknown camera"}, status=404)
    except Exception:
        return JsonResponse({"success": False, "error": "Unknown error"}, status=500)

    # getting image data form request
    try:
        image_data = request.body
        if not image_data:
            return JsonResponse({"success": False, "error": "No image data received"}, status=400)

        img = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)     # decoding image to analyse using TensorFlow from request

        if img is None:
            return JsonResponse({"success": False, "error": "Invalid image data received"}, status=400)

        if camera.process_image:
            detected_people, confidence = detect_human(img, camera.confidence_threshold, camera.model.model_url)   # detecting how many people has been detected on image

            if detected_people >= 1:
                filename, filepath = save_file(request, camera.id)                                  # saving image to filesystem
                print(f"Image saved: {filepath}", flush=True)                                       # debug info
                output = save_tensor_flow_output(confidence, detected_people)                       # saving TensorFlow output for an image
                save_file_metadata(filename, filepath, camera, output, camera.id)                   # saving image metadata to database
                send_email(user.email, camera, confidence, camera.model.model_name, camera.location, detected_people, True)   # sending email to user
            else:
                print("Image not saved - too low confidence", flush=True)                           # debug info
                return JsonResponse({"success": False, "error": "Image not saved - too low confidence"}, status=422)    # Unprocessable Content HTTP code

        else:
            filename, filepath = save_file(request, camera.id)                                  # saving image to filesystem
            print(f"Image saved: {filepath}", flush=True)                                       # debug info
            save_file_metadata(filename, filepath, camera, None, camera.id)              # saving image metadata to database
            send_email(user.email, camera, None, None, camera.location, None, False)  # sending email to user

        return JsonResponse({"success": True, "filename": filename}, status=200)
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({"success": False, "error": "Internal server error"}, status=500)
