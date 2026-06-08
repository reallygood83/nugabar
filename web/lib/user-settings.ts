import { getAdminDb } from './firebase-admin';

export interface UserSettings {
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
