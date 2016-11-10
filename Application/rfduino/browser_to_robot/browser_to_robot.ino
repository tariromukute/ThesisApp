/*
The sketch using a custom 128 bit UUID for
the RFduino service and characteristics.

Given a service UUID : c97433f0-be8f-4dc8-b6f0-5343e6100eb4 it follows that :
The read UUID : c97433f1-be8f-4dc8-b6f0-5343e6100eb4 => customUUID + 1 <--> check where 1 is added 
The write UUID : c97433f2-be8f-4dc8-b6f0-5343e6100eb4 => customUUID + 2 <--> check where 2 is added
The disconnect UUID : c97433f3-be8f-4dc8-b6f0-5343e6100eb4 => customUUID + 3 <--> check where 3 is added

Once the data is received via bluetooth, it
is assigned to variables, 

The data is then transfered to the robot via
I2C on request by the robot (I2C master)

using default I2C pins, according to documentation
http://www.rfduino.com/wp-content/uploads/2014/03/rfduino.ble_.programming.reference.pdf
  SCL -> pin 5
  SDA -> pin 6
 
*/

/*
 Copyright (c) 2014 OpenSourceRF.com.  All right reserved.

 This library is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.

 This library is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 See the GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with this library; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

#include <RFduinoBLE.h>
#include <Wire.h>

// pin 3 on the RGB shield is the green led
// (shows when the RFduino is advertising or not)
int i2c_led = 3;
int ble_led = 4;

// pin 2 on the RGB shield is the red led
// (goes on when the RFduino has a connection from the iPhone, and goes off on disconnect)
int connection_led = 2;

int i = 0;
uint8_t buff[2];
uint8_t instruction[1];
uint32_t temp[10];

bool busy = false;

void setup() {

  //initialise I2C 
  Wire.beginTransmission(0x04);
  Wire.onRequest(i2c_request_event);
  Wire.onReceive(i2c_receive_event);
  
  Serial.begin(9600);
  Serial.println("RFduino example started");
  Serial.println("Serial rate set to 9600 baud");

  buff[0] = 0;
  buff[1] = 0;
  
  // led used to indicating advertising before connection, and bluetooth transfer after connection
  pinMode(ble_led, OUTPUT);

  // led to indicate when i2c is servicing request_event or receive_event
  pinMode(i2c_led, OUTPUT);
  
  // led used to indicate that the RFduino is connected
  pinMode(connection_led, OUTPUT);

  // 128 bit base uuid
  // (generated with http://www.uuidgenerator.net)
  RFduinoBLE.customUUID = "c97433f0-be8f-4dc8-b6f0-5343e6100eb4";
 
  // start the BLE stack
  RFduinoBLE.begin();
}

void loop() {
  // switch to lower power mode
  RFduino_ULPDelay(SECONDS(2));
  RFduinoBLE.sendInt(i);
}

void RFduinoBLE_onAdvertisement(bool start)
{
  // turn the green led on if we start advertisement, and turn it
  // off if we stop advertisement
  
  if (start)
    digitalWrite(ble_led, HIGH);
  else
    digitalWrite(ble_led, LOW);
}

void RFduinoBLE_onConnect()
{
  digitalWrite(connection_led, HIGH);
}

void RFduinoBLE_onDisconnect()
{
  digitalWrite(connection_led, LOW);
}

void RFduinoBLE_onReceive(char *data, int len) {
  // each transmission should contain an RGB triple
  while(busy)
    RFduino_ULPDelay(5);

  digitalWrite(ble_led, HIGH);
  busy = true;
  if (len >= 0)
  {
    buff[0] = data[0]; // velocity
    buff[1] = data[1]; // angle
    Serial.println(i);
  }
  if(i > 9){
    while(i > 0){
      Serial.println(temp[i])
      i--;
    }
  }
  busy = false;
  digitalWrite(ble_led, LOW);
}

void i2c_receive_event(int bytesIn){
  while(busy)
    RFduino_ULPDelay(5);
  int read_byte = 0;
  busy = true;
  digitalWrite(i2c_led, HIGH);
  read_byte = bytesIn;
  int byte_count = 0;
  while(1 < Wire.available()) // loop through all but the last
  {
    read_byte = Wire.read(); 
    
    instruction[byte_count] = read_byte;
    
    byte_count++;
  }
  int x = Wire.read(); 
  // Read the last dummy byte (has no meaning, but must read it)

  busy = false;
  digitalWrite(i2c_led, LOW);
}

void i2c_request_event(){
  while(busy)
    RFduino_ULPDelay(5);

  digitalWrite(i2c_led, HIGH);
  busy = true;
  if(instruction[0] == 1){
    Wire.write(buff, 2);
  }
  busy = false;
  digitalWrite(i2c_led, LOW);
}

