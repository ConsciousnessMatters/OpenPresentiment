unsigned long sampleWindowTime = 50000; // 20 FPS
unsigned long samples = 0;
unsigned long lastSamples = 0;
unsigned long lastSerialOutputTime = 0;
float sampleAccumulatorValue = 0;
int sampleAccumulatorSetSize = 0;

void setup(void)
{
  Serial.begin(9600);
}

void loop(void)
{
  unsigned long runtime;
  int a0, a1, a2, a3, a4, a5;
  float aSuperSampledAverage, aSuperSampledAverageVolts, aAverage, aVolt, a0Volt;
  unsigned long nextSerialOutputTime, samplesThisWindow;

  a0 = (int) analogRead(A0);
  a1 = (int) analogRead(A1);
  a2 = (int) analogRead(A2);
  a3 = (int) analogRead(A3);
  a4 = (int) analogRead(A4);
  a5 = (int) analogRead(A5);
  
  aAverage = ((float) a0 + (float) a1 + (float) a2 + (float) a3 + (float) a4 + (float) a5) / 6;

  sampleAccumulatorValue = sampleAccumulatorValue + aAverage;
  sampleAccumulatorSetSize++;

  nextSerialOutputTime = lastSerialOutputTime + sampleWindowTime;
  runtime = micros();

  if (nextSerialOutputTime <= runtime) {
    samplesThisWindow = samples - lastSamples;
    aSuperSampledAverage = (float) sampleAccumulatorValue / (float) sampleAccumulatorSetSize;
    aSuperSampledAverageVolts = aSuperSampledAverage * 4.888;
    a0Volt = (float) a0 * 4.888;

    // Raw sensor output
//    Serial.print(a0); Serial.print(","); Serial.print(a1); Serial.print(","); Serial.print(a2); Serial.print(","); Serial.print(a3); Serial.print(","); Serial.print(a4); Serial.print(","); Serial.println(a5);
    // Raw volts vs supersampled
//    Serial.print(a0Volt); Serial.print(","); Serial.println(aSuperSampledAverageVolts);
    // Standard output
    Serial.println(aSuperSampledAverageVolts);
    lastSerialOutputTime = runtime;
    lastSamples = samples;

    sampleAccumulatorValue = 0;
    sampleAccumulatorSetSize = 0;
  }

  samples++;
}
