import { encryptApiKey, decryptApiKey } from './encryption';
import { getAdminDb } from './firebase-admin';

export interface UserSettings {
  geminiApiKey?: string; // 암호화된 상태로 저장
  geminiModel: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 사용자 설정 가져오기
 */
export async function getUserSettings(uid: string): Promise<UserSettings | null> {
  try {
    const docSnap = await getAdminDb()
      .collection('users')
      .doc(uid)
      .collection('settings')
      .doc('general')
      .get();

    if (docSnap.exists) {
      return docSnap.data() as UserSettings;
    }
    return null;
  } catch (error) {
    console.error('설정 가져오기 실패:', error);
    return null;
  }
}

/**
 * Gemini API 키 저장 (암호화)
 */
export async function saveGeminiApiKey(uid: string, apiKey: string): Promise<void> {
  try {
    // API 키 암호화
    const encryptedKey = await encryptApiKey(apiKey, uid);

    const docRef = getAdminDb()
      .collection('users')
      .doc(uid)
      .collection('settings')
      .doc('general');
    const existingSettings = await docRef.get();

    if (existingSettings.exists) {
      // 기존 설정 업데이트
      await docRef.update({
        geminiApiKey: encryptedKey,
        updatedAt: new Date(),
      });
    } else {
      // 새 설정 생성
      await docRef.set({
        geminiApiKey: encryptedKey,
        geminiModel: 'gemini-2.5-flash',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('API 키 저장 실패:', error);
    throw new Error('API 키 저장에 실패했습니다.');
  }
}

/**
 * Gemini API 키 가져오기 (복호화)
 */
export async function getGeminiApiKey(uid: string): Promise<string | null> {
  try {
    const settings = await getUserSettings(uid);

    if (!settings || !settings.geminiApiKey) {
      return null;
    }

    // API 키 복호화
    return await decryptApiKey(settings.geminiApiKey, uid);
  } catch (error) {
    console.error('API 키 가져오기 실패:', error);
    return null;
  }
}

/**
 * Gemini 모델 설정 업데이트
 */
export async function updateGeminiModel(uid: string, model: string): Promise<void> {
  try {
    await getAdminDb()
      .collection('users')
      .doc(uid)
      .collection('settings')
      .doc('general')
      .set(
        {
          geminiModel: model,
          updatedAt: new Date(),
        },
        { merge: true }
      );
  } catch (error) {
    console.error('모델 설정 업데이트 실패:', error);
    throw new Error('모델 설정 업데이트에 실패했습니다.');
  }
}

/**
 * Gemini API 키 삭제
 */
export async function deleteGeminiApiKey(uid: string): Promise<void> {
  try {
    await getAdminDb()
      .collection('users')
      .doc(uid)
      .collection('settings')
      .doc('general')
      .set(
        {
          geminiApiKey: null,
          updatedAt: new Date(),
        },
        { merge: true }
      );
  } catch (error) {
    console.error('API 키 삭제 실패:', error);
    throw new Error('API 키 삭제에 실패했습니다.');
  }
}

/**
 * API 키 테스트 (실제 Gemini API 호출)
 */
export async function testGeminiApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('API 키 테스트 실패:', error);
    return false;
  }
}
