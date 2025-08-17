import os
import requests
from datetime import datetime
from databaseApp.models import ImageInfo, Storage, Camera
from motionDetectorDjangoServer.settings import UPLOAD_FOLDER
from PIL import Image

# sending request to change camera resolution
def change_resolution(resolution, address):
    url = f"http://{address}/set_resolution"

    try:
        # Send GET request with resolution parameter - POST would be more proper, but it would require JSON deserialization on ESP32 side - another not build in library
        response = requests.get(url, params={"res": resolution}, timeout=5)
        response.raise_for_status()     # will throw exception if response status is different from 2XX
    except requests.RequestException as e:
        print(f"Error: {e}")
        return False

    return True

# getting ip address where request came from
def get_client_ip(request):
    req_headers = request.META
    x_forwarded_for_value = req_headers.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for_value:
        ip_addr = x_forwarded_for_value.split(',')[-1].strip()
    else:
        ip_addr = req_headers.get('REMOTE_ADDR')
    return ip_addr

# saving image file to filesystem
def save_file(request):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    image_data = request.body
    filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as f:
        f.write(image_data)

    print(f"Image saved: {filepath}")
    return filename, filepath

# saving image file metadata to database
def save_file_metadata(filename, filepath, camera):
    with Image.open(filepath) as img:
        width, height = img.size
        file_type = img.format

    resolution = f"{width}x{height}"
    file_size = os.path.getsize(filepath)

    image_info = ImageInfo.objects.create(
        filename=filename,
        fileSize=file_size,
        fileType=file_type,
        resolution=resolution,
        timestamp=datetime.now(),
        camera=camera
    )

    Storage.objects.create(
        path=filepath,
        checksum="",    # to be implemented later
        imageInfo=image_info
    )
