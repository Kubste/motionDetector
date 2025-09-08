import os
import requests
import smtplib, ssl
from email.mime.text import MIMEText
from decouple import config
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
def save_file(request, user_id):
    os.makedirs(os.path.join(UPLOAD_FOLDER, str(user_id)), exist_ok=True)
    image_data = request.body
    filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".jpg"
    filepath = os.path.join(UPLOAD_FOLDER, str(user_id), filename)

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
        file_size=file_size,
        file_type=file_type,
        resolution=resolution,
        timestamp=datetime.now(),
        camera=camera
    )

    Storage.objects.create(
        path=filepath,
        checksum="",    # to be implemented later
        image_info=image_info
    )

def send_email(user_email, camera_id, location):
    EMAIL_SUBJECT = "Motion detected"
    EMAIL_BODY =    f"""WARNING!!!
Motion has been detected from camera: {camera_id} located at: {location}!
Please check your account immediately"""

    msg = MIMEText(EMAIL_BODY, "plain")
    msg['Subject'] = EMAIL_SUBJECT
    msg['From'] = config('EMAIL')
    msg['To'] = user_email

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL(config('EMAIL_SERVER'), int(config('EMAIL_PORT')), context=context) as server:
            server.login(config('EMAIL'), config('PASSWORD'))
            server.sendmail(config('EMAIL'), user_email, msg.as_string())
    except Exception as e:
        print(f"Error: {e}", flush=True)


