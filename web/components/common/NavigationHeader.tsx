'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // 학교명 불러오기
  useEffect(() => {
    const loadSchoolName = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch('/api/settings/get-school-name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid }),
        });

        const data = await response.json();
        if (data.success && data.schoolName) {
          setSchoolName(data.schoolName);
        }
      } catch (error) {
        console.error('학교명 불러오기 오류:', error);
      }
    };

    loadSchoolName();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const navItems = [
    { label: '학급 관리', path: '/class-management', icon: '🏫' },
    { label: '행동특성 생성', path: '/behavior-characteristics', icon: '✨' },
    { label: '누가기록 생성', path: '/cumulative-records', icon: '📝' },
    { label: '설정', path: '/settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          {/* 로고 - Notion-inspired */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
              누
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {schoolName ? `${schoolName} 누가바` : '누가바'}
            </span>
          </button>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all"
              >
                로그아웃
              </button>
            )}
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="메뉴"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* 모바일 메뉴 드롭다운 */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-3 border-t border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 mt-1 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
              >
                로그아웃
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
