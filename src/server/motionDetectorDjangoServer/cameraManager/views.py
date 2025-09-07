from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from databaseApp.models import Camera
from .utils import save_file, save_file_metadata, get_client_ip, change_resolution
import json

# changing the camera resolution
def change_camera_resolution(request):
    # getting POST request from frontend
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)

    # getting data from JSON
    try:
        data = json.loads(request.body)
        camera_id = data.get("camera_id")
        resolution = data.get("resolution")
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON data"}, status=400)

    # getting camera address
    try:
        address = Camera.objects.get(id=camera_id).address
    except Camera.DoesNotExist:
        return JsonResponse({"success": False, "error": "Camera not found"}, status=404)

    if not change_resolution(resolution, address):
        return JsonResponse({"success": False, "error": "Error while sending resolution change request"}, status=503)

    return JsonResponse({"success": True}, status=200)


# uploading new image to filesystem
@csrf_exempt
@require_POST
def upload_image(request):
    try:
        ip_addr = get_client_ip(request)
        print(ip_addr, flush=True)      # debug info
        camera = Camera.objects.get(address=ip_addr)
    except Camera.DoesNotExist:
        return JsonResponse({"success": False, "error": "Unknown camera"}, status=404)
    except Exception:
        return JsonResponse({"success": False, "error": "Unknown error"}, status=500)

    # getting image data form request
    try:
        image_data = request.body
        if not image_data:
            return JsonResponse({"success": False, "error": "No image data received"}, status=400)

        filename, filepath = save_file(request, camera.user_id)         # saving image to filesystem
        save_file_metadata(filename, filepath, camera)                  # saving image metadata to database
        return JsonResponse({"success": True, "filename": filename}, status=200)
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({"success": False, "error": "Internal server error"}, status=500)
