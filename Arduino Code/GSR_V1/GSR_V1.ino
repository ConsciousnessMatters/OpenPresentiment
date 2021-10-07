#include <Adafruit_ADS1X15.h>

Adafruit_ADS1115 ads;
unsigned long sampleWindowTime = 50000; // 20 FPS
unsigned long samples = 0;
unsigned long lastSamples = 0;
unsigned long lastSerialOutputTime = 0;
float sampleAccumulatorValue = 0;
int sampleAccumulatorSetSize = 0;

void setup(void)
{
  Serial.begin(9600);
  ads.setGain(GAIN_TWO); // Max gain that wont overscale for pads touching.
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

  adc0 = ads.readADC_SingleEnded(0);
  adc1 = ads.readADC_SingleEnded(1);
  adc2 = ads.readADC_SingleEnded(2);
  adc3 = ads.readADC_SingleEnded(3);
  adcAverage = ((float) adc0 + (float) adc1 + (float) adc2 + (float) adc3) / 4;

  sampleAccumulatorValue = sampleAccumulatorValue + adcAverage;
  sampleAccumulatorSetSize++;

  nextSerialOutputTime = lastSerialOutputTime + sampleWindowTime;
  runtime = micros();

  if (nextSerialOutputTime <= runtime) {
    samplesThisWindow = samples - lastSamples;
    adcSuperSampledAverage = (float) sampleAccumulatorValue / (float) sampleAccumulatorSetSize;
    adcSuperSampledAverageVolts = adcSuperSampledAverage * 0.0625;
    adc0Volt = (float) adc0 * 0.0625;
    
    Serial.print(millis()); Serial.print(","); Serial.println(adcSuperSampledAverageVolts);
//    Serial.print(adc0); Serial.print(","); Serial.print(adcAverage); Serial.print(","); Serial.println(adcSuperSampledAverage);
    lastSerialOutputTime = runtime;
    lastSamples = samples;

    sampleAccumulatorValue = 0;
    sampleAccumulatorSetSize = 0;
    
  }

  samples++;
}
