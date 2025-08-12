from flask import Flask, request
import os
from datetime import datetime

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        # Save incoming raw data as a file
        image_data = request.data
        if not image_data:
            return "No image data received", 400

        filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        with open(filepath, "wb") as f:
            f.write(image_data)

        print(f"Image saved: {filepath}")
        return "Image received", 200
    except Exception as e:
        print(f"Error: {e}")
        return "Internal server error", 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)