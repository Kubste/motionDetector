import serial
import time
import subprocess

serial = serial.Serial('/dev/ttyUSB0', 921600, timeout=2)
time.sleep(2)

print("Dostepne rozdzielczosci: ")
print("1. 160x120\n2. 176x144\n3. 320x240\n4. 352x288\n5. 640x480\n6. 800x600\n7. 1024x768\n8. 1280x1024\n9. 1600x1200")
val = input("Wybierz rozdzielczosc: ")

#sending command to set size
serial.write(int(val).to_bytes(1, 'big'))
# sending command to start taking picture
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

print("Zapisano zdjęcie")

subprocess.run(["eog", "photo.jpg"])
