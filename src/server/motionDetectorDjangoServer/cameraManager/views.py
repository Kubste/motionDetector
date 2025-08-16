from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from databaseApp.models import Camera
from .utils import save_file, save_file_metadata, get_client_ip

@csrf_exempt
def upload_image(request):
    if request.method == "POST":
        try:
            ip_addr = get_client_ip(request)
            print(ip_addr, flush=True)
            camera = Camera.objects.get(address=ip_addr)
        except Camera.DoesNotExist:
            print("Unknown camera")
            return HttpResponse("Unknown camera", status=404)
        except Exception:
            print("Unknown error")
            return HttpResponse("Unknown error", status=500)

        try:
            image_data = request.body
            if not image_data:
                return HttpResponse("No image data received", status=400)

            filename, filepath = save_file(request)
            save_file_metadata(filename, filepath, camera)
            return JsonResponse({"status": "ok", "filename": filename}, status=200)
        except Exception as e:
            print(f"Error: {e}")
            return HttpResponse("Internal server error", status=500)

    return HttpResponse("Invalid method", status=405)
