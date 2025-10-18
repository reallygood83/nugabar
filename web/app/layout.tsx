import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "누가바 - 학생 행동특성 및 누가기록 생성기",
  description: "AI 기반 학생 행동특성 및 누가기록 자동 생성 시스템. 교사의 업무 효율을 높이는 스마트한 교육 도구입니다.",
  keywords: ["누가기록", "행동특성", "교사", "AI", "자동생성", "NEIS", "학생기록", "교육"],
  authors: [{ name: "누가바" }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://nuga-bar.vercel.app',
    siteName: '누가바',
    title: '누가바 - AI 기반 학생 기록 생성기',
    description: '교사의 업무 부담을 줄이는 스마트한 AI 도구. 행동특성 및 누가기록을 몇 초 만에 자동 생성하세요.',
    images: [
      {
        url: 'https://nuga-bar.vercel.app/opengraph-image',
        width: 1200,
        height: 630,
        alt: '누가바 - 학생 행동특성 및 누가기록 생성기',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '누가바 - AI 기반 학생 기록 생성기',
    description: '교사의 업무 부담을 줄이는 스마트한 AI 도구. 행동특성 및 누가기록을 몇 초 만에 자동 생성하세요.',
    images: ['https://nuga-bar.vercel.app/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://nuga-bar.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <footer className="border-t border-border mt-8">
            <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
              <p className="text-muted-foreground">
                © {new Date().getFullYear()} 누가바 ·
                <a
                  href="https://www.youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground ml-1"
                >
                  배움의 달인 유튜브
                </a>
              </p>
              <a
                href="https://open.kakao.com/o/gubGYQ7g"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-3 py-1.5 hover:bg-primary/90"
              >
                개발자에 연락하기
              </a>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
