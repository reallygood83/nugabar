'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface YouTubeSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageKey: string;
}

export function YouTubeSubscribeModal({ isOpen, onClose, storageKey }: YouTubeSubscribeModalProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // localStorage에서 모달 표시 여부 확인
    if (typeof window !== 'undefined') {
      const hasShown = localStorage.getItem(storageKey);
      if (!hasShown && isOpen) {
        setShouldShow(true);
        localStorage.setItem(storageKey, 'true');
      }
    }
  }, [isOpen, storageKey]);

  if (!shouldShow) return null;

  const handleClose = () => {
    setShouldShow(false);
    onClose();
  };

  const handleYouTubeClick = () => {
    window.open('https://www.youtube.com/@배움의달인-p5v', '_blank');
  };

  const handleKakaoClick = () => {
    window.open('https://open.kakao.com/o/gubGYQ7g', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-4">
          <div className="text-4xl">🎓</div>
          <h2 className="text-2xl font-bold text-gray-900">
            프로그램이 도움이 되셨나요?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            누가바 프로그램이 선생님의 업무에 도움이 되셨다면,
            <br />
            <strong className="text-blue-600">'배움의 달인'</strong> 유튜브 채널 구독으로 응원해주세요! 💙
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleYouTubeClick}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
          >
            📺 유튜브 구독하러 가기
          </Button>

          <Button
            onClick={handleKakaoClick}
            variant="outline"
            className="w-full border-yellow-400 text-gray-700 hover:bg-yellow-50 py-6 text-lg font-semibold"
          >
            💬 오픈카톡방에서 소통하기
          </Button>

          <Button
            onClick={handleClose}
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-700"
          >
            나중에 할게요
          </Button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          * 이 메시지는 각 기능별로 1회만 표시됩니다
        </p>
      </Card>
    </div>
  );
}
