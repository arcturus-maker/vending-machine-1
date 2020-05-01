// vend server / controller
//8 bytes max for mcp2515
#include <SPI.h>
#include "mcp_can.h"

// the cs pin of the version after v1.1 is default to D9
// v0.9b and v1.0 is default D10
const int SPI_CS_PIN = 10;
const int LED        = 2;
boolean ledON        = 1;

const int adlen = 10;
unsigned char DeviceID = 0x01;
unsigned char NetworkDevices[2][adlen]; // address, used, type
//unsigned char DeviceType[100];
int DeviceIndex = 0;

//unsigned char serverAddress = 0x01;
unsigned char deviceType = 0x01; // 0x for servers, 1x for motor drawer, 2x for inputs

MCP_CAN CAN(SPI_CS_PIN);                                    // Set CS pin

unsigned char stmp[8] = {0, 1, 0, 0, 0, 0, 0, 0}; // destination, device type, device command, unassigned  8 bytes max for mcp2515

void setup()
{
  Serial.begin(115200);
  pinMode(LED, OUTPUT);

  while (CAN_OK != CAN.begin(CAN_500KBPS))              // init can bus : baudrate = 500k
  {
    Serial.println("CAN BUS Shield init fail");
    Serial.println("Init CAN BUS Shield again");
    delay(100);
  }
  Serial.println("CAN BUS Shield init ok!");
}


void loop()
{
  unsigned char len = 0;
  unsigned char buf[8];

  if (CAN_MSGAVAIL == CAN.checkReceive())           // check if data coming
  {
    CAN.readMsgBuf(&len, buf);    // read data,  len: data length, buf: data buf

    unsigned char canId = CAN.getCanId();

    Serial.println("-----------------------------");
    Serial.println("get data from ID: ");
    Serial.println(canId);
    if (buf[2] = 0xff) {
      if (LogDevice(canId, buf[1]))
        Serial.println ("announce reccived and returned");
    }


  }
}

boolean LogDevice(unsigned char LcanId, unsigned char Ltype) // CAN address of device and device type to be stored.
{
  Serial.println ("entered log");
  for (int i = 0; i < adlen; i++) {
    if (!NetworkDevices[1][i]) {
      NetworkDevices[1][i] = 1;
      NetworkDevices[0][i] = LcanId;
      NetworkDevices[2][i] = Ltype;
      //unsigned char Rstmp[3] = {LcanId, DeviceID, 0x7f};
            stmp[0] = LcanId;
            stmp[1] = DeviceID;
            stmp[2] = 0x7f;
      CAN.sendMsgBuf(0x01, 0, 8, stmp);
      return 1;
    }
    else {
      Serial.print ("no more address space");
      return 0;
    }
  }
}
//END FILE
