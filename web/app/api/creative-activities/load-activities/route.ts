import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { requireAuth } from '@/lib/auth-server';
import { db } from '@/lib/firebase-admin';

function serializeDate(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    const querySnapshot = await db
      .collection('users')
      .doc(auth.uid)
      .collection('creativeActivities')
      .orderBy('uploadedAt', 'desc')
      .get();

    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        pdfFileName: docData.pdfFileName,
        uploadedAt: serializeDate(docData.uploadedAt),
        activities: docData.activities || [],
        generatedRecords: docData.generatedRecords || [],
        updatedAt: serializeDate(docData.updatedAt),
      };
    });

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error('활동 불러오기 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '활동 불러오기 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
