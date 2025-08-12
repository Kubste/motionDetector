import requests

# Change these to match your ESP32's IP and desired resolution
ESP32_IP = "192.168.100.25"     # Replace with your ESP32's IP
RESOLUTION = "1600x1200"          # One of: 160x120, 176x144, 320x240, 640x480, 800x600, 1024x768, 1280x1024, 1600x1200

url = f"http://{ESP32_IP}/set_resolution"

try:
    # Send GET request with resolution parameter
    response = requests.get(url, params={"res": RESOLUTION}, timeout=5)
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.text}")
except requests.RequestException as e:
    print(f"Error: {e}")
