const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const duration = 1.35; // 1.35 seconds (850ms glitch + 500ms lush reverb tail)
const totalSamples = Math.floor(sampleRate * duration);
const numChannels = 2;

const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

// 1. High-Voltage Electric Arc / Spark Transient (t = 0.0s to 0.08s)
for (let i = 0; i < Math.floor(0.08 * sampleRate); i++) {
  const t = i / sampleRate;
  const env = Math.exp(-t * 55);
  // High-frequency crackle & FM zap
  const zap = Math.sin(2 * Math.PI * (4800 - t * 35000) * t);
  const spark = (Math.random() * 2 - 1) * 0.9;
  const zapMix = (zap * 0.5 + spark * 0.5) * env * 0.85;
  
  left[i] += zapMix * 1.1;
  right[i] += zapMix * 0.85;
}

// 2. Heavy Sub-Bass Trailer Drop (115Hz -> 28Hz cinematic braam, t = 0.02s to 0.65s)
let subPhase = 0;
for (let i = Math.floor(0.015 * sampleRate); i < Math.floor(0.7 * sampleRate); i++) {
  const t = (i - 0.015 * sampleRate) / sampleRate;
  const env = Math.sin(Math.min(1.0, t / 0.04) * Math.PI * 0.5) * Math.exp(-t * 4.8);
  // Pitch dive from 118Hz down to 28Hz
  const freq = 28 + (118 - 28) * Math.exp(-t * 7.5);
  subPhase += (2 * Math.PI * freq) / sampleRate;
  
  // Sine + 2nd harmonic saturation
  const sub = (Math.sin(subPhase) * 0.75 + Math.sin(subPhase * 2) * 0.25) * env * 0.95;
  left[i] += sub;
  right[i] += sub;
}

// 3. Cybernetic Data Tearing & Granular Buffer Slices (t = 0.04s to 0.75s)
// 12 micro-bursts of stuttering digital packets ping-ponging across stereo field
const numSlices = 14;
for (let s = 0; s < numSlices; s++) {
  const sliceT = 0.04 + (s / numSlices) * 0.65;
  const sliceIndex = Math.floor(sliceT * sampleRate);
  const sliceLen = Math.floor((0.022 + (s % 3) * 0.01) * sampleRate);
  const pan = (s % 2 === 0) ? -0.75 : 0.75; // Ping-pong L / R
  const carrierFreq = 850 + (s * 320) % 2400;

  for (let j = 0; j < sliceLen && (sliceIndex + j) < totalSamples; j++) {
    const idx = sliceIndex + j;
    const tj = j / sampleRate;
    const window = Math.sin((j / sliceLen) * Math.PI); // Hann window
    
    // FM synth texture: carrier modulated by high frequency digital clock
    const mod = Math.sin(2 * Math.PI * (carrierFreq * 2.4) * tj);
    const wave = Math.sin(2 * Math.PI * carrierFreq * tj + mod * 2.2);
    // Bitcrush / square quantization simulation
    const crushed = Math.sign(wave) * Math.pow(Math.abs(wave), 0.7);
    
    const sliceAmp = crushed * window * 0.45;
    left[idx] += sliceAmp * (0.5 - pan * 0.45);
    right[idx] += sliceAmp * (0.5 + pan * 0.45);
  }
}

// 4. Downward Laser Downsweep / Resonant Tape Rip (t = 0.08s to 0.55s)
let ripPhase = 0;
for (let i = Math.floor(0.06 * sampleRate); i < Math.floor(0.55 * sampleRate); i++) {
  const t = (i - 0.06 * sampleRate) / sampleRate;
  const env = Math.exp(-t * 6.5);
  // Sweeps from 3200Hz down to 180Hz
  const freq = 180 + (3200 - 180) * Math.pow(1.0 - t / 0.49, 2.5);
  ripPhase += (2 * Math.PI * freq) / sampleRate;
  
  const rip = Math.sin(ripPhase) * env * 0.35;
  left[i] += rip * 0.7;
  right[i] += rip * 1.1;
}

// 5. Holographic Servo Lock Click (at t = 0.42s)
const lockStart = Math.floor(0.42 * sampleRate);
for (let i = 0; i < Math.floor(0.05 * sampleRate); i++) {
  const idx = lockStart + i;
  if (idx >= totalSamples) break;
  const t = i / sampleRate;
  const env = Math.exp(-t * 90);
  const click = Math.sin(2 * Math.PI * 1850 * t) * env * 0.55;
  left[idx] += click;
  right[idx] += click;
}

// 6. Stereo Convolution / Space Reverb Tail
const delay1 = Math.floor(0.045 * sampleRate);
const delay2 = Math.floor(0.088 * sampleRate);
const delay3 = Math.floor(0.145 * sampleRate);

for (let i = delay3; i < totalSamples; i++) {
  left[i] += right[i - delay1] * 0.28 + left[i - delay3] * 0.18;
  right[i] += left[i - delay2] * 0.28 + right[i - delay3] * 0.18;
}

// Master Soft Clipper & 16-bit WAV Export
const bytesPerSample = 2;
const blockAlign = numChannels * bytesPerSample;
const byteRate = sampleRate * blockAlign;
const dataSize = totalSamples * blockAlign;
const headerSize = 44;
const buffer = Buffer.alloc(headerSize + dataSize);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

let offset = 44;
for (let i = 0; i < totalSamples; i++) {
  let l = Math.max(-1, Math.min(1, left[i]));
  let r = Math.max(-1, Math.min(1, right[i]));
  
  // Analog tape soft saturation
  l = Math.tanh(l * 1.15);
  r = Math.tanh(r * 1.15);
  
  const intL = Math.floor(l * 32767);
  const intR = Math.floor(r * 32767);
  
  buffer.writeInt16LE(intL, offset);
  buffer.writeInt16LE(intR, offset + 2);
  offset += 4;
}

const outputPath = path.join(__dirname, '..', 'public', 'audio', 'sfx', 'futuristic-glitch.wav');
fs.writeFileSync(outputPath, buffer);
console.log('Successfully created futuristic-glitch.wav at:', outputPath);
