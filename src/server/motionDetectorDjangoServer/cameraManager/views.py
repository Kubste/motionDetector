from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from databaseApp.models import Camera
from .utils import save_file, save_file_metadata, get_client_ip, change_resolution
import json

# changing the camera resolution
@csrf_exempt
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
        return JsonResponse({"success": False, "error": "Invalid JSON data"})

    # getting camera address
    try:
        address = Camera.objects.get(id=camera_id).address
    except Camera.DoesNotExist:
        return JsonResponse({"success": False, "error": "Camera not found"})

    if not change_resolution(resolution, address):
        return JsonResponse({"success": False, "error": "Error while sending resolution change request"})

    return JsonResponse({"success": True})


# uploading new image to filesystem
@csrf_exempt
def upload_image(request):
    if request.method == "POST":
        try:
            ip_addr = get_client_ip(request)
            print(ip_addr, flush=True)      # debug info
            camera = Camera.objects.get(address=ip_addr)
        except Camera.DoesNotExist:
            return HttpResponse("Unknown camera", status=404)
        except Exception:
            return HttpResponse("Unknown error", status=500)

        # getting image data form request
        try:
            image_data = request.body
            if not image_data:
                return HttpResponse("No image data received", status=400)

            filename, filepath = save_file(request)             # saving image to filesystem
            save_file_metadata(filename, filepath, camera)      # saving image metadata to database
            return JsonResponse({"status": "ok", "filename": filename}, status=200)
        except Exception as e:
            print(f"Error: {e}")
            return HttpResponse("Internal server error", status=500)

    return HttpResponse("Invalid method", status=405)
