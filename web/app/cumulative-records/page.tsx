'use client';

import { Suspense } from 'react';
import NavigationHeader from '@/components/common/NavigationHeader';
import CumulativeRecordsContent from './CumulativeRecordsContent';

export default function CumulativeRecordsPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <Suspense fallback={
        <div className="container mx-auto p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      }>
        <CumulativeRecordsContent />
      </Suspense>
    </div>
  );
}
