// libraries
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <ArduCAM.h>
#include <SPI.h>

// configuration files
#include "memorysaver.h"
#include "config.h"

#define BMPIMAGEOFFSET 66
#define CHUNK_SIZE 4096

const int CS = 5;
bool is_header = false;
int mode = 0;
uint8_t start_capture = 0;
//uint8_t length = 0, width = 0;
uint8_t length = 160, width = 120;
uint8_t chunk_buffer[CHUNK_SIZE];

ArduCAM myCAM(OV2640, CS);

void read_chunk(uint8_t bytes_to_read) {
  for(uint16_t i = 0; i < bytes_to_read; i++) {
    chunk_buffer[i] = SPI.transfer(0x00);
    delayMicroseconds(15);
  }
}

bool send_image(String endpoint) {
  int len = myCAM.read_fifo_length();

  if(len >= MAX_FIFO_SIZE) {
    Serial.println(F("ACK CMD Over size. END"));
    return false;
  }

  if(len == 0 ) {
    Serial.println(F("ACK CMD Size is 0. END"));
    return false;
  }

  Serial.println(String("Image size: " + String(len) + " bytes"));

  HTTPClient http;
  http.begin(String(serverURL) + "/" + String(uploadEndpoint));
  http.addHeader("Content-Type", "image/jpeg");
  http.addHeader("Content-Length", String(len));

  int httpCode = http.sendRequest("POST");
  if(httpCode <= 0) {
    Serial.println("HTTP begin failed: " +  String(http.errorToString(httpCode).c_str()));
    return false;
  }

  WiFiClient* stream = http.getStreamPtr();

  myCAM.CS_LOW();
  myCAM.set_fifo_burst();//Set fifo burst mode

  while(len > 0) {
    uint16_t bytesToRead = min(CHUNK_SIZE, len);
    read_chunk(bytesToRead);
    stream->write(chunk_buffer, bytesToRead);
    len -= bytesToRead;
  }

  myCAM.CS_HIGH();

  http.end();
  Serial.println("Image sent successfully");
  return true;
}


void setup() {
  pinMode(CS, OUTPUT);
  digitalWrite(CS, HIGH);

  //        sck miso mosi ss
  //SPI.begin(14, 12, 13, 15);    // changed to HSPI pins to avoid conflicts with WiFi library
  SPI.begin();

  uint8_t vid, pid;
  uint8_t temp;

  #if defined(__SAM3X8E__)
    Wire1.begin();
    Serial.begin(115200);
  #else
    Wire.begin();
    Serial.begin(921600);
  #endif
  Serial.println(F("ACK CMD ArduCAM Start! END"));

  myCAM.write_reg(0x07, 0x80);
  delay(100);
  myCAM.write_reg(0x07, 0x00);
  delay(100);

  while(1){
  //Check if the ArduCAM SPI bus is OK
    myCAM.write_reg(ARDUCHIP_TEST1, 0x55);
    temp = myCAM.read_reg(ARDUCHIP_TEST1);
    if (temp != 0x55){
      Serial.println(F("ACK CMD SPI interface Error! END"));
      delay(1000);continue;
    } else {
      Serial.println(F("ACK CMD SPI interface OK. END"));break;
    }
  }

  while(1){
    //Check if the camera module type is OV2640
    myCAM.wrSensorReg8_8(0xff, 0x01);
    myCAM.rdSensorReg8_8(OV2640_CHIPID_HIGH, &vid);
    myCAM.rdSensorReg8_8(OV2640_CHIPID_LOW, &pid);
    if ((vid != 0x26 ) && (( pid != 0x41 ) || ( pid != 0x42 ))){
      Serial.println(F("ACK CMD Can't find OV2640 module! END"));
      delay(1000);continue;
    } else {
      Serial.println(F("ACK CMD OV2640 detected. END")); break;
    } 
  }

  myCAM.set_format(JPEG);
  myCAM.InitCAM();
  myCAM.OV2640_set_JPEG_size(OV2640_1600x1200);
  delay(1000);
  myCAM.clear_fifo_flag();

  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Cannot connect to Wi-Fi network");
  }
  Serial.println("Connected to Wi-FI network");
}

void loop() {
  uint8_t temp = 0xff, temp_last = 0;
  bool is_header = false;
  Serial.println("Test1");

  //if(Serial.available()) {
    //temp = Serial.read();
    temp = 0x10;
    Serial.println("Test2");

    switch(temp) {
      case 0x10:
        mode = 1;
        temp = 0xff;
        start_capture = 1;
        Serial.println(F("ACK CMD CAM start single shoot. END"));
        break;

      case 0x01:
        myCAM.OV2640_set_JPEG_size(OV2640_160x120);
        length = 160;
        width = 120;
        break;

      case 0x02:
        myCAM.OV2640_set_JPEG_size(OV2640_176x144);
        length = 176;
        width = 144;
        break;

      case 0x03:
        myCAM.OV2640_set_JPEG_size(OV2640_320x240);
        length = 320;
        width = 240;
        break;

      case 0x04:
        myCAM.OV2640_set_JPEG_size(OV2640_352x288);
        length = 352;
        width = 288;
        break;

      case 0x05:
        myCAM.OV2640_set_JPEG_size(OV2640_640x480);
        length = 640;
        width = 480;
        break;

      case 0x06:
        myCAM.OV2640_set_JPEG_size(OV2640_800x600);
        length = 800;
        width = 600;
        break;

      case 0x07:
        myCAM.OV2640_set_JPEG_size(OV2640_1024x768);
        length = 1024;
        width = 768;
        break;

      case 0x08:
        myCAM.OV2640_set_JPEG_size(OV2640_1280x1024);
        length = 1280;
        width = 1024;
        break;

      case 0x09:
        myCAM.OV2640_set_JPEG_size(OV2640_1600x1200);
        length = 1600;
        width = 1200;
        break;
    }
  //}

  if(mode == 1) {
    if(start_capture == 1) {
      myCAM.flush_fifo();
      myCAM.clear_fifo_flag();

      //Start capture
      myCAM.start_capture();
      start_capture = 0;
      Serial.println("Test3");
    }

    if(myCAM.get_bit(ARDUCHIP_TRIG, CAP_DONE_MASK)) {
      Serial.println("Test4");
      Serial.println(F("ACK CMD CAM Capture Done. END"));
      delay(50);
      //read_fifo_burst(myCAM);
      if(send_image(uploadEndpoint)) Serial.println("Image was sent");
      else Serial.println("Error while sending image");
      //Clear the capture done flag
      myCAM.clear_fifo_flag();
    }
  }
  delay(5000);
}