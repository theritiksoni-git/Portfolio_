const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const duration = 2.4; // 2.4 seconds cinematic trailer riser
const totalSamples = Math.floor(sampleRate * duration);
const numChannels = 2;

const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

// Fundamental notes in A minor: A1 (55Hz), A2 (110Hz), E3 (164.8Hz), A3 (220Hz), C4 (261.6Hz), E4 (329.6Hz)
const chordVoices = [
  { freq: 55.0,  gain: 0.55 }, // Contrabass / Sub Brass
  { freq: 110.0, gain: 0.45 }, // Cello
  { freq: 164.8, gain: 0.35 }, // French Horn / Viola
  { freq: 220.0, gain: 0.38 }, // String Section Core
  { freq: 261.6, gain: 0.28 }, // Minor 3rd (Dark Emotional Tension)
  { freq: 329.6, gain: 0.25 }, // 5th Harmonic
  { freq: 440.0, gain: 0.22 }, // High Tension Violin
];

// 1. Dark Orchestral Bowed String & Low Brass Glissando (Organic, Non-Electronic)
const phases = new Float32Array(chordVoices.length * 4);

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  const p = t / duration; // 0.0 -> 1.0
  
  // Natural cinematic crescendo envelope (smooth exponential swell)
  const masterAmp = Math.pow(p, 1.85);
  
  // Orchestral glissando: strings slide upward smoothly by 7 semitones (perfect fifth)
  const pitchCurve = Math.pow(2, (p * 7) / 12);
  
  // Natural human vibrato (develops as tension increases)
  const vibratoDepth = Math.pow(p, 2) * 0.012;
  const vibrato = 1.0 + Math.sin(2 * Math.PI * 5.4 * t) * vibratoDepth;
  
  let sectionL = 0;
  let sectionR = 0;
  
  chordVoices.forEach((voice, vIdx) => {
    // 3 organic detuned acoustic unison layers per voice
    for (let u = -1; u <= 1; u++) {
      const pIdx = vIdx * 3 + (u + 1);
      const detune = 1.0 + u * 0.0035;
      const curFreq = voice.freq * pitchCurve * vibrato * detune;
      
      phases[pIdx] += (2 * Math.PI * curFreq) / sampleRate;
      const phi = phases[pIdx] % (2 * Math.PI);
      
      // Warm acoustic orchestral wave: rich fundamental + warm odd harmonics (wooden cello/brass body)
      const acousticTone = 
        Math.sin(phi) * 0.65 +
        Math.sin(phi * 2) * 0.22 +
        Math.sin(phi * 3) * 0.10 +
        Math.sin(phi * 4) * 0.03;
      
      const stereoPan = u * 0.35 + Math.sin(t * 1.5 + vIdx) * 0.15;
      const voiceAmp = voice.gain * masterAmp * 0.12;
      
      sectionL += acousticTone * voiceAmp * (0.5 - stereoPan * 0.5);
      sectionR += acousticTone * voiceAmp * (0.5 + stereoPan * 0.5);
    }
  });
  
  left[i] += sectionL;
  right[i] += sectionR;
}

// 2. Hollywood Trailer Vacuum / Reverse Suction Wind (Warm Organic Brown Noise)
let lp0 = 0, lp1 = 0, lp2 = 0;
for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  const p = t / duration;
  
  // Soft analog noise
  const noise = (Math.random() * 2 - 1) * 0.45;
  
  // Warm low-pass filter opening from 120Hz up to 1800Hz (dark cinematic suction, no harsh sizzle)
  const cutoff = 0.01 + Math.pow(p, 2.2) * 0.12;
  lp0 = lp0 + cutoff * (noise - lp0);
  lp1 = lp1 + cutoff * (lp0 - lp1);
  lp2 = lp2 + cutoff * (lp1 - lp2);
  
  // Suction envelope accelerates right into the drop
  const suctionAmp = Math.pow(p, 2.4) * 0.45;
  const pan = Math.sin(t * 4) * 0.2;
  
  left[i] += lp2 * suctionAmp * (0.5 - pan);
  right[i] += lp2 * suctionAmp * (0.5 + pan);
}

// 3. Deep Cinematic Sub-Bass Swell (38Hz -> 72Hz pure sub pressure)
let subPhase = 0;
for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  const p = t / duration;
  
  const subFreq = 38 + (72 - 38) * Math.pow(p, 1.4);
  subPhase += (2 * Math.PI * subFreq) / sampleRate;
  
  // Smooth sub-bass swell
  const subAmp = Math.pow(p, 1.6) * 0.55;
  const subTone = Math.sin(subPhase) * subAmp;
  
  left[i] += subTone * 0.95;
  right[i] += subTone * 0.95;
}

// 4. Scoring Stage Spatial Reverb & Hall Reflection
// Deep ambient early reflections simulating an 80-piece orchestra hall
const delays = [
  Math.floor(0.035 * sampleRate),
  Math.floor(0.065 * sampleRate),
  Math.floor(0.115 * sampleRate)
];

for (let d = 0; d < delays.length; d++) {
  const delaySamples = delays[d];
  const decay = 0.25 / (d + 1);
  for (let i = delaySamples; i < totalSamples; i++) {
    left[i] += right[i - delaySamples] * decay;
    right[i] += left[i - delaySamples] * decay;
  }
}

// 5. Climax & Precision Drop Cutoff (Silence boundary at t = 2.38s)
const cutIndex = Math.floor(2.375 * sampleRate);
for (let i = cutIndex; i < totalSamples; i++) {
  const fadeP = (i - cutIndex) / (totalSamples - cutIndex);
  const fade = Math.max(0, 1.0 - fadeP * 1.8);
  left[i] *= fade;
  right[i] *= fade;
}

// Write Master 16-bit PCM WAV File
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
  
  // Warm analog tape saturation (Abbey Road transformer curve)
  l = Math.tanh(l * 1.35);
  r = Math.tanh(r * 1.35);
  
  buffer.writeInt16LE(Math.floor(l * 32767), offset);
  buffer.writeInt16LE(Math.floor(r * 32767), offset + 2);
  offset += 4;
}

const outputPath = path.join(__dirname, '..', 'public', 'audio', 'sfx', 'epic-riser-a-min.wav');
fs.writeFileSync(outputPath, buffer);
console.log('Successfully generated cinematic trailer riser at:', outputPath);
