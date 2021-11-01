// Supersampling, multi-input, differential, 3.3v design

#include <Adafruit_ADS1X15.h>

Adafruit_ADS1115 ads;
unsigned long sampleWindowTime = 40000; // 50000 =  20 FPS / 40000 = 25 FPS / 33333 = 30 FPS
//unsigned long samples = 0;
//unsigned long lastSamples = 0;
unsigned long lastScheduledSerialOutputTime = 0;
signed long sampleAccumulatorValue = 0;
int sampleAccumulatorSetSize = 0;

void setup(void)
{
  Serial.begin(9600);
//  ads.setGain(GAIN_TWO); // Max gain that wont overscale for pads touching.
  ads.setGain(GAIN_ONE);
  ads.setDataRate(RATE_ADS1115_475SPS);
  if (!ads.begin()) {
    Serial.println("Failed to initialize ADS115 ADC.");
    while (1);
  }
}

void loop(void)
{
  unsigned long runtime;
  signed long diff0, diff1, diffSum;
  float adcAverage, adcAverageVolts, adcSuperSampledAverage, adcSuperSampledAverageVolts, adc0Volt;
  unsigned long nextScheduledSerialOutputTime, samplesThisWindow;

  diff0 = (signed long) ads.readADC_Differential_0_1();
  diff1 = (signed long) ads.readADC_Differential_2_3();

  diffSum = diff0 + diff1;

  sampleAccumulatorValue = sampleAccumulatorValue + diffSum;
  sampleAccumulatorSetSize = sampleAccumulatorSetSize + 2;

  nextScheduledSerialOutputTime = lastScheduledSerialOutputTime + sampleWindowTime;

  if (nextScheduledSerialOutputTime <= micros()) {
//    samplesThisWindow = samples - lastSamples;
    adcSuperSampledAverage = (float) sampleAccumulatorValue / (float) sampleAccumulatorSetSize;
    adcSuperSampledAverageVolts = computeVoltageEquivalent(adcSuperSampledAverage);
    
    Serial.print(millis()); Serial.print(","); Serial.println(adcSuperSampledAverageVolts, 5);
//    Serial.print(millis()); Serial.print(","); Serial.print(samplesThisWindow); Serial.print(","); Serial.println(adcSuperSampledAverageVolts);
//    Serial.print(adc0); Serial.print(","); Serial.print(adc1); Serial.print(","); Serial.println(adcSuperSampledAverageVolts, 4);
    lastScheduledSerialOutputTime = lastScheduledSerialOutputTime + sampleWindowTime;
//    lastSamples = samples;

    sampleAccumulatorValue = 0;
    sampleAccumulatorSetSize = 0;
  }

//  samples++;
}

float computeVoltageEquivalent(float adcAverage)
{
  float differentialCompensationFactor = 2;
  float differentialVoltageOffset = -1646361;
  float gainMultiplier = 125;
  float inversionFactor = -1;

  return (((adcAverage * gainMultiplier) / differentialCompensationFactor) + differentialVoltageOffset) * inversionFactor;
}
