const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const duration = 4.3; // 4.3 seconds
const totalSamples = Math.floor(sampleRate * duration);
const numChannels = 2;

// Output buffers for Left and Right channels
const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

// 1. Sub-Bass Cyber Reactor Hum & Harmonic Chorus
let phaseCore = 0;
let phaseDetune = 0;
let phaseFifth = 0;

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  
  // Normalized progress from 0.0 to 1.0 up to 3.8s
  const p = Math.min(1.0, t / 3.8);
  
  // Master volume envelope for reactor (smooth fade-in 0-0.4s, peak 3.5s, drop at 3.9s)
  let amp = 0;
  if (t < 0.4) {
    amp = t / 0.4;
  } else if (t < 3.6) {
    amp = 1.0;
  } else if (t < 4.0) {
    amp = 1.0 - (t - 3.6) / 0.4;
  }
  
  // Pitch rises from 58Hz to 240Hz with cinematic exponential curve
  const freq = 58 * Math.pow(240 / 58, Math.pow(p, 1.35));
  phaseCore += (2 * Math.PI * freq) / sampleRate;
  phaseDetune += (2 * Math.PI * (freq * 1.008 + Math.sin(t * 8) * 1.5)) / sampleRate;
  phaseFifth += (2 * Math.PI * (freq * 1.498)) / sampleRate;
  
  // Sine + warm triangle harmonics
  const core = Math.sin(phaseCore) * 0.45;
  const detune = Math.sin(phaseDetune) * 0.25;
  const fifth = Math.sin(phaseFifth) * (0.15 * p); // 5th harmonic blooms as charging advances
  
  // Low-pass warmth
  const reactorSignal = (core + detune + fifth) * amp * 0.65;
  
  left[i] += reactorSignal * 0.95;
  right[i] += reactorSignal * 0.95;
}

// 2. High-Tech Data Telemetry Sync Pulses (Accelerating blips)
let pulseAccum = 0;
for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  if (t > 3.85) break;
  
  const p = Math.min(1.0, t / 3.7);
  // Pulse rate accelerates from 3 pulses/sec up to 24 pulses/sec
  const currentRate = 3.0 + Math.pow(p, 2.0) * 21.0;
  pulseAccum += currentRate / sampleRate;
  
  const pulseFrac = pulseAccum % 1.0;
  // Sharp micro-pulse envelope
  if (pulseFrac < 0.15) {
    const pulseT = pulseFrac / 0.15;
    const pulseAmp = Math.sin(pulseT * Math.PI) * (0.12 + p * 0.22);
    
    // High-tech frequency sweeps up with progress
    const blipFreq = 1200 + p * 1600 + Math.sin(pulseT * Math.PI * 4) * 300;
    const blip = Math.sin(2 * Math.PI * blipFreq * t) * pulseAmp;
    
    // Stereo ping-pong alternating left and right
    const pan = Math.sin(pulseAccum * Math.PI); // -1 to 1
    left[i] += blip * (0.5 - pan * 0.35);
    right[i] += blip * (0.5 + pan * 0.35);
  }
}

// 3. Resonant Plasma Sweep (Filtered white noise whoosh)
let b0 = 0, b1 = 0, b2 = 0;
for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  if (t > 3.9) break;
  
  const p = Math.min(1.0, t / 3.7);
  const white = (Math.random() * 2 - 1) * 0.08;
  
  // Simple sweeping low/band-pass filter
  const cutoff = 0.02 + p * 0.08;
  b0 = b0 + cutoff * (white - b0);
  b1 = b1 + cutoff * (b0 - b1);
  b2 = b2 + cutoff * (b1 - b2);
  
  const noiseAmp = Math.pow(p, 1.8) * 0.35;
  left[i] += b2 * noiseAmp * 0.85;
  right[i] += b2 * noiseAmp * 1.15;
}

// 4. Subtle Low-Frequency Magnetic Lock (Sub-bass settling at t = 3.75s, NO high-frequency chime/ting)
const lockStart = 3.75;
const lockStartIndex = Math.floor(lockStart * sampleRate);

let lockPhase = 0;
for (let i = lockStartIndex; i < totalSamples; i++) {
  const t = (i - lockStartIndex) / sampleRate;
  const decaySub = Math.exp(-t * 5.0); // Soft, low-frequency magnetic settling
  
  // Pure low-frequency warm thump (55Hz) - zero high pitched ting/bell
  const fSub = 55;
  lockPhase += (2 * Math.PI * fSub) / sampleRate;
  const subThump = Math.sin(lockPhase) * decaySub * 0.35;
  
  left[i] += subThump * 0.95;
  right[i] += subThump * 0.95;
}

// Write 16-bit PCM WAV File
const numFrames = totalSamples;
const bytesPerSample = 2;
const blockAlign = numChannels * bytesPerSample;
const byteRate = sampleRate * blockAlign;
const dataSize = numFrames * blockAlign;
const headerSize = 44;
const buffer = Buffer.alloc(headerSize + dataSize);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);

// fmt chunk
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Chunk size
buffer.writeUInt16LE(1, 20);  // Audio format 1 = PCM
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34); // Bits per sample

// data chunk
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Clamp and write interleaved PCM 16-bit samples
let offset = 44;
for (let i = 0; i < totalSamples; i++) {
  // Soft limiter
  let l = Math.max(-1, Math.min(1, left[i]));
  let r = Math.max(-1, Math.min(1, right[i]));
  
  // Soft clip curve
  l = Math.tanh(l);
  r = Math.tanh(r);
  
  const intL = Math.floor(l * 32767);
  const intR = Math.floor(r * 32767);
  
  buffer.writeInt16LE(intL, offset);
  buffer.writeInt16LE(intR, offset + 2);
  offset += 4;
}

const outputPath = path.join(__dirname, '..', 'public', 'audio', 'sfx', 'futuristic-loading.wav');
fs.writeFileSync(outputPath, buffer);
console.log('Successfully created futuristic-loading.wav at:', outputPath);
