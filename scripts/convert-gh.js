const fs = require('fs');
const path = require('path');

function convert32to16Wav(inputPath, outputPath) {
  const src = fs.readFileSync(inputPath);
  let pos = 12;
  let fmtOffset = -1;
  let dataOffset = -1;
  let dataSize = 0;
  
  while (pos < src.length - 8) {
    const id = src.toString('ascii', pos, pos + 4);
    const size = src.readUInt32LE(pos + 4);
    if (id === 'fmt ') fmtOffset = pos + 8;
    if (id === 'data') {
      dataOffset = pos + 8;
      dataSize = size;
      break;
    }
    pos += 8 + size;
  }
  
  const channels = src.readUInt16LE(fmtOffset + 2);
  const sampleRate = src.readUInt32LE(fmtOffset + 4);
  const bits = src.readUInt16LE(fmtOffset + 14);

  if (bits === 16) {
    console.log(inputPath, 'is already 16-bit');
    if (inputPath !== outputPath) fs.copyFileSync(inputPath, outputPath);
    return;
  }

  const numSamples = dataSize / 4;
  const outDataSize = numSamples * 2;
  const outBuf = Buffer.alloc(44 + outDataSize);

  // RIFF header
  outBuf.write('RIFF', 0);
  outBuf.writeUInt32LE(36 + outDataSize, 4);
  outBuf.write('WAVE', 8);

  // fmt chunk
  outBuf.write('fmt ', 12);
  outBuf.writeUInt32LE(16, 16);
  outBuf.writeUInt16LE(1, 20); // PCM
  outBuf.writeUInt16LE(channels, 22);
  outBuf.writeUInt32LE(sampleRate, 24);
  outBuf.writeUInt32LE(sampleRate * channels * 2, 28);
  outBuf.writeUInt16LE(channels * 2, 32);
  outBuf.writeUInt16LE(16, 34);

  // data chunk
  outBuf.write('data', 36);
  outBuf.writeUInt32LE(outDataSize, 40);

  let outPos = 44;
  for (let i = dataOffset; i < dataOffset + dataSize; i += 4) {
    const s32 = src.readInt32LE(i);
    let s16 = Math.round(s32 / 65536);
    if (s16 > 32767) s16 = 32767;
    if (s16 < -32768) s16 = -32768;
    outBuf.writeInt16LE(s16, outPos);
    outPos += 2;
  }

  fs.writeFileSync(outputPath, outBuf);
  console.log('Converted', inputPath, '->', outputPath, '(', (src.length/1024/1024).toFixed(2), 'MB ->', (outBuf.length/1024/1024).toFixed(2), 'MB)');
}

const baseDir = path.resolve(__dirname, '..');
for (let i = 1; i <= 6; i++) {
  const ghIn = path.join(baseDir, 'public', 'audio', 'golden hour', 'gh' + i + '.wav');
  const ghOut1 = path.join(baseDir, 'public', 'audio', 'golden-hour', 'gh' + i + '.wav');
  const ghOut2 = path.join(baseDir, 'public', 'audio', 'golden hour', 'gh' + i + '.wav');
  convert32to16Wav(ghIn, ghOut1);
  convert32to16Wav(ghIn, ghOut2);
}

const temp16 = path.join(baseDir, 'public', 'audio', 'golden-hour', 'gh1-16.wav');
if (fs.existsSync(temp16)) fs.unlinkSync(temp16);

console.log('All Golden Hour sounds successfully converted to 16-bit PCM WAV!');
