
// I2C Scanner
// Written by Nick Gammon
// Date: 20th April 2011

#include <Wire.h>
#define PCF8591 (0x90 >> 1)      // Device address = 0       
#define PCF8591_DAC_ENABLE 0x40
#define PCF8591_ADC_CH0 0x40 // Photo senosr
#define PCF8591_ADC_CH1 0x41 // Thermistor
#define PCF8591_ADC_CH2 0x42
#define PCF8591_ADC_CH3 0x43  // Pot

byte adc_value;  
byte getADC(byte config)
{
  Wire.beginTransmission(PCF8591);
  Wire.write(config);
  Wire.endTransmission();
  Wire.requestFrom((int) PCF8591,2);
  while (Wire.available()) 
  {
    adc_value = Wire.read(); //This needs two reads to get the value.
    adc_value = Wire.read();
  }
  return adc_value;
}
  
void setup() {
  Serial.begin (115200);
  Wire.begin();
}

void serialEvent() {
  while (Serial.available()) {
      // read the incoming byte:
      char incomingByte = (char)Serial.read();
  
      Serial.println("Received byte: " + incomingByte);
      switch(incomingByte)
      {
        case '0':
          Serial.println(getADC(PCF8591_ADC_CH0));
          break;
        case '1':
          Serial.println(getADC(PCF8591_ADC_CH1));
          break;
        case '2':
          Serial.println(getADC(PCF8591_ADC_CH2));
          break;
        case '3':
          Serial.println(getADC(PCF8591_ADC_CH3));
          break;
      }
    }
}

void loop() {}
    
