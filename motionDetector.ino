// libraries
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <ArduCAM.h>
#include <SPI.h>
#include <vector>

// configuration files
#include "memorysaver.h"
#include "config.h"

#define BMPIMAGEOFFSET 66

const int CS = 5;
bool is_header = false;
int mode = 0;
uint8_t start_capture = 0;
//uint8_t length = 0, width = 0;
uint8_t length = 160, width = 120;
std::vector<uint8_t> image_buffer;

ArduCAM myCAM(OV2640, CS);

uint8_t read_fifo_burst(ArduCAM myCAM) {
  uint8_t temp = 0, temp_last = 0;
  uint32_t buffer_length = 0;
  buffer_length = myCAM.read_fifo_length();

  if(buffer_length >= MAX_FIFO_SIZE) {
    Serial.println(F("ACK CMD Over size. END"));
    return 0;
  }

  if(buffer_length == 0 ) {
    Serial.println(F("ACK CMD Size is 0. END"));
    return 0;
  }

  myCAM.CS_LOW();
  myCAM.set_fifo_burst();//Set fifo burst mode
  temp =  SPI.transfer(0x00);
  buffer_length --;

  while(buffer_length--) {
    temp_last = temp;
    temp =  SPI.transfer(0x00);

    //if(is_header == true) Serial.write(temp);
    if(is_header == true) image_buffer.push_back(temp);
    else if((temp == 0xD8) & (temp_last == 0xFF)) {
      is_header = true;
      Serial.println(F("ACK IMG END"));
      image_buffer.push_back(temp_last);
      image_buffer.push_back(temp);
      // Serial.write(temp_last);
      // Serial.write(temp);
    }

    if((temp == 0xD9) && (temp_last == 0xFF))
    break;
    delayMicroseconds(15);
  }

  myCAM.CS_HIGH();
  is_header = false;
  return 1;
}

bool send_picture() {
  if(WiFi.status() != WL_CONNECTED) {
    Serial.println("Cannot connect to Wi-Fi");
    return false;
  }

  Serial.println("TestSend");

  HTTPClient client;
  client.begin(serverURL);
  client.addHeader("Content-Type", "image/jpeg");

  int response = client.POST(image_buffer.data(), image_buffer.size());

  if(response > 0) {
    Serial.println(String("HTTP Response code: " + response));
    client.end();
    return true;
  } else {
    Serial.println(String("HTTP error code: " + client.errorToString(response)));
    client.end();
    return false;
  }
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
      Serial.println(F("ACK CMD OV2640 detected. END"));break;
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
    Serial.println("Cannot conenct to Wi-Fi network");
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

      // clearing image_buffer
      image_buffer.clear();
      image_buffer.shrink_to_fit();

      //Start capture
      myCAM.start_capture();
      start_capture = 0;
      Serial.println("Test3");
    }

    delay(5000);

    if(myCAM.get_bit(ARDUCHIP_TRIG, CAP_DONE_MASK)) {
      Serial.println("Test4");
      Serial.println(F("ACK CMD CAM Capture Done. END"));
      delay(50);
      read_fifo_burst(myCAM);
      if(send_picture()) Serial.println("Picture sent");
      else {
        Serial.println("Error while sending picture");
      }
      //Clear the capture done flag
      myCAM.clear_fifo_flag();
    }
  }
}
