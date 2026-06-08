import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { requireAuth } from '@/lib/auth-server';
import { db } from '@/lib/firebase-admin';

interface Activity {
  id: string;
  date: string;
  category: 'autonomous' | 'club' | 'career' | 'volunteer';
  subject: string;
  content: string;
  selected: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    const { pdfFileName, activities, generatedRecords } = await request.json();

    if (!pdfFileName) {
      return NextResponse.json(
        { success: false, error: 'PDF 파일명이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json(
        { success: false, error: '활동 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    const now = Timestamp.now();
    const dataToSave = {
      userId: auth.uid,
      pdfFileName,
      uploadedAt: now,
      activities: activities.map((activity: Activity) => ({
        id: activity.id,
        date: activity.date,
        category: activity.category,
        subject: activity.subject,
        content: activity.content,
        selected: activity.selected || false,
      })),
      generatedRecords: generatedRecords || [],
      updatedAt: now,
    };

    const docRef = await db
      .collection('users')
      .doc(auth.uid)
      .collection('creativeActivities')
      .add(dataToSave);

    return NextResponse.json({
      success: true,
      documentId: docRef.id,
      message: '활동 데이터가 저장되었습니다.',
    });
  } catch (error) {
    console.error('활동 저장 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '활동 저장 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
