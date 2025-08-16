from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import save_file

@csrf_exempt
def upload_image(request):
    if request.method == "POST":
        try:
            image_data = request.body
            if not image_data:
                return HttpResponse("No image data received", status=400)

            filename = save_file(image_data)
            return JsonResponse({"status": "ok", "filename": filename}, status=200)
        except Exception as e:
            print(f"Error: {e}")
            return HttpResponse("Internal server error", status=500)

    return HttpResponse("Invalid method", status=405)
