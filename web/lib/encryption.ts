/**
 * 클라이언트사이드 암호화 유틸리티
 * Gemini API 키를 암호화하여 Firebase에 저장
 */

// Web Crypto API를 사용한 AES-GCM 암호화
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

/**
 * 사용자 UID로부터 암호화 키 생성
 */
async function deriveKey(uid: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(uid.padEnd(32, '0')), // 32바이트로 패딩
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('nugabar-salt-2025'), // 고정 솔트
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * API 키 암호화
 * @param apiKey - 암호화할 Gemini API 키
 * @param uid - 사용자 Firebase UID
 * @returns Base64 인코딩된 암호화 데이터 (iv + ciphertext)
 */
export async function encryptApiKey(apiKey: string, uid: string): Promise<string> {
  try {
    const key = await deriveKey(uid);
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);

    // 랜덤 IV 생성 (12바이트)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 암호화
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      data
    );

    // IV와 암호문을 결합하여 Base64로 인코딩
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('API 키 암호화 실패:', error);
    throw new Error('API 키 암호화에 실패했습니다.');
  }
}

/**
 * API 키 복호화
 * @param encryptedData - Base64 인코딩된 암호화 데이터
 * @param uid - 사용자 Firebase UID
 * @returns 복호화된 API 키
 */
export async function decryptApiKey(encryptedData: string, uid: string): Promise<string> {
  try {
    const key = await deriveKey(uid);

    // Base64 디코딩
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

    // IV와 암호문 분리
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    // 복호화
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('API 키 복호화 실패:', error);
    throw new Error('API 키 복호화에 실패했습니다.');
  }
}

/**
 * API 키 유효성 검증 (형식 체크)
 */
export function validateGeminiApiKey(apiKey: string): boolean {
  // Gemini API 키 형식: AIza로 시작하는 39자
  const regex = /^AIza[0-9A-Za-z_-]{35}$/;
  return regex.test(apiKey);
}
