import serial
import time

serial = serial.Serial('/dev/ttyUSB0', 921600, timeout=2)
time.sleep(2)

serial.write(b'\x10')
print("Wysłano komendę 0x10 do kamery")

image_data = bytearray()
capture_started = False

while True:
    byte = serial.read(1)
    if not byte:
        break

    if not capture_started:
        if byte == b'\xFF':
            next_byte = serial.read(1)
            if next_byte == b'\xD8':  # JPEG start
                image_data += b'\xFF\xD8'
                capture_started = True
    else:
        image_data += byte
        if image_data[-2:] == b'\xFF\xD9':  # JPEG end
            break

with open("photo.jpg", "wb") as f:
    f.write(image_data)

print("Zapisano zdjęcie jako photo.jpg")
