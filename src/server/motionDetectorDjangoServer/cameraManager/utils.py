import os
from datetime import datetime
from motionDetectorDjangoServer.settings import UPLOAD_FOLDER

def save_file(image_data):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as f:
        f.write(image_data)

    print(f"Image saved: {filepath}")
    return filename