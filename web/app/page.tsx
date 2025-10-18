'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  const { user, loading, signInWithGoogle, logout, isDevMode } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Notion-inspired */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                누
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-gray-900">누가바</h1>
                <p className="text-xs text-gray-500">학생 행동특성 및 누가기록 생성기</p>
              </div>
            </div>
            {user && (
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
              >
                로그아웃
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Dev Mode Banner */}
      {isDevMode && (
        <div className="border-b border-border bg-secondary">
          <div className="container mx-auto px-4 py-2">
            <p className="text-xs text-center font-medium">
              🔧 개발 모드 활성화됨 - Google 로그인 없이 접속 가능
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="max-w-md mx-auto mt-24">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl mb-6 shadow-lg">
                <span className="text-white font-bold text-2xl">누</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">누가바</h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                AI 기반 학생 행동특성 및 누가기록 생성기
                <br />
                업무 시간을 90% 절감하세요
              </p>
            </div>

            {/* Login Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center space-y-3 pb-6">
                <CardTitle className="text-xl font-semibold text-gray-900">시작하기</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Google 계정으로 간편하게 로그인하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <Button
                  onClick={signInWithGoogle}
                  variant="outline"
                  className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google로 계속하기
                </Button>
                <p className="text-xs text-center text-gray-500 mt-4">
                  로그인 시{' '}
                  <span className="text-gray-700 font-medium">개인정보 처리방침</span>에 동의하게 됩니다
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Welcome Card */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">
                  환영합니다, {user.displayName || user.email?.split('@')[0]}님
                </CardTitle>
                <CardDescription>
                  AI 기반 생활기록부 작성 도구로 업무 시간을 90% 절감하세요
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Main Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/behavior-characteristics">
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">📝</span>
                      행동특성 생성
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      63개 키워드 선택으로 나이스 규정에 맞는 행동특성 자동 생성
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>9개 카테고리별 맞춤 키워드</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>AI 기반 전문적 문장 생성</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>나이스 규정 자동 검증</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/cumulative-records">
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">📋</span>
                      누가기록 생성
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      학생 정보와 활동 내용으로 완성도 높은 누가기록 작성
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>자동 날짜 생성 (공휴일 제외)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>학생별 맞춤형 기록</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>일괄 생성 지원</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/class-management">
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🏫</span>
                      학급 관리
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      학급별 학생 등록 및 누가기록 데이터 체계적 관리
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>학생 이름 자동 마스킹 (개인정보 보호)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>학생별 누가기록 누적 저장</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>엑셀 파일 일괄 다운로드</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Features Overview */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-lg">주요 기능</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium text-sm">AI 기반 자동 생성</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Google Gemini API로 전문적 문장 생성
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium text-sm">나이스 규정 준수</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        금지 표현 자동 필터링 및 교정
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium text-sm">교사별 데이터 보안</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        개인정보 암호화 및 격리 저장
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium text-sm">업무 시간 90% 절감</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        수작업 대비 자동화로 대폭 단축
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>


    </div>
  );
}
