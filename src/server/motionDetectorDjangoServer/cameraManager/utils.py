import os
import requests
import smtplib, ssl
import tensorflow as tf
import tensorflow_hub as hub
import cv2
from email.mime.text import MIMEText
from decouple import config
from datetime import datetime
from databaseApp.models import ImageInfo, Storage, Camera, TensorFlowOutput, TensorFlowModel
from auth_manager.models import User
from motionDetectorDjangoServer.settings import UPLOAD_FOLDER
from PIL import Image
from django.utils import timezone

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
def save_file(request, camera_id):
    os.makedirs(os.path.join(UPLOAD_FOLDER, str(camera_id)), exist_ok=True)
    image_data = request.body
    filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".jpg"
    filepath = os.path.join(UPLOAD_FOLDER, str(camera_id), filename)

    with open(filepath, "wb") as f:
        f.write(image_data)

    return filename, filepath

# saving image file metadata to database
def save_file_metadata(filename, filepath, camera, output, camera_directory):
    with Image.open(filepath) as img:
        width, height = img.size
        file_type = img.format

    resolution = f"{width}x{height}"
    file_size = os.path.getsize(filepath)

    storage = Storage.objects.create(
        path=filepath,
        camera_directory=camera_directory,
    )

    if output is not None:
        is_processed = True
    else:
        is_processed = False

    image_info = ImageInfo.objects.create(
        filename=filename,
        file_size=file_size,
        file_type=file_type,
        resolution=resolution,
        timestamp=timezone.now(),
        is_processed=is_processed,
        camera=camera,
        output=output,
        storage=storage,
        model=camera.model,
    )

    return image_info

def get_emails(camera):
    admins_emails = camera.admins.all().values_list('email', flat=True)
    superusers_emails = User.objects.filter(is_superuser=True).all().values_list('email', flat=True)

    return list(admins_emails) + list(superusers_emails)

def send_email(user_email, camera, confidence, model, location, detected_people, is_processed):
    emails = list(set([user_email] + get_emails(camera)))     # user email, admins of camera emails and superusers emails - distinct if user is also an admin or superuser

    if is_processed:
        EMAIL_BODY =    f"""WARNING!!!
Motion has been detected from camera: {camera.id} located at: {location}!
Event confidence: {confidence} processed by model: {model}.
People detected on photo: {detected_people}.
Please check your account immediately"""

    else:
        EMAIL_BODY = f"""WARNING!!!
Motion has been detected from camera: {camera.id} located at: {location}!
Please check your account immediately"""

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL(config('EMAIL_SERVER'), int(config('EMAIL_PORT')), context=context) as server:
            server.login(config('EMAIL'), config('PASSWORD'))

            # sending each email separately - users will not see each other mail addresses
            for email in emails:
                msg = MIMEText(EMAIL_BODY, "plain")
                msg['Subject'] = config('EMAIL_SUBJECT')
                msg['From'] = config('EMAIL')
                msg['To'] = email
                server.sendmail(config('EMAIL'), email, msg.as_string())

    except Exception as e:
        print(f"Error: {e}", flush=True)

def detect_human(img, confidence, model_url):
    # model will be cached locally after first download
    model = hub.load(model_url)

    # converting given image to TensorFlow tensor
    input_tensor = tf.convert_to_tensor(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), dtype=tf.uint8)   # converting image to RGB before converting to tensor
    input_tensor = tf.expand_dims(input_tensor, 0)

    # detecting objects classes
    results = model(input_tensor)
    classes = results["detection_classes"].numpy()[0]
    scores = results["detection_scores"].numpy()[0]

    # counting people
    counter = 0
    max_score = 0
    for cls, score in zip(classes, scores):         # enumerating each detected object
        if int(cls) == 1 and score > confidence:    # checking if object is a human and model is confident enough
            counter += 1
            if score > max_score:
                max_score = score

    return counter, max_score

def save_tensor_flow_output(confidence, counter):

    tensorflow_output = TensorFlowOutput.objects.create(
        confidence=confidence,
        person_count=counter,
    )

    return tensorflow_output
