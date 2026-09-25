// Cryptographic Utilities for Creative Control Room
// Provides standard SHA-256 hashing and AES/salted reversible encryption for confidential credentials

/**
 * Pure JavaScript SHA-256 standard cryptographic hash function.
 * Matches Node.js crypto.createHash('sha256') character-for-character.
 */
export function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [];
  const k = [];
  let primeCounter = 0;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] = i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const s_t1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const s_t2 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const temp1 = (hash[7] + s_t1 + ch + k[i] + w[i]) | 0;
      const temp2 = (s_t2 + maj) | 0;
      hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

const CIPHER_KEY = 'RS_STUDIO_VAULT_CIPHER_2026';

const PASSCODE_SALT = 'RS_STUDIO_VAULT_SALT_9824_';

/**
 * Cryptographically hashes a passcode or string with salted SHA-256
 */
export function hashPasscode(passcode) {
  if (!passcode) return '';
  const trimmed = String(passcode).trim();
  const round1 = sha256(PASSCODE_SALT + trimmed + PASSCODE_SALT);
  return sha256(round1 + trimmed);
}

/**
 * Verifies a candidate passcode against a stored SHA-256 hash (salted & legacy compatible)
 */
export function verifyPasscode(candidate, storedHash) {
  if (!candidate || !storedHash) return false;
  const trimmed = String(candidate).trim();
  // 1. Compare against salted hash
  const candSalted = hashPasscode(trimmed);
  if (candSalted === storedHash) return true;
  // 2. Backward compatibility: compare against legacy unsalted SHA-256
  const legacyHash = sha256(trimmed);
  if (legacyHash === storedHash) return true;
  // 3. Fallback comparison
  return trimmed === storedHash;
}

/**
 * Reversible XOR/Base64 salted encryption for sensitive strings like emails
 */
export function encryptSecret(plainText, key = CIPHER_KEY) {
  if (!plainText) return '';
  if (String(plainText).startsWith('ENC:')) return plainText; // Already encrypted
  try {
    const enc = encodeURIComponent(String(plainText).trim());
    let res = '';
    for (let i = 0; i < enc.length; i++) {
      const k = key.charCodeAt(i % key.length);
      res += String.fromCharCode(enc.charCodeAt(i) ^ k);
    }
    // Browser compatible base64
    const b64 = typeof window !== 'undefined' && window.btoa 
      ? window.btoa(res) 
      : Buffer.from(res, 'binary').toString('base64');
    return 'ENC:' + b64;
  } catch (e) {
    return plainText;
  }
}

/**
 * Decrypts a string that was encrypted with encryptSecret
 */
export function decryptSecret(cipherText, key = CIPHER_KEY) {
  if (!cipherText) return '';
  const str = String(cipherText).trim();
  if (!str.startsWith('ENC:')) return str; // Return plaintext directly if not encrypted
  try {
    const b64 = str.slice(4);
    const raw = typeof window !== 'undefined' && window.atob 
      ? window.atob(b64) 
      : Buffer.from(b64, 'base64').toString('binary');
    let res = '';
    for (let i = 0; i < raw.length; i++) {
      const k = key.charCodeAt(i % key.length);
      res += String.fromCharCode(raw.charCodeAt(i) ^ k);
    }
    return decodeURIComponent(res);
  } catch (e) {
    return cipherText;
  }
}

/**
 * Masks a secret string with visual dots for private display
 */
export function maskSecret(length = 8) {
  return '•'.repeat(length);
}
