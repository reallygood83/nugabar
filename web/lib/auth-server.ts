import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from './firebase-admin';

export type AuthResult =
  | { uid: string }
  | { error: NextResponse };

export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    const devUid = request.headers.get('x-dev-user');
    if (devUid) {
      return { uid: devUid };
    }
  }

  const authorization = request.headers.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return {
      error: NextResponse.json(
        { success: false, error: '인증 토큰이 필요합니다.' },
        { status: 401 }
      ),
    };
  }

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(match[1]);
    return { uid: decodedToken.uid };
  } catch (error) {
    console.error('Firebase ID 토큰 검증 실패:', error);
    return {
      error: NextResponse.json(
        { success: false, error: '유효하지 않은 인증 토큰입니다.' },
        { status: 401 }
      ),
    };
  }
}
