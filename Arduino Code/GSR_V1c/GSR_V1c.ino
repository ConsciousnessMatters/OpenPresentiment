#include <Adafruit_ADS1X15.h>
// Supersampling, multi-input, differential, 3.3v design

Adafruit_ADS1115 ads;
unsigned long sampleWindowTime = 40000; // 50000 =  20 FPS / 40000 = 25 FPS / 33333 = 30 FPS
unsigned long samples = 0;
unsigned long lastSamples = 0;
unsigned long lastSerialOutputTime = 0;
float sampleAccumulatorValue = 0;
int sampleAccumulatorSetSize = 0;

void setup(void)
{
  Serial.begin(9600);
//  ads.setGain(GAIN_TWO); // Max gain that wont overscale for pads touching.
  ads.setGain(GAIN_ONE);
  ads.setDataRate(RATE_ADS1115_860SPS);
  if (!ads.begin()) {
    Serial.println("Failed to initialize ADS.");
    while (1);
  }
}

void loop(void)
{
  unsigned long runtime;
  int16_t adc0, adc1, adc2, adc3, diff01;
  float adcAverage, adcAverageVolts, adcSuperSampledAverage, adcSuperSampledAverageVolts, adc0Volt;
  unsigned long nextSerialOutputTime, samplesThisWindow;

  adc0 = ads.readADC_Differential_0_1();
  adc1 = ads.readADC_Differential_2_3();
  adcAverage = ((float) adc0 + (float) adc1) / 2;

  sampleAccumulatorValue = sampleAccumulatorValue + adcAverage;
  sampleAccumulatorSetSize++;

  nextSerialOutputTime = lastSerialOutputTime + sampleWindowTime;
  runtime = micros();

  if (nextSerialOutputTime <= runtime) {
    samplesThisWindow = samples - lastSamples;
    adcSuperSampledAverage = sampleAccumulatorValue / (float) sampleAccumulatorSetSize;
    adcSuperSampledAverageVolts = computeVoltageEquivalent(adcSuperSampledAverage);
    adc0Volt = computeVoltageEquivalent((float) adc0);
    
    Serial.print(millis()); Serial.print(","); Serial.println(adcSuperSampledAverageVolts, 5);
//    Serial.print(millis()); Serial.print(","); Serial.print(samplesThisWindow); Serial.print(","); Serial.println(adcSuperSampledAverageVolts);
//    Serial.print(adc0); Serial.print(","); Serial.print(adc1); Serial.print(","); Serial.println(adcSuperSampledAverageVolts, 4);
    lastSerialOutputTime = runtime;
    lastSamples = samples;

    sampleAccumulatorValue = 0;
    sampleAccumulatorSetSize = 0;
    
  }

  samples++;
}

float computeVoltageEquivalent(float adcAverage)
{
  float differentialCompensationFactor = 2;
  float differentialVoltageOffset = -1649431;
  float gainMultiplier = 125;
  float inversionFactor = -1;

  return (((adcAverage * gainMultiplier) / differentialCompensationFactor) + differentialVoltageOffset) * inversionFactor;
}
