const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const duration = 3.6; // 3.6 seconds total (1.1s pre-drop build + 2.5s massive sub-bass impact drop)
const totalSamples = Math.floor(sampleRate * duration);
const numChannels = 2;

const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

// Drop hit point: exactly at t = 1.10 seconds
const dropTime = 1.10;
const dropIndex = Math.floor(dropTime * sampleRate);

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: THE PRE-DROP TENSION BUILD (0.0s -> 1.05s)
// ═══════════════════════════════════════════════════════════════════════════

// 1A. Reverse Vacuum Suction Whoosh (Atmospheric air intake)
let lp0 = 0, lp1 = 0, lp2 = 0;
for (let i = 0; i < Math.floor(1.05 * sampleRate); i++) {
  const t = i / sampleRate;
  const p = t / 1.05; // 0 -> 1
  
  const white = (Math.random() * 2 - 1) * 0.4;
  const cutoff = 0.015 + Math.pow(p, 2.0) * 0.14;
  lp0 = lp0 + cutoff * (white - lp0);
  lp1 = lp1 + cutoff * (lp0 - lp1);
  lp2 = lp2 + cutoff * (lp1 - lp2);
  
  const suctionAmp = Math.pow(p, 2.5) * 0.55;
  const pan = Math.sin(t * 5) * 0.25;
  left[i] += lp2 * suctionAmp * (0.5 - pan);
  right[i] += lp2 * suctionAmp * (0.5 + pan);
}

// 1B. Tension Sub-Bass Coil Rising (45Hz -> 90Hz)
let preSubPhase = 0;
for (let i = 0; i < Math.floor(1.04 * sampleRate); i++) {
  const t = i / sampleRate;
  const p = t / 1.04;
  const freq = 45 + (92 - 45) * Math.pow(p, 1.8);
  preSubPhase += (2 * Math.PI * freq) / sampleRate;
  
  const env = Math.pow(p, 2.0) * 0.42;
  const preSub = Math.sin(preSubPhase) * env;
  left[i] += preSub * 0.95;
  right[i] += preSub * 0.95;
}

// 1C. Heartbeat Tension Thumps at t = 0.25s, 0.65s, 0.95s
const thumps = [0.25, 0.65, 0.95];
thumps.forEach((thumpT, idx) => {
  const startIdx = Math.floor(thumpT * sampleRate);
  const thumpLen = Math.floor(0.08 * sampleRate);
  let thPhase = 0;
  for (let j = 0; j < thumpLen; j++) {
    const tj = j / sampleRate;
    const env = Math.exp(-tj * 45) * (0.25 + idx * 0.18);
    const freq = 65 * Math.exp(-tj * 25);
    thPhase += (2 * Math.PI * freq) / sampleRate;
    const val = Math.sin(thPhase) * env;
    const targetIdx = startIdx + j;
    if (targetIdx < dropIndex - Math.floor(0.05 * sampleRate)) {
      left[targetIdx] += val;
      right[targetIdx] += val;
    }
  }
});

// Note: 1.05s to 1.10s is left as dead silence / breath (the vacuum void before the drop!)

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: THE BEAT DROP / SEISMIC SUB-BASS IMPACT (1.10s -> 3.6s)
// ═══════════════════════════════════════════════════════════════════════════

// 2A. Heavy Sub-Bass Shockwave Pitch Dive (110Hz -> 24Hz earth-shaker)
let dropSubPhase = 0;
for (let i = dropIndex; i < totalSamples; i++) {
  const t = (i - dropIndex) / sampleRate;
  
  // Fast attack (3ms), long massive sub sustain & decay
  const attack = Math.min(1.0, t / 0.004);
  const decay = Math.exp(-t * 1.35); // Long 2.5-second cinematic sub tail
  const subAmp = attack * decay * 0.88;
  
  // Massive pitch curve: punchy 105Hz down to 26Hz sub rumble
  const freq = 26 + (105 - 26) * Math.exp(-t * 7.5);
  dropSubPhase += (2 * Math.PI * freq) / sampleRate;
  
  // Sub sine + rich 2nd & 3rd harmonics for headphone/speaker translation
  const subWave = 
    Math.sin(dropSubPhase) * 0.75 +
    Math.sin(dropSubPhase * 2) * 0.22 +
    Math.sin(dropSubPhase * 3) * 0.08;
    
  left[i] += subWave * subAmp;
  right[i] += subWave * subAmp;
}

// 2B. Cinematic Anvil / Titanium Metal Punch Transient (0ms -> 35ms after drop)
for (let i = dropIndex; i < Math.min(totalSamples, dropIndex + Math.floor(0.04 * sampleRate)); i++) {
  const t = (i - dropIndex) / sampleRate;
  const env = Math.exp(-t * 140);
  const click = (
    Math.sin(2 * Math.PI * (2800 - t * 45000) * t) * 0.6 +
    (Math.random() * 2 - 1) * 0.4
  ) * env * 0.65;
  
  left[i] += click * 1.1;
  right[i] += click * 0.9;
}

// 2C. Low-Mid Cinematic Chest Thump (Warm punch 160Hz -> 45Hz)
let punchPhase = 0;
for (let i = dropIndex; i < Math.min(totalSamples, dropIndex + Math.floor(0.18 * sampleRate)); i++) {
  const t = (i - dropIndex) / sampleRate;
  const env = Math.exp(-t * 22);
  const freq = 45 + (160 - 45) * Math.exp(-t * 30);
  punchPhase += (2 * Math.PI * freq) / sampleRate;
  const punch = Math.sin(punchPhase) * env * 0.45;
  left[i] += punch;
  right[i] += punch;
}

// 2D. Massive Spatial Reverb / Canyon Echo Tail
const reverbDelays = [
  Math.floor(0.042 * sampleRate),
  Math.floor(0.086 * sampleRate),
  Math.floor(0.155 * sampleRate),
  Math.floor(0.245 * sampleRate)
];

for (let d = 0; d < reverbDelays.length; d++) {
  const delay = reverbDelays[d];
  const decay = 0.22 / (d + 1);
  for (let i = dropIndex + delay; i < totalSamples; i++) {
    left[i] += right[i - delay] * decay;
    right[i] += left[i - delay] * decay;
  }
}

// 2E. Smooth Fade Out at very end of sample
const endFadeIndex = Math.floor(3.4 * sampleRate);
for (let i = endFadeIndex; i < totalSamples; i++) {
  const p = (i - endFadeIndex) / (totalSamples - endFadeIndex);
  const fade = Math.max(0, 1.0 - p);
  left[i] *= fade;
  right[i] *= fade;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT 16-BIT STEREO PCM WAV FILE
// ═══════════════════════════════════════════════════════════════════════════

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
  
  // Analog transformer soft saturation
  l = Math.tanh(l * 1.28);
  r = Math.tanh(r * 1.28);
  
  buffer.writeInt16LE(Math.floor(l * 32767), offset);
  buffer.writeInt16LE(Math.floor(r * 32767), offset + 2);
  offset += 4;
}

const outputPath = path.join(__dirname, '..', 'public', 'audio', 'sfx', 'cinematic-beat-drop.wav');
fs.writeFileSync(outputPath, buffer);
console.log('Successfully generated cinematic-beat-drop.wav at:', outputPath);
