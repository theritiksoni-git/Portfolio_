const fs = require('fs');
const path = require('path');

const sampleRate = 44100;

function writeWav(filename, samplesLeft, samplesRight) {
  const totalSamples = samplesLeft.length;
  const numChannels = 2;
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
    let l = Math.max(-1, Math.min(1, samplesLeft[i]));
    let r = Math.max(-1, Math.min(1, samplesRight[i]));
    l = Math.tanh(l);
    r = Math.tanh(r);
    buffer.writeInt16LE(Math.floor(l * 32767), offset);
    buffer.writeInt16LE(Math.floor(r * 32767), offset + 2);
    offset += 4;
  }

  const outPath = path.join(__dirname, '..', 'public', 'audio', 'sfx', filename);
  fs.writeFileSync(outPath, buffer);
  console.log('Successfully created', filename, 'at:', outPath);
}

// 1. Futuristic Button Hover SFX (35ms holographic micro-chirp)
const hoverDuration = 0.045; // 45ms
const hoverSamples = Math.floor(sampleRate * hoverDuration);
const hoverL = new Float32Array(hoverSamples);
const hoverR = new Float32Array(hoverSamples);

for (let i = 0; i < hoverSamples; i++) {
  const t = i / sampleRate;
  const env = Math.exp(-t * 95);
  // Dual-frequency holographic frequency sweep
  const f1 = 1950 + t * 4000;
  const f2 = 2850 + t * 6000;
  const tone = (Math.sin(2 * Math.PI * f1 * t) * 0.65 + Math.sin(2 * Math.PI * f2 * t) * 0.35) * env * 0.4;
  hoverL[i] = tone * 0.95;
  hoverR[i] = tone * 1.05;
}
writeWav('futuristic-hover.wav', hoverL, hoverR);

// 2. Futuristic Button Click SFX (120ms tactile magnetic haptic engagement)
const clickDuration = 0.14; // 140ms
const clickSamples = Math.floor(sampleRate * clickDuration);
const clickL = new Float32Array(clickSamples);
const clickR = new Float32Array(clickSamples);

let clickSubPhase = 0;
for (let i = 0; i < clickSamples; i++) {
  const t = i / sampleRate;
  
  // Layer A: Micro-spark transient (0-15ms)
  const transientEnv = Math.exp(-t * 220);
  const spark = (Math.sin(2 * Math.PI * (3400 - t * 45000) * t) + (Math.random() * 2 - 1) * 0.3) * transientEnv * 0.7;
  
  // Layer B: Sub-frequency magnetic thud (140Hz -> 36Hz)
  const subEnv = Math.exp(-t * 35);
  const subFreq = 36 + (140 - 36) * Math.exp(-t * 40);
  clickSubPhase += (2 * Math.PI * subFreq) / sampleRate;
  const subThud = Math.sin(clickSubPhase) * subEnv * 0.65;
  
  // Layer C: High-tech holographic confirmation harmonic (880Hz / A5 ping)
  const harmEnv = Math.exp(-t * 45);
  const harm = Math.sin(2 * Math.PI * 880 * t) * harmEnv * 0.35;
  
  const total = spark * 0.6 + subThud * 0.75 + harm * 0.35;
  clickL[i] = total;
  clickR[i] = total;
}
writeWav('futuristic-click.wav', clickL, clickR);
