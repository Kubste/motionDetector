#include <Wire.h>
#include <ArduCAM.h>
#include <SPI.h>
#include "memorysaver.h"

#define BMPIMAGEOFFSET 66

const int CS = 5;
bool is_header = false;
int mode = 0;
uint8_t start_capture = 0;

ArduCAM myCAM(OV2640, CS);

uint8_t read_fifo_burst(ArduCAM myCAM) {
    uint8_t temp = 0, temp_last = 0;
    uint32_t length = 0;
    length = myCAM.read_fifo_length();
    Serial.println(length, DEC);
    if(length >= MAX_FIFO_SIZE) {
      Serial.println(F("ACK CMD Over size. END"));
      return 0;
    }
    if(length == 0 ) {
      Serial.println(F("ACK CMD Size is 0. END"));
      return 0;
    }
    myCAM.CS_LOW();
    myCAM.set_fifo_burst();//Set fifo burst mode
    temp =  SPI.transfer(0x00);
    length --;
    while(length--) {
      temp_last = temp;
      temp =  SPI.transfer(0x00);
      if (is_header == true) Serial.write(temp);
      else if ((temp == 0xD8) & (temp_last == 0xFF)) {
        is_header = true;
        Serial.println(F("ACK IMG END"));
        Serial.write(temp_last);
        Serial.write(temp);
      }
      if((temp == 0xD9) && (temp_last == 0xFF))
      break;
      delayMicroseconds(15);
    }
    myCAM.CS_HIGH();
    is_header = false;
    return 1;
  }

void setup() {
  pinMode(CS, OUTPUT);
  digitalWrite(CS, HIGH);

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
}

void loop() {
  uint8_t temp = 0xff, temp_last = 0;
  bool is_header = false;

  if(Serial.available()) {
    temp = Serial.read();
    if(temp == 0x10) {
      mode = 1;
      temp = 0xff;
      start_capture = 1;
      Serial.println(F("ACK CMD CAM start single shoot. END"));
    }
  }

  if(mode == 1) {
    if(start_capture == 1) {
      myCAM.flush_fifo();
      myCAM.clear_fifo_flag();
      //Start capture
      myCAM.start_capture();
      start_capture = 0;
    }
    if(myCAM.get_bit(ARDUCHIP_TRIG, CAP_DONE_MASK)) {
      Serial.println(F("ACK CMD CAM Capture Done. END"));
      delay(50);
      read_fifo_burst(myCAM);
      //Clear the capture done flag
      myCAM.clear_fifo_flag();
    }
  } 
}
