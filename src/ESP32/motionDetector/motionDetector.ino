// libraries
#include <WiFi.h>
#include <HTTPClient.h>
//#include <WebServer.h>
#include <ESPWebServerSecure.hpp>
#include <Wire.h>
#include <ArduCAM.h>
#include <SPI.h>
#include <WiFiClientSecure.h>

// configuration files
#include "memorysaver.h"
#include "config.h"

// HTTPS server cert and key
#include "cert.h"
#include "private_key.h"

#define BMPIMAGEOFFSET 66

bool is_header = false;
int mode = 0;
uint8_t start_capture = 0;
uint8_t chunk_buffer[CHUNK_SIZE];   // image chunk buffer

volatile bool motionDetected = false;
volatile unsigned long lastCaptured;

ArduCAM myCAM(OV2640, CS);
ESPWebServerSecure server(443);

// function to send image chunks to the server
bool send_image() {
  // can overflow int
  uint32_t len = myCAM.read_fifo_length();

  //checking fifo length
  if(len >= MAX_FIFO_SIZE) {
    Serial.println(F("ACK CMD Over size. END"));
    return false;
  }

  if(len == 0 ) {
    Serial.println(F("ACK CMD Size is 0. END"));
    return false;
  }

  // checking connection to server
  WiFiClientSecure client;
  // client.setInsecure();
  client.setCACert(rootCA);

  if(!client.connect(serverHost, serverPort)) {
    Serial.println(F("TCP connect failed"));
    return false;
  }

  // building HTTP request
  client.printf("POST %s HTTP/1.1\r\n", uploadEndpoint);  // HTTP server endpoint address
  client.printf("Host: %s\r\n", serverHost);              // server address
  client.println("Content-Type: image/jpeg");             // JPEG image
  client.printf("Content-Length: %u\r\n", len);           // length of an image
  client.println("Connection: close");                    // instructs the server to close TCP connection after receiving image data
  client.println();                                       // end of header

  // sending image body chunks
  myCAM.CS_LOW();
  myCAM.set_fifo_burst();

  while(len > 0) {
    int n = min(CHUNK_SIZE, int(len));      // chunk size - the last one might be smaller
    for(int i = 0; i < n; i++) chunk_buffer[i] = SPI.transfer(0x00);
    client.write(chunk_buffer, n);          // sending image chunks
    len -= n;
  }
  myCAM.CS_HIGH();

  // debugging info
  while(client.connected() || client.available()) if(client.available()) Serial.write(client.read());
  
  client.stop();
  Serial.println(F("Image sent successfully"));
  return true;
}

// function to set the camera resolution
void setResolution() {

  if(server.hasArg("res_token")) {
    String token = server.arg("res_token");
    if(token != resToken) {
      Serial.println("Wrong token: ");
      Serial.println(token);
      server.send(403, "text/plain", "Invalid token");
    }
  }
  
  if(server.hasArg("res")) {
    String res = server.arg("res");

    // generally switch would be better, but string cannot be directly used in C++ switch - helping function needed
    if(res == "160x120") myCAM.OV2640_set_JPEG_size(OV2640_160x120); 
    else if(res == "176x144") myCAM.OV2640_set_JPEG_size(OV2640_176x144);
    else if(res == "320x240") myCAM.OV2640_set_JPEG_size(OV2640_320x240);
    else if(res == "640x480") myCAM.OV2640_set_JPEG_size(OV2640_640x480);
    else if(res == "800x600") myCAM.OV2640_set_JPEG_size(OV2640_800x600);
    else if(res == "1024x768") myCAM.OV2640_set_JPEG_size(OV2640_1024x768);
    else if(res == "1280x1024") myCAM.OV2640_set_JPEG_size(OV2640_1280x1024);
    else if(res == "1600x1200") myCAM.OV2640_set_JPEG_size(OV2640_1600x1200);
    else {
      server.send(400, "text/plain", "Invalid resolution");
      return;
    }
    Serial.println(String("Resolution changed to: " + res));

    server.send(200, "text/plain", "Resolution set to " + res);
  } else server.send(400, "text/plain", "No resolution parameter");
}

// function that will be call by interrupt - IRAM_ATTR - put function code in RAM not flash memory
// using micros() instead of millis() because millis() should not be used in interrupt functions
void IRAM_ATTR detectMotion() {
  if(micros() - lastCaptured > CAPTURE_TIMEOUT * 1000000) {
    motionDetected = true;
    lastCaptured = micros();
  }
}

void setup() {
  pinMode(CS, OUTPUT);
  pinMode(PIR_PIN, INPUT);
  digitalWrite(CS, HIGH);

  attachInterrupt(digitalPinToInterrupt(PIR_PIN), detectMotion, RISING);

  #if defined(__SAM3X8E__)
    Wire1.begin();
    Serial.begin(115200);
  #else
    Wire.begin();
    Serial.begin(921600);
  #endif
  Serial.println(F("ACK CMD ArduCAM Start! END"));

  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Cannot connect to Wi-Fi network");
  }
  Serial.println("Connected to Wi-FI network");
  Serial.print("ESP32 IP address: ");
  Serial.println(WiFi.localIP());

  server.setServerKeyAndCert(
              example_key_DER,          // Raw DER key data as byte array
              example_key_DER_len,      // Length of the key array
              example_crt_DER,          // Raw DER certificate (no certificate chain!) as byte array
              example_crt_DER_len       // Length of the certificate array
          );

  // setting up HTTP server to receive requests to change camera resolution
  server.on("/set_resolution", setResolution);
  server.begin();
  Serial.println("HTTPS server started");

  //        sck miso mosi ss
  //SPI.begin(14, 12, 13, 15);    // changed to HSPI pins to avoid conflicts with WiFi library
  SPI.begin();

  uint8_t vid, pid;
  uint8_t temp;

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
    if((vid != 0x26 ) && (( pid != 0x41 ) || ( pid != 0x42 ))) {
      Serial.println(F("ACK CMD Can't find OV2640 module! END"));
      delay(1000);continue;
    } else Serial.println(F("ACK CMD OV2640 detected. END")); break;
  }

  myCAM.set_format(JPEG);
  myCAM.InitCAM();
  myCAM.OV2640_set_JPEG_size(OV2640_1600x1200);
  delay(1000);
  myCAM.clear_fifo_flag();

  lastCaptured = micros();
}

void loop() {
  //receiving setResolution()
  server.handleClient();

  is_header = false;

  if(motionDetected) {
    mode = 1;
    start_capture = 1;
    Serial.println(F("ACK CMD CAM start single shoot. END"));

    motionDetected = false;
  } 
  
  if(mode == 1) {
    if(start_capture == 1) {
      myCAM.flush_fifo();
      myCAM.clear_fifo_flag();

      //Start capture
      myCAM.start_capture();
      start_capture = 0;
    }
    delay(1000);
    if(myCAM.get_bit(ARDUCHIP_TRIG, CAP_DONE_MASK)) {
      Serial.println(F("ACK CMD CAM Capture Done. END"));
      delay(50);
      //read_fifo_burst(myCAM);
      if(send_image()) Serial.println("Image was sent");
      else Serial.println("Error while sending image");
      //Clear the capture done flag
      myCAM.clear_fifo_flag();
    }
  }
}