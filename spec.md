# 누가바(NugaBar) 웹 애플리케이션 개발 명세서

> **프로젝트명**: NugaBar Web Application
> **버전**: 2.0 (Web Migration from Google Apps Script)
> **작성일**: 2025-01-27
> **작성자**: Moon

---

## ⚠️ **핵심 개발 원칙 (최우선 준수 사항)**

> **이 프로젝트는 단순한 신규 개발이 아닌, 검증된 시스템의 웹 전환입니다.**

### 🔒 **필수 보존 요구사항 (Non-Negotiable)**

1. **모든 핵심 기능 100% 보존**
   - 63개 키워드 × 9개 카테고리 체계 완전 동일
   - AI 프롬프트 텍스트 한 글자도 변경 금지
   - 나이스 규정 검증 로직 정규식 100% 동일
   - Fallback 템플릿 문구 완전 보존

2. **Apps Script 함수 로직 완전 이관**
   - 각 함수의 알고리즘 및 로직 100% 보존
   - 변수명, 상수명 유사하게 유지 (추적 가능성)
   - 에러 처리 방식 동일하게 적용
   - 데이터 검증 규칙 그대로 이관

3. **사용자 경험 동일성 보장**
   - 키워드 선택 UI/UX 동일한 방식 제공
   - 생성 결과 품질 동일 수준 유지
   - 복사/다운로드 기능 동일하게 제공

4. **검증 기준**
   - ✅ Apps Script 버전과 동일한 입력 → 동일한 출력
   - ✅ 모든 Edge Case 동일하게 처리
   - ✅ 나이스 규정 검증 통과율 동일

### 📋 **Apps Script 코드 이관 체크리스트**

#### **필수 이관 함수 목록** (Code.gs):
- ✅ `createBehaviorCharacteristicsPrompt()` → 프롬프트 100% 동일
- ✅ `generateBehaviorCharacteristics()` → Gemini API 설정 동일
- ✅ `generateBehaviorCharacteristicsFallback()` → 템플릿 100% 보존
- ✅ `createCumulativeRecordsPrompt()` → 프롬프트 100% 동일
- ✅ `generateCumulativeRecords()` → 날짜 생성 로직 동일
- ✅ `generateCumulativeRecordsFallback()` → 템플릿 100% 보존
- ✅ `generateCumulativeRecordsForStudents()` → 배치 로직 보존
- ✅ `checkNeisCompliance()` → 정규식 패턴 100% 동일
- ✅ `ensureNeisCompliance()` → 3단계 검증 보존
- ✅ `validateDetailedNeisCompliance()` → 상세 검증 동일
- ✅ `validateAndCorrectNounEndings()` → 교정 로직 동일
- ✅ `checkNounEndingCompliance()` → 검증 패턴 동일
- ✅ `getKoreanHolidays()` → 공휴일 데이터 100% 보존
- ✅ `generateRandomSchoolDate()` → 날짜 알고리즘 동일
- ✅ `updateKeywordFrequency()` → 통계 로직 보존
- ✅ `getPopularKeywords()` → TOP 10 로직 동일

#### **필수 이관 상수 및 데이터**:
- ✅ `OBSERVATION_CATEGORIES` (63개 키워드) → Firestore 완전 이관
- ✅ 공휴일 데이터 (2024-2030년) → 완전 보존
- ✅ 나이스 금지 표현 목록 → 100% 동일
- ✅ Fallback 템플릿 문구 → 100% 동일

---

## 📋 **목차**

1. [프로젝트 개요](#1-프로젝트-개요)
2. [현재 시스템 분석](#2-현재-시스템-분석)
3. [기술 스택](#3-기술-스택)
4. [시스템 아키텍처](#4-시스템-아키텍처)
5. [데이터베이스 설계](#5-데이터베이스-설계)
6. [보안 요구사항](#6-보안-요구사항)
7. [UI/UX 설계](#7-uiux-설계)
8. [핵심 기능 명세](#8-핵심-기능-명세)
9. [API 명세](#9-api-명세)
10. [배포 전략](#10-배포-전략)
11. [개발 로드맵](#11-개발-로드맵)
12. [테스트 전략](#12-테스트-전략)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목적

**누가바(NugaBar)**는 교사의 생활기록부 작성 업무를 자동화하는 AI 기반 웹 애플리케이션입니다.

**핵심 가치**:
- ⏰ **업무 시간 90% 절감**: 수작업 대비 자동화로 대폭 단축
- 📝 **품질 일관성 보장**: AI 기반 전문적 문장 생성
- ✅ **나이스 규정 준수**: 자동 검증 및 교정 시스템
- 🔒 **개인정보 보호**: 암호화 기반 안전한 데이터 관리

### 1.2 전환 배경

**현재 Google Apps Script 버전의 한계**:
- 🚨 **심각한 아키텍처 문제**: 모든 사용자 데이터가 배포자 계정에 누적
- 📊 **확장성 부족**: 동시 접속 처리 제한, API 할당량 공유
- 🔓 **보안 취약**: 개인정보 보호법 위반 가능성
- 💾 **스토리지 폭탄**: 사용자 증가 시 배포자 드라이브 용량 한계

**웹 전환의 이점**:
- ✅ **사용자 중심 데이터 관리**: 각 교사가 자신의 데이터 완전 제어
- ✅ **무제한 확장성**: Firebase + Vercel 조합으로 자동 스케일링
- ✅ **개인정보 보호 완벽 준수**: 암호화 + 격리된 데이터베이스
- ✅ **사용자별 API 키**: 할당량 독립, 비용 분산

### 1.3 목표 사용자

**Primary**: 초·중·고 교사 (생활기록부 작성 업무 담당자)
**Secondary**: 학교 관리자, 교육청 담당자
**Target Scale**: 월간 활성 사용자 1,000명 → 10,000명 (1년 내)

---

## 2. 현재 시스템 분석

### 2.1 기존 기능 목록

> ⚠️ **중요**: 아래 모든 핵심 기능, 가이드라인, AI 프롬프트는 **반드시 웹 버전에서도 100% 유지되거나 업그레이드**되어야 합니다. 단순화나 제거를 금지합니다.

#### ✅ **유지할 핵심 기능** (필수 보존 - Non-Negotiable)

1. **행동특성 및 종합의견 생성**
   - ✅ **63개 키워드 × 9개 카테고리 체계** → 완전히 동일하게 Firestore로 이관
   - ✅ **AI 기반 자연스러운 문장 생성** → 기존 Gemini 프롬프트 로직 100% 유지
   - ✅ **성취수준 자동 판단** (매우잘함/잘함/보통/노력요함) → 동일 알고리즘 적용
   - ✅ **맥락 정보 활용** (학년, 성별, 과목 등) → 기존 `createBehaviorCharacteristicsPrompt()` 로직 이관

2. **누가기록 자동 생성**
   - ✅ **학생별 5~10개 관찰 기록 생성** → `generateCumulativeRecords()` 함수 로직 이관
   - ✅ **날짜 자동 설정** (평일 + 공휴일 제외) → `generateRandomSchoolDate()` + `getKoreanHolidays()` 이관
   - ✅ **나이스 규정 자동 검증** → `checkNeisCompliance()` + `ensureNeisCompliance()` 이관
   - ✅ **Fallback 시스템** → `generateCumulativeRecordsFallback()` 템플릿 방식 유지

3. **키워드 데이터베이스** (완전 보존)
   - ✅ **9개 카테고리**: 학습태도, 학업성취, 사회성, 도덕성, 창의성, 진로/특기, 주의사항, 특별활동, 기타
   - ✅ **카테고리별 7~8개 키워드** (총 63개) → `OBSERVATION_CATEGORIES` 상수를 Firestore 컬렉션으로 이관
   - ✅ **키워드 메타데이터**: 설명, 예시, 사용 빈도 → 모든 필드 보존
   - ✅ **키워드 사용 빈도 통계** → `updateKeywordFrequency()` 로직 유지

4. **나이스 규정 준수 시스템** (검증 로직 100% 이관)
   - ✅ **금지 표현 자동 교체** → `checkNeisCompliance()` 정규식 패턴 100% 보존
   - ✅ **문장 종결 규칙 검증** → `validateDetailedNeisCompliance()` 로직 유지
   - ✅ **명사형 어미 교정** → `validateAndCorrectNounEndings()` + `checkNounEndingCompliance()` 이관
   - ✅ **3단계 검증 프로세스** → 생성 → 1차 검증 → 교정 → 2차 검증 플로우 유지

5. **AI 프롬프트 시스템** (프롬프트 엔지니어링 100% 보존)
   - ✅ **행동특성 프롬프트** → `createBehaviorCharacteristicsPrompt()` 텍스트 완전 이관
   - ✅ **누가기록 프롬프트** → `createCumulativeRecordsPrompt()` 텍스트 완전 이관
   - ✅ **System Instruction** → Gemini API 호출 시 사용하는 모든 시스템 프롬프트 보존
   - ✅ **Fallback 템플릿** → AI 실패 시 사용하는 모든 템플릿 문구 보존

#### 🔧 **개선할 기능**
1. **데이터 저장 방식**
   - 현재: Google Sheets → 개선: Firebase Firestore
   - 사용자별 격리된 데이터베이스
   - 실시간 동기화 및 백업

2. **AI API 관리**
   - 현재: 단일 공유 API 키 → 개선: 사용자별 API 키 입력
   - Gemini API + Fallback 시스템 유지
   - 사용량 모니터링 및 알림

3. **워크스페이스 시스템**
   - 현재: 스프레드시트 → 개선: 웹 기반 학생 DB
   - CRUD 작업 UI 개선
   - 일괄 업로드 (CSV/Excel)

### 2.2 제거할 기능

- ❌ Google Sheets 의존성 (전면 제거)
- ❌ 배포자 계정 중심 설계
- ❌ 스크립트 속성 기반 설정 저장

---

## 3. 기술 스택

### 3.1 프론트엔드

#### **프레임워크 및 라이브러리**
```yaml
Framework: Next.js 14 (App Router)
Language: TypeScript 5.3+
UI Library: shadcn/ui (Radix UI + Tailwind CSS)
State Management: Zustand + React Query
Form Handling: React Hook Form + Zod
Styling: Tailwind CSS 3.4+
Icons: Lucide React
Chart: Recharts (통계 대시보드)
```

#### **핵심 의존성**
```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.20.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "lucide-react": "^0.320.0",
    "recharts": "^2.12.0"
  }
}
```

### 3.2 백엔드

#### **서버리스 아키텍처**
```yaml
Platform: Vercel (Serverless Functions)
Runtime: Node.js 20.x
API Framework: Next.js API Routes (App Router)
Validation: Zod
Authentication: Firebase Auth
```

#### **AI 통합**
```yaml
Primary AI: Google Gemini API (gemini-1.5-pro)
Fallback: Rule-based Template System
API Client: @google/generative-ai
```

### 3.3 데이터베이스

#### **Firebase 전체 스택**
```yaml
Database: Firebase Firestore (NoSQL)
Authentication: Firebase Authentication (Google OAuth)
Storage: Firebase Storage (파일 업로드)
Security: Firebase Security Rules
Hosting: Vercel (Frontend), Firebase Functions (Background Jobs)
```

#### **Firestore 컬렉션 구조**
```
/users/{userId}
  - email, displayName, createdAt, settings

/users/{userId}/students/{studentId}
  - studentNumber, name, class, birthDate, gender, notes (암호화)

/users/{userId}/keywords/{keywordId}
  - categoryId, keywordId, intensity, context, createdAt

/users/{userId}/behaviorRecords/{recordId}
  - studentId, text, selectedKeywords, characterCount, createdAt

/users/{userId}/cumulativeRecords/{recordId}
  - studentId, date, text, characterCount, createdAt

/sharedKeywords (전역)
  - 63개 키워드 데이터베이스
```

### 3.4 배포 및 인프라

```yaml
Frontend Hosting: Vercel
Edge Network: Vercel Edge Network (CDN)
Domain: Custom Domain (예: nugabar.app)
SSL: Vercel 자동 SSL (Let's Encrypt)
CI/CD: GitHub Actions + Vercel Git Integration
Monitoring: Vercel Analytics + Firebase Analytics
Error Tracking: Sentry (선택사항)
```

### 3.5 개발 도구

```yaml
Package Manager: pnpm
Version Control: Git + GitHub
Code Quality: ESLint + Prettier
Type Checking: TypeScript Strict Mode
Testing: Vitest + React Testing Library
E2E Testing: Playwright
Pre-commit Hooks: Husky + lint-staged
```

---

## 4. 시스템 아키텍처

### 4.1 전체 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                        사용자 (교사)                          │
│                    Google 계정 로그인                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                       │
│              (CDN, SSL, DDoS Protection)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Next.js 14 Application                      │
│                    (App Router, RSC)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  프론트엔드 (React + shadcn/ui)                     │   │
│  │  - 행동특성 생성 UI                                 │   │
│  │  - 누가기록 생성 UI                                 │   │
│  │  - 학생 DB 관리 UI                                  │   │
│  │  - 대시보드 및 통계                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Routes (Serverless Functions)                  │   │
│  │  - /api/auth/*         (인증)                       │   │
│  │  - /api/students/*     (학생 CRUD)                  │   │
│  │  - /api/generate/*     (AI 생성)                    │   │
│  │  - /api/keywords/*     (키워드 DB)                  │   │
│  │  - /api/records/*      (기록 관리)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────┬──────────────────────────┬─────────────────────┘
             │                          │
             ↓                          ↓
┌─────────────────────────┐  ┌──────────────────────────────┐
│   Firebase Services     │  │   Google Gemini API          │
│  ┌──────────────────┐   │  │  ┌────────────────────────┐ │
│  │  Authentication  │   │  │  │  gemini-1.5-pro        │ │
│  │  (Google OAuth)  │   │  │  │  (텍스트 생성)         │ │
│  └──────────────────┘   │  │  └────────────────────────┘ │
│                          │  │                              │
│  ┌──────────────────┐   │  │  Fallback: Template System  │
│  │   Firestore      │   │  │  (API 실패 시 대체)         │
│  │  (사용자 DB)     │   │  └──────────────────────────────┘
│  │  - 암호화 저장   │   │
│  │  - 실시간 동기화 │   │
│  └──────────────────┘   │
│                          │
│  ┌──────────────────┐   │
│  │  Cloud Storage   │   │
│  │  (파일 업로드)   │   │
│  └──────────────────┘   │
└─────────────────────────┘
```

### 4.2 데이터 흐름

#### **학생 데이터 입력 플로우**
```
사용자 입력 (학생 정보)
    ↓
클라이언트 측 암호화 (AES-256)
    ↓
API Route: POST /api/students
    ↓
서버 측 검증 (Zod Schema)
    ↓
Firebase Firestore 저장
    ↓
암호화된 데이터 저장 완료
    ↓
클라이언트 복호화하여 표시
```

#### **행동특성 생성 플로우**
```
사용자 키워드 선택
    ↓
프론트엔드에서 선택 키워드 전송
    ↓
API Route: POST /api/generate/behavior
    ↓
사용자 API 키 확인 (없으면 공용 키)
    ↓
Gemini API 호출 (Prompt + System Instruction)
    ↓
AI 응답 수신
    ↓
나이스 규정 검증 및 교정
    ↓
Firestore에 기록 저장
    ↓
클라이언트에 결과 반환
```

### 4.3 보안 레이어

```
┌─────────────────────────────────────────┐
│  Level 1: Transport Security            │
│  - HTTPS/TLS 1.3                        │
│  - Vercel Edge Network DDoS Protection  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Level 2: Authentication                │
│  - Firebase Auth (Google OAuth)         │
│  - JWT Token 검증                       │
│  - Session Management                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Level 3: Authorization                 │
│  - Firestore Security Rules             │
│  - 사용자별 데이터 격리                 │
│  - API Route 권한 검증                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Level 4: Data Encryption               │
│  - 학생 개인정보 AES-256 암호화         │
│  - 암호화 키는 사용자별 분리            │
│  - 복호화는 클라이언트에서만 수행       │
└─────────────────────────────────────────┘
```

---

## 5. 데이터베이스 설계

### 5.1 Firestore 컬렉션 스키마

#### **Users Collection**
```typescript
// /users/{userId}
interface User {
  uid: string;                    // Firebase Auth UID
  email: string;                  // Google 계정 이메일
  displayName: string;            // 사용자 이름
  photoURL?: string;              // 프로필 사진
  school?: string;                // 학교명

  // 설정
  settings: {
    geminiApiKey?: string;        // 개인 Gemini API 키 (암호화 저장)
    useSharedApiKey: boolean;     // 공용 API 키 사용 여부
    theme: 'light' | 'dark';      // UI 테마
    autoSave: boolean;            // 자동 저장 여부
  };

  // 암호화 관련
  encryptionKeyHash: string;      // 암호화 키 해시 (검증용)

  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

#### **Students Subcollection**
```typescript
// /users/{userId}/students/{studentId}
interface Student {
  id: string;                     // 자동 생성 ID
  studentNumber: string;          // 학생 번호 (암호화)

  // 암호화된 개인정보 (AES-256)
  encryptedData: {
    name: string;                 // 이름 (암호화)
    class: string;                // 학급 (암호화)
    birthDate: string;            // 생년월일 (암호화)
    gender: 'M' | 'F';            // 성별 (암호화)
    notes?: string;               // 특이사항 (암호화)
  };

  // 암호화 메타데이터
  iv: string;                     // AES Initialization Vector
  salt: string;                   // 암호화 솔트

  // 메타데이터 (암호화 불필요)
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;              // 활성 상태 (졸업생 비활성화)
}
```

#### **BehaviorRecords Subcollection**
```typescript
// /users/{userId}/behaviorRecords/{recordId}
interface BehaviorRecord {
  id: string;
  studentId: string;              // students 컬렉션 참조
  studentName: string;            // 빠른 조회용 (암호화 X)

  // 생성된 텍스트
  text: string;                   // 행동특성 및 종합의견
  characterCount: number;         // 글자 수

  // 선택된 키워드
  selectedKeywords: Array<{
    categoryId: string;
    categoryName: string;
    keywordId: string;
    keywordText: string;
    intensity: number;            // 1~5
    context?: string;             // 맥락 설명
  }>;

  // AI 생성 정보
  achievementLevel: '매우잘함' | '잘함' | '보통' | '노력요함';
  generatedBy: 'gemini' | 'fallback';
  modelVersion?: string;          // 사용된 AI 모델 버전

  // 나이스 검증
  neisCompliant: boolean;
  validationIssues?: string[];    // 검증 시 발견된 문제들

  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **CumulativeRecords Subcollection**
```typescript
// /users/{userId}/cumulativeRecords/{recordId}
interface CumulativeRecord {
  id: string;
  studentId: string;
  studentName: string;

  // 누가기록 내용
  date: string;                   // YYYY-MM-DD 형식
  text: string;                   // 관찰 기록 텍스트
  characterCount: number;

  // 생성 정보
  generatedBy: 'gemini' | 'fallback';
  sourceKeywords?: string[];      // 기반이 된 키워드들

  // 메타데이터
  createdAt: Timestamp;
  semester: '1학기' | '2학기';
  academicYear: number;           // 학년도
}
```

#### **Keywords Subcollection**
```typescript
// /users/{userId}/keywords/{keywordId}
interface KeywordUsage {
  id: string;
  categoryId: string;
  categoryName: string;
  keywordId: string;
  keywordText: string;

  // 사용 통계
  usageCount: number;             // 사용 횟수
  lastUsedAt: Timestamp;

  // 커스텀 설정
  customWeight?: number;          // 사용자 정의 가중치
  customAutoText?: string;        // 커스텀 자동 텍스트
}
```

#### **Shared Keywords (전역)**
```typescript
// /sharedKeywords/{categoryId}
interface SharedKeywordCategory {
  id: string;                     // 카테고리 ID
  name: string;                   // 카테고리 이름
  description: string;
  order: number;                  // 표시 순서
  color: string;                  // UI 색상

  keywords: Array<{
    id: string;                   // 키워드 ID
    text: string;                 // 키워드 텍스트
    weight: number;               // 가중치 (1~5)
    positivity: 'positive' | 'neutral' | 'negative';
    autoText: string;             // 자동 생성 텍스트
    description: string;          // 설명
  }>;

  updatedAt: Timestamp;
}
```

### 5.2 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper Functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users Collection
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if false; // 사용자 삭제 금지 (데이터 보호)

      // Students Subcollection
      match /students/{studentId} {
        allow read, write: if isOwner(userId);
      }

      // Behavior Records Subcollection
      match /behaviorRecords/{recordId} {
        allow read, write: if isOwner(userId);
      }

      // Cumulative Records Subcollection
      match /cumulativeRecords/{recordId} {
        allow read, write: if isOwner(userId);
      }

      // Keywords Subcollection
      match /keywords/{keywordId} {
        allow read, write: if isOwner(userId);
      }
    }

    // Shared Keywords (전역 읽기 전용)
    match /sharedKeywords/{categoryId} {
      allow read: if isAuthenticated();
      allow write: if false; // 관리자만 수정 가능 (별도 Admin SDK)
    }
  }
}
```

### 5.3 인덱스 설정

```javascript
// Firestore 복합 인덱스 (firebase console에서 자동 생성 또는 수동 설정)
[
  {
    "collectionGroup": "behaviorRecords",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "studentId", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "cumulativeRecords",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "studentId", "order": "ASCENDING" },
      { "fieldPath": "date", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "students",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "isActive", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]
  }
]
```

---

## 6. 보안 요구사항

### 6.1 학생 개인정보 암호화

#### **암호화 전략**

**클라이언트 측 암호화 (End-to-End Encryption)**
- **알고리즘**: AES-256-GCM
- **키 생성**: PBKDF2 (Password-Based Key Derivation Function 2)
- **솔트**: 사용자별 랜덤 생성 (crypto.getRandomValues)
- **IV (Initialization Vector)**: 레코드별 랜덤 생성

#### **암호화 구현**

```typescript
// lib/crypto.ts
import crypto from 'crypto';

/**
 * 사용자 비밀번호로부터 암호화 키 생성
 */
export async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  // PBKDF2로 키 생성
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * 학생 데이터 암호화
 */
export async function encryptStudentData(
  data: StudentData,
  encryptionKey: CryptoKey
): Promise<EncryptedData> {
  const encoder = new TextEncoder();
  const dataString = JSON.stringify(data);
  const dataBuffer = encoder.encode(dataString);

  // 랜덤 IV 생성
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // AES-GCM 암호화
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    encryptionKey,
    dataBuffer
  );

  return {
    encryptedData: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(iv)
  };
}

/**
 * 학생 데이터 복호화
 */
export async function decryptStudentData(
  encryptedData: string,
  iv: string,
  encryptionKey: CryptoKey
): Promise<StudentData> {
  const encryptedBuffer = base64ToBuffer(encryptedData);
  const ivBuffer = base64ToBuffer(iv);

  // AES-GCM 복호화
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuffer },
    encryptionKey,
    encryptedBuffer
  );

  const decoder = new TextDecoder();
  const dataString = decoder.decode(decryptedBuffer);
  return JSON.parse(dataString);
}
```

#### **암호화 키 관리**

**전략 1: 사용자 비밀번호 기반 (Phase 1)**
```typescript
// 사용자가 설정한 마스터 비밀번호로 암호화 키 생성
// 장점: 서버에 키 저장 불필요, 완전한 E2E 암호화
// 단점: 비밀번호 분실 시 복구 불가

interface EncryptionSetup {
  masterPassword: string;      // 사용자 설정 비밀번호
  salt: string;                // 자동 생성 솔트
  keyHash: string;             // 검증용 해시
}
```

**전략 2: Firebase Auth UID 기반 (Phase 2 - 선택사항)**
```typescript
// Firebase Auth UID를 기반으로 키 생성
// 장점: 사용자가 비밀번호 기억 불필요
// 단점: Firebase에서 일부 복호화 가능성
```

### 6.2 인증 및 권한 관리

#### **Firebase Authentication 설정**

```typescript
// lib/firebase-auth.ts
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();

/**
 * Google 로그인
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 사용자 정보를 Firestore에 저장/업데이트
    await createOrUpdateUser(user);

    return { success: true, user };
  } catch (error) {
    console.error('Google 로그인 실패:', error);
    return { success: false, error };
  }
}

/**
 * 로그아웃
 */
export async function signOut() {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    console.error('로그아웃 실패:', error);
    return { success: false, error };
  }
}
```

#### **API Route 권한 검증**

```typescript
// middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';

export async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return { uid: decodedToken.uid, email: decodedToken.email };
  } catch (error) {
    return NextResponse.json({ error: '유효하지 않은 토큰' }, { status: 401 });
  }
}

// API Route 예시
export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult; // 인증 실패 응답 반환
  }

  const { uid } = authResult;
  // 인증된 사용자의 요청 처리...
}
```

### 6.3 환경 변수 관리

```bash
# .env.local (로컬 개발)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# 서버 전용 (노출 금지)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key

# Gemini API (공용 키 - 선택사항)
GEMINI_API_KEY=your_shared_gemini_key
```

```javascript
// Vercel 환경 변수 설정 (Production)
// Vercel Dashboard → Settings → Environment Variables
// - NEXT_PUBLIC_* : 클라이언트 노출 허용
// - 기타: 서버 전용 (암호화 저장)
```

### 6.4 데이터 보호 정책

#### **개인정보 처리 방침**

1. **수집 항목**
   - 필수: Google 계정 이메일, 이름, 프로필 사진
   - 선택: 학교명, 학생 정보 (암호화 저장)

2. **보유 기간**
   - 사용자 계정 삭제 시 즉시 영구 삭제
   - 백업 데이터: 30일 후 자동 삭제

3. **제3자 제공**
   - 원칙적으로 제공 금지
   - AI API (Gemini) 전송 시 학생 개인정보 제외

4. **사용자 권리**
   - 열람권, 정정권, 삭제권 보장
   - 데이터 다운로드 기능 제공 (JSON/CSV)

---

## 7. UI/UX 설계

### 7.1 디자인 시스템 (shadcn/ui)

#### **테마 컬러 팔레트**

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Light Mode
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',  // Indigo - 메인 컬러
          600: '#4F46E5',
          700: '#4338CA',
        },
        secondary: {
          50: '#F0FDF4',
          500: '#10B981',  // Emerald - 성공/긍정
          600: '#059669',
        },
        accent: {
          50: '#FFF7ED',
          500: '#F97316',  // Orange - 강조/경고
          600: '#EA580C',
        },
        // Dark Mode
        dark: {
          bg: '#0F172A',    // Slate 900
          card: '#1E293B',  // Slate 800
          border: '#334155', // Slate 700
        }
      }
    }
  }
}
```

#### **타이포그래피**

```css
/* globals.css */
@layer base {
  :root {
    /* Font Family */
    --font-sans: -apple-system, BlinkMacSystemFont, 'Pretendard', 'Segoe UI', sans-serif;
    --font-mono: 'JetBrains Mono', 'Consolas', monospace;

    /* Font Sizes */
    --text-xs: 0.75rem;    /* 12px */
    --text-sm: 0.875rem;   /* 14px */
    --text-base: 1rem;     /* 16px */
    --text-lg: 1.125rem;   /* 18px */
    --text-xl: 1.25rem;    /* 20px */
    --text-2xl: 1.5rem;    /* 24px */
    --text-3xl: 1.875rem;  /* 30px */
    --text-4xl: 2.25rem;   /* 36px */
  }
}
```

#### **Spacing System**

```typescript
// 8px 기반 스페이싱
const spacing = {
  0: '0px',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
}
```

### 7.2 페이지 구조

#### **라우팅 구조**

```
/                          → 랜딩 페이지
/auth/signin              → 로그인 페이지
/dashboard                → 대시보드 (홈)
/students                 → 학생 관리
  ├── /students/add       → 학생 추가
  └── /students/[id]      → 학생 상세
/generate                 → 생성 탭
  ├── /generate/behavior  → 행동특성 생성
  └── /generate/records   → 누가기록 생성
/history                  → 생성 이력
/settings                 → 설정
  ├── /settings/profile   → 프로필
  ├── /settings/security  → 보안 (암호화 키)
  └── /settings/api       → API 설정
```

#### **레이아웃 구조**

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

// app/(protected)/layout.tsx (인증 필요 페이지)
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <Header />
        {children}
      </main>
    </div>
  );
}
```

### 7.3 주요 컴포넌트 (shadcn/ui 기반)

#### **대시보드**

```tsx
// app/dashboard/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Users, FileText, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          새 기록 생성
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 학생</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24명</div>
            <p className="text-xs text-muted-foreground">+2명 (이번 학기)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">생성된 행동특성</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87건</div>
            <p className="text-xs text-muted-foreground">+12건 (이번 주)</p>
          </CardContent>
        </Card>

        {/* 더 많은 통계 카드... */}
      </div>

      {/* 최근 활동 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 생성 기록</CardTitle>
          <CardDescription>지난 7일간 생성된 행동특성 및 누가기록</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 활동 목록 */}
        </CardContent>
      </Card>
    </div>
  );
}
```

#### **학생 관리**

```tsx
// app/students/page.tsx
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Upload } from 'lucide-react';

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">학생 관리</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            일괄 업로드
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            학생 추가
          </Button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="학생 이름 또는 학번 검색..."
            className="pl-10"
          />
        </div>
        {/* 필터 버튼들 */}
      </div>

      {/* 학생 목록 테이블 (shadcn/ui DataTable) */}
      <DataTable columns={studentColumns} data={students} />
    </div>
  );
}
```

#### **행동특성 생성**

```tsx
// app/generate/behavior/page.tsx
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Copy, Download } from 'lucide-react';

export default function BehaviorGeneratePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">행동특성 및 종합의견 생성</h1>
        <Badge variant="secondary">AI 기반 자동 생성</Badge>
      </div>

      {/* 학생 선택 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">학생 선택</h2>
        {/* 학생 선택 드롭다운 */}
      </Card>

      {/* 키워드 선택 (9개 카테고리 탭) */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">키워드 선택</h2>
        <Tabs defaultValue="learning_attitude">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="learning_attitude">학습태도</TabsTrigger>
            <TabsTrigger value="achievement">학업성취</TabsTrigger>
            <TabsTrigger value="social">사회성</TabsTrigger>
            {/* 더 많은 탭... */}
          </TabsList>

          <TabsContent value="learning_attitude" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* 키워드 버튼들 */}
              <Button variant="outline" className="justify-start">
                적극적 참여
              </Button>
              {/* 더 많은 키워드... */}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* 생성 버튼 */}
      <div className="flex justify-center">
        <Button size="lg" className="gap-2">
          <Sparkles className="h-5 w-5" />
          행동특성 생성하기
        </Button>
      </div>

      {/* 생성 결과 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">생성 결과</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              복사
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              다운로드
            </Button>
          </div>
        </div>
        <Textarea
          className="min-h-[200px] font-sans"
          placeholder="생성된 행동특성 및 종합의견이 여기에 표시됩니다..."
          readOnly
        />

        {/* 통계 정보 */}
        <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
          <span>글자 수: 342자</span>
          <span>성취수준: 잘함</span>
          <span>나이스 준수: ✓</span>
        </div>
      </Card>
    </div>
  );
}
```

### 7.4 반응형 디자인

#### **브레이크포인트**

```typescript
// Tailwind CSS 기본 브레이크포인트
const breakpoints = {
  sm: '640px',   // 모바일 (가로 모드)
  md: '768px',   // 태블릿
  lg: '1024px',  // 데스크톱
  xl: '1280px',  // 큰 데스크톱
  '2xl': '1536px', // 초대형 화면
};
```

#### **반응형 레이아웃 전략**

```tsx
// 모바일: 싱글 컬럼
// 태블릿: 2컬럼
// 데스크톱: 3-4컬럼
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* 카드들 */}
</div>

// 사이드바: 모바일에서는 숨김, 데스크톱에서 표시
<aside className="hidden lg:block w-64 border-r">
  <Sidebar />
</aside>

// 모바일 메뉴: 햄버거 메뉴
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="lg:hidden">
      <Menu />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <MobileSidebar />
  </SheetContent>
</Sheet>
```

### 7.5 접근성 (Accessibility)

#### **WCAG 2.1 AA 준수**

```tsx
// 키보드 네비게이션
<Button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  클릭
</Button>

// ARIA 레이블
<Button aria-label="학생 추가">
  <PlusCircle />
</Button>

// 스크린 리더 지원
<div role="status" aria-live="polite">
  {loadingMessage}
</div>

// 포커스 표시
className="focus:ring-2 focus:ring-primary focus:outline-none"
```

---

## 8. 핵심 기능 명세

### 8.1 사용자 인증

#### **기능 요구사항**
- ✅ Google 계정 로그인 (OAuth 2.0)
- ✅ 자동 로그인 유지 (Session)
- ✅ 로그아웃
- ✅ 사용자 프로필 관리

#### **구현 세부사항**

```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}

// app/auth/signin/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/lib/firebase-auth';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>누가바에 오신 것을 환영합니다</CardTitle>
          <CardDescription>Google 계정으로 간편하게 시작하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleSignIn} className="w-full">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              {/* Google 아이콘 */}
            </svg>
            Google 계정으로 로그인
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 8.2 학생 데이터 관리

#### **기능 요구사항**
- ✅ 학생 추가/수정/삭제
- ✅ 학생 목록 조회 (페이지네이션, 검색, 필터)
- ✅ 일괄 업로드 (CSV/Excel)
- ✅ 데이터 암호화 (클라이언트 측)

#### **API Routes**

```typescript
// app/api/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/auth';
import { db } from '@/lib/firebase-admin';
import { z } from 'zod';

// 학생 데이터 스키마
const StudentSchema = z.object({
  studentNumber: z.string(),
  encryptedData: z.object({
    name: z.string(),
    class: z.string(),
    birthDate: z.string(),
    gender: z.enum(['M', 'F']),
    notes: z.string().optional(),
  }),
  iv: z.string(),
  salt: z.string(),
});

// POST /api/students - 학생 추가
export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const { uid } = authResult;
  const body = await request.json();

  // 데이터 검증
  const validatedData = StudentSchema.parse(body);

  // Firestore에 저장
  const studentRef = await db
    .collection('users')
    .doc(uid)
    .collection('students')
    .add({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    });

  return NextResponse.json({
    success: true,
    studentId: studentRef.id,
  });
}

// GET /api/students - 학생 목록 조회
export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const { uid } = authResult;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';

  // Firestore 쿼리
  let query = db
    .collection('users')
    .doc(uid)
    .collection('students')
    .where('isActive', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(limit);

  const snapshot = await query.get();
  const students = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ students });
}
```

### 8.3 행동특성 생성

> ⚠️ **Apps Script 코드 이관 필수**: 아래 기능은 `Code.gs`의 해당 함수 로직을 **100% 보존**해야 합니다.

#### **기능 요구사항**
- ✅ 키워드 선택 (9개 카테고리)
- ✅ AI 기반 텍스트 생성 (Gemini API)
- ✅ 나이스 규정 자동 검증
- ✅ 폴백 시스템 (템플릿 기반)
- ✅ 생성 결과 저장

#### **Apps Script 함수 이관 체크리스트**

**필수 이관 함수** (Code.gs):
- ✅ `createBehaviorCharacteristicsPrompt(selectedKeywords, context)` → `lib/prompts.ts`로 이관
  - 프롬프트 텍스트 100% 동일하게 보존
  - 맥락 정보(학년, 성별, 과목 등) 처리 로직 유지
  - 키워드 강도(intensity) 반영 알고리즘 보존

- ✅ `generateBehaviorCharacteristics(selectedKeywords, context)` → `app/api/generate/behavior/route.ts`
  - Gemini API 호출 파라미터 동일 (temperature: 0.7, maxTokens 등)
  - System Instruction 텍스트 완전 보존
  - 성취수준 판단 로직 유지

- ✅ `generateBehaviorCharacteristicsFallback(selectedKeywords, context, reason)` → `lib/fallback.ts`
  - 템플릿 문구 100% 동일하게 보존
  - 키워드별 매핑 로직 유지
  - 실패 사유별 메시지 보존

#### **API Routes**

```typescript
// app/api/generate/behavior/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkNeisCompliance, ensureNeisCompliance } from '@/lib/neis-validator';

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const { uid } = authResult;
  const { studentId, selectedKeywords, userApiKey } = await request.json();

  // 1. 프롬프트 생성
  const prompt = createBehaviorPrompt(selectedKeywords);
  const systemInstruction = `당신은 대한민국 초중고 교사를 위한 전문 생활기록부 작성 AI입니다.
학생의 행동특성 및 종합의견을 나이스(NEIS) 규정에 맞게 작성해주세요.

**필수 규칙**:
1. 문장 종결: "~하였음.", "~보임.", "~나타남."
2. 금지 표현: "~하지 않는다", "부족하다" 등 부정 표현 금지
3. 긍정적 표현: 개선 필요사항도 긍정적으로 서술
4. 구체성: 추상적 표현보다 구체적 사례 중심
5. 글자 수: 300~500자 내외`;

  try {
    // 2. Gemini API 호출
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    let generatedText = result.response.text();

    // 3. 나이스 규정 검증 및 교정
    const compliance = checkNeisCompliance(generatedText);
    if (!compliance.isCompliant) {
      generatedText = ensureNeisCompliance(generatedText);
    }

    // 4. Firestore 저장
    const recordRef = await db
      .collection('users')
      .doc(uid)
      .collection('behaviorRecords')
      .add({
        studentId,
        text: generatedText,
        selectedKeywords,
        characterCount: generatedText.length,
        achievementLevel: determineAchievementLevel(selectedKeywords),
        generatedBy: 'gemini',
        modelVersion: 'gemini-1.5-pro',
        neisCompliant: true,
        createdAt: new Date(),
      });

    return NextResponse.json({
      success: true,
      recordId: recordRef.id,
      text: generatedText,
      characterCount: generatedText.length,
    });

  } catch (error) {
    console.error('Gemini API 오류:', error);

    // 5. 폴백: 템플릿 기반 생성
    const fallbackText = generateBehaviorFallback(selectedKeywords);
    const correctedText = ensureNeisCompliance(fallbackText);

    return NextResponse.json({
      success: true,
      text: correctedText,
      characterCount: correctedText.length,
      generatedBy: 'fallback',
    });
  }
}

// 프롬프트 생성 헬퍼
function createBehaviorPrompt(selectedKeywords: SelectedKeyword[]): string {
  const keywordTexts = selectedKeywords.map((kw) =>
    `- ${kw.categoryName}: ${kw.keywordText} (강도: ${kw.intensity}/5)`
  ).join('\n');

  return `다음 키워드들을 기반으로 학생의 행동특성 및 종합의견을 작성해주세요:

${keywordTexts}

요구사항:
- 선택된 키워드들을 자연스럽게 연결하여 하나의 일관된 서술문으로 작성
- 학생의 강점과 성장 가능성을 중심으로 긍정적으로 서술
- 나이스 규정에 맞게 문장 종결 ("~하였음.", "~보임." 등)
- 300~500자 내외로 작성`;
}
```

### 8.4 누가기록 생성

> ⚠️ **Apps Script 코드 이관 필수**: 아래 기능은 `Code.gs`의 해당 함수 로직을 **100% 보존**해야 합니다.

#### **기능 요구사항**
- ✅ 학생별 5~10개 관찰 기록 생성
- ✅ 날짜 자동 설정 (평일 + 공휴일 제외)
- ✅ 일괄 생성 (전체 학생)
- ✅ 개별 수정 가능

#### **Apps Script 함수 이관 체크리스트**

**필수 이관 함수** (Code.gs):
- ✅ `createCumulativeRecordsPrompt(description, count)` → `lib/prompts.ts`로 이관
  - 프롬프트 텍스트 100% 동일하게 보존
  - 생성 개수(count) 파라미터 활용 로직 유지
  - 날짜 포맷 및 요구사항 텍스트 보존

- ✅ `generateCumulativeRecords(behaviorText, recordCount, options)` → `app/api/generate/cumulative/route.ts`
  - Gemini API 호출 설정 동일 적용
  - 날짜 생성 로직 (`generateRandomSchoolDate()` 연동) 유지
  - 배치 생성 로직 (`generateCumulativeRecordsForStudents()`) 보존

- ✅ `generateCumulativeRecordsFallback(behaviorText, recordCount)` → `lib/fallback.ts`
  - 템플릿 기반 생성 로직 100% 보존
  - 랜덤 문구 선택 알고리즘 유지

- ✅ `getKoreanHolidays(year)` → `lib/holidays.ts`로 이관
  - 2024-2030년 공휴일 데이터 완전 보존
  - 추가 공휴일(대체공휴일, 임시공휴일) 포함

- ✅ `generateRandomSchoolDate(year, startMonth, endMonth)` → `lib/date-generator.ts`
  - 평일 선택 로직 (월~금) 유지
  - 공휴일 제외 알고리즘 보존
  - 학기 중 날짜 범위 설정 로직 유지

#### **API Routes**

```typescript
// app/api/generate/cumulative/route.ts
export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const { uid } = authResult;
  const {
    studentIds,
    behaviorRecordId,
    recordCount = 5,
    dateSettings,
  } = await request.json();

  // 행동특성 텍스트 가져오기
  const behaviorDoc = await db
    .collection('users')
    .doc(uid)
    .collection('behaviorRecords')
    .doc(behaviorRecordId)
    .get();

  const behaviorText = behaviorDoc.data()?.text;

  // 누가기록 생성
  const records = await generateCumulativeRecords(
    behaviorText,
    recordCount,
    dateSettings
  );

  // Firestore 저장
  const batch = db.batch();
  records.forEach((record) => {
    const recordRef = db
      .collection('users')
      .doc(uid)
      .collection('cumulativeRecords')
      .doc();

    batch.set(recordRef, {
      ...record,
      studentId: studentIds[0], // 단일 학생
      createdAt: new Date(),
    });
  });

  await batch.commit();

  return NextResponse.json({
    success: true,
    records,
  });
}

// 누가기록 생성 헬퍼
async function generateCumulativeRecords(
  behaviorText: string,
  count: number,
  dateSettings: DateSettings
): Promise<CumulativeRecord[]> {
  // 랜덤 날짜 생성 (평일 + 공휴일 제외)
  const dates = generateRandomSchoolDates(
    dateSettings.year,
    dateSettings.startMonth,
    dateSettings.endMonth,
    count
  );

  // Gemini API로 누가기록 생성
  const prompt = `다음 행동특성 텍스트를 기반으로 ${count}개의 누가기록을 생성해주세요:

${behaviorText}

각 누가기록은:
- 50~100자 내외
- 구체적인 관찰 사실 중심
- 나이스 규정 준수 (문장 종결: "~함.", "~보임.")
- JSON 배열 형식: [{"date": "YYYY-MM-DD", "text": "..."}]`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const result = await model.generateContent(prompt);
  const records = JSON.parse(result.response.text());

  // 생성된 날짜 할당
  return records.map((record: any, index: number) => ({
    ...record,
    date: dates[index],
    characterCount: record.text.length,
  }));
}
```

### 8.5 나이스 규정 검증 시스템

> ⚠️ **Apps Script 코드 이관 필수**: 나이스 규정 검증은 **핵심 기능**으로 모든 로직을 100% 보존해야 합니다.

#### **기능 요구사항**
- ✅ 금지 표현 자동 교체
- ✅ 문장 종결 규칙 검증
- ✅ 명사형 어미 교정
- ✅ 3단계 검증 프로세스

#### **Apps Script 함수 이관 체크리스트**

**필수 이관 함수** (Code.gs):
- ✅ `checkNeisCompliance(text)` → `lib/neis-validator.ts`로 이관
  - **정규식 패턴 100% 동일하게 보존**
  - 금지 표현 목록 완전 보존:
    - 부정 표현: "~하지 않는다", "~하지 않았다", "부족하다" 등
    - 단정적 표현: "~이다", "~한다" 등
    - 기타 금지 표현
  - 교체 문구 100% 동일하게 유지
  - 검증 결과 형식 보존: `{ isCompliant: boolean, issues: string[], correctedText: string }`

- ✅ `ensureNeisCompliance(text)` → `lib/neis-validator.ts`
  - 1차 검증 후 자동 교정 로직 유지
  - 교정 실패 시 재검증 프로세스 보존
  - 최대 3회 재시도 로직 유지

- ✅ `validateDetailedNeisCompliance(text)` → `lib/neis-validator.ts`
  - 상세 검증 규칙 100% 보존:
    - 문장 종결 검증: "~하였음.", "~보임.", "~나타남."
    - 부적절한 종결어미 검출: "~이다.", "~한다." 등
  - 검증 레벨별 메시지 유지 (경고/오류)

- ✅ `validateAndCorrectNounEndings(text)` → `lib/neis-validator.ts`
  - 명사형 어미 교정 알고리즘 100% 보존
  - "~임.", "~함." 등 올바른 형태로 변환 로직 유지

- ✅ `checkNounEndingCompliance(text)` → `lib/neis-validator.ts`
  - 명사형 어미 검증 정규식 100% 동일
  - 문제 위치 추적 로직 보존

#### **구현 예시**

```typescript
// lib/neis-validator.ts

/**
 * 나이스 규정 검증 결과
 */
interface ComplianceResult {
  isCompliant: boolean;
  issues: string[];
  correctedText?: string;
}

/**
 * 나이스 규정 준수 여부 검증 (Apps Script checkNeisCompliance 이관)
 */
export function checkNeisCompliance(text: string): ComplianceResult {
  const issues: string[] = [];
  let correctedText = text;

  // 1. 금지 표현 검증 및 교체 (Apps Script와 100% 동일)
  const prohibitedPatterns = [
    { pattern: /하지\s*않는다/g, replacement: '하였음' },
    { pattern: /하지\s*않았다/g, replacement: '하였음' },
    { pattern: /부족하다/g, replacement: '개선이 필요함' },
    { pattern: /못한다/g, replacement: '하였음' },
    { pattern: /어렵다/g, replacement: '노력이 필요함' },
    // ... (Apps Script의 모든 금지 표현 패턴 보존)
  ];

  prohibitedPatterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(text)) {
      issues.push(`금지 표현 발견: ${pattern.source}`);
      correctedText = correctedText.replace(pattern, replacement);
    }
  });

  // 2. 문장 종결 검증 (Apps Script validateDetailedNeisCompliance 이관)
  const invalidEndings = [
    /이다\./g,
    /한다\./g,
    /된다\./g,
    // ... (Apps Script의 모든 부적절한 종결어미 보존)
  ];

  invalidEndings.forEach((pattern) => {
    if (pattern.test(text)) {
      issues.push(`부적절한 문장 종결: ${pattern.source}`);
    }
  });

  // 3. 명사형 어미 검증 (Apps Script checkNounEndingCompliance 이관)
  const nounEndingIssues = checkNounEndings(text);
  issues.push(...nounEndingIssues);

  return {
    isCompliant: issues.length === 0,
    issues,
    correctedText: issues.length > 0 ? correctedText : text,
  };
}

/**
 * 나이스 규정 강제 준수 (Apps Script ensureNeisCompliance 이관)
 * 최대 3회 재시도로 완전 준수 보장
 */
export function ensureNeisCompliance(text: string, maxRetries = 3): string {
  let correctedText = text;
  let attempt = 0;

  while (attempt < maxRetries) {
    const result = checkNeisCompliance(correctedText);

    if (result.isCompliant) {
      return correctedText;
    }

    // 교정 적용
    correctedText = result.correctedText || correctedText;

    // 명사형 어미 교정 추가 (Apps Script validateAndCorrectNounEndings 이관)
    correctedText = correctNounEndings(correctedText);

    attempt++;
  }

  return correctedText;
}

/**
 * 명사형 어미 교정 (Apps Script validateAndCorrectNounEndings 이관)
 */
function correctNounEndings(text: string): string {
  const corrections = [
    { pattern: /임\./g, replacement: '였음.' },
    { pattern: /함\./g, replacement: '하였음.' },
    // ... (Apps Script의 모든 명사형 어미 교정 규칙 보존)
  ];

  let corrected = text;
  corrections.forEach(({ pattern, replacement }) => {
    corrected = corrected.replace(pattern, replacement);
  });

  return corrected;
}

/**
 * 명사형 어미 검증 (Apps Script checkNounEndingCompliance 이관)
 */
function checkNounEndings(text: string): string[] {
  const issues: string[] = [];
  const problematicEndings = [
    /[가-힣]+임\./g,
    /[가-힣]+함\./g,
    // ... (Apps Script의 모든 명사형 어미 검증 패턴 보존)
  ];

  problematicEndings.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      issues.push(`명사형 어미 문제: ${matches.join(', ')}`);
    }
  });

  return issues;
}
```

### 8.6 통계 및 대시보드

#### **기능 요구사항**
- ✅ 전체 학생 수
- ✅ 생성된 기록 수 (행동특성, 누가기록)
- ✅ 키워드 사용 빈도 TOP 10
- ✅ 월별 생성 추이 그래프
- ✅ 최근 활동 목록

#### **구현 예시**

```typescript
// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBehaviorRecords: 0,
    totalCumulativeRecords: 0,
    topKeywords: [],
    monthlyTrend: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const response = await fetch('/api/stats', {
      headers: {
        'Authorization': `Bearer ${await getIdToken()}`,
      },
    });
    const data = await response.json();
    setStats(data);
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드 그리드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="전체 학생"
          value={stats.totalStudents}
          icon={<Users />}
        />
        <StatsCard
          title="생성된 행동특성"
          value={stats.totalBehaviorRecords}
          icon={<FileText />}
        />
        <StatsCard
          title="생성된 누가기록"
          value={stats.totalCumulativeRecords}
          icon={<Calendar />}
        />
      </div>

      {/* 월별 생성 추이 그래프 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">월별 생성 추이</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
```

---

## 9. API 명세

### 9.1 인증 API

#### **POST /api/auth/signin**
Google OAuth 로그인 후 사용자 정보 생성/업데이트

**Request**: N/A (Firebase Auth 처리)
**Response**:
```json
{
  "success": true,
  "user": {
    "uid": "firebase_uid",
    "email": "teacher@example.com",
    "displayName": "김선생님"
  }
}
```

### 9.2 학생 관리 API

#### **GET /api/students**
학생 목록 조회

**Query Parameters**:
- `page`: 페이지 번호 (기본: 1)
- `limit`: 페이지당 항목 수 (기본: 20)
- `search`: 검색어
- `isActive`: 활성 상태 필터 (true/false)

**Response**:
```json
{
  "students": [
    {
      "id": "student_id",
      "studentNumber": "20240101",
      "encryptedData": {
        "name": "encrypted_name",
        "class": "encrypted_class",
        "birthDate": "encrypted_birthdate",
        "gender": "M"
      },
      "iv": "initialization_vector",
      "salt": "salt_value",
      "createdAt": "2025-01-27T00:00:00Z",
      "isActive": true
    }
  ],
  "total": 24,
  "page": 1,
  "totalPages": 2
}
```

#### **POST /api/students**
학생 추가

**Request Body**:
```json
{
  "studentNumber": "20240101",
  "encryptedData": {
    "name": "encrypted_name",
    "class": "1-3",
    "birthDate": "2010-05-15",
    "gender": "M",
    "notes": "특이사항"
  },
  "iv": "initialization_vector",
  "salt": "salt_value"
}
```

**Response**:
```json
{
  "success": true,
  "studentId": "new_student_id"
}
```

#### **PATCH /api/students/[id]**
학생 정보 수정

#### **DELETE /api/students/[id]**
학생 삭제 (soft delete: isActive = false)

### 9.3 생성 API

#### **POST /api/generate/behavior**
행동특성 및 종합의견 생성

**Request Body**:
```json
{
  "studentId": "student_id",
  "selectedKeywords": [
    {
      "categoryId": "learning_attitude",
      "categoryName": "학습태도",
      "keywordId": "active_participation",
      "keywordText": "적극적 참여",
      "intensity": 5,
      "context": "수업 시간마다 질문과 발표를 주도함"
    }
  ],
  "userApiKey": "optional_user_gemini_key"
}
```

**Response**:
```json
{
  "success": true,
  "recordId": "record_id",
  "text": "생성된 행동특성 텍스트...",
  "characterCount": 342,
  "achievementLevel": "잘함",
  "generatedBy": "gemini",
  "neisCompliant": true
}
```

#### **POST /api/generate/cumulative**
누가기록 생성

**Request Body**:
```json
{
  "studentIds": ["student_id_1", "student_id_2"],
  "behaviorRecordId": "behavior_record_id",
  "recordCount": 5,
  "dateSettings": {
    "year": 2025,
    "startMonth": 3,
    "endMonth": 7,
    "semester": "1학기"
  }
}
```

**Response**:
```json
{
  "success": true,
  "records": [
    {
      "id": "record_id",
      "studentId": "student_id",
      "date": "2025-03-15",
      "text": "수업 시간에 적극적으로 발표함.",
      "characterCount": 23
    }
  ]
}
```

### 9.4 키워드 API

#### **GET /api/keywords**
전역 키워드 데이터베이스 조회

**Response**:
```json
{
  "categories": [
    {
      "id": "learning_attitude",
      "name": "학습태도",
      "description": "수업 참여도, 집중력, 과제 수행 등",
      "order": 1,
      "color": "#4285F4",
      "keywords": [
        {
          "id": "active_participation",
          "text": "적극적 참여",
          "weight": 5,
          "positivity": "positive",
          "autoText": "수업에 적극적으로 참여하며",
          "description": "발표, 질문, 토론 등에 능동적 참여"
        }
      ]
    }
  ]
}
```

#### **GET /api/keywords/usage**
사용자별 키워드 사용 통계

### 9.5 기록 조회 API

#### **GET /api/records/behavior**
행동특성 기록 목록

#### **GET /api/records/cumulative**
누가기록 목록

#### **GET /api/records/behavior/[id]**
특정 행동특성 기록 상세

---

## 10. 배포 전략

### 10.1 GitHub Repository 구조

```
nugabar-web/
├── .github/
│   └── workflows/
│       ├── ci.yml           # CI: 테스트, 린트, 타입체크
│       └── deploy.yml       # CD: Vercel 배포
├── app/                     # Next.js App Router
├── components/              # React 컴포넌트
│   ├── ui/                  # shadcn/ui 컴포넌트
│   └── features/            # 기능별 컴포넌트
├── lib/                     # 유틸리티 함수
│   ├── firebase.ts          # Firebase 클라이언트
│   ├── firebase-admin.ts    # Firebase Admin SDK
│   ├── crypto.ts            # 암호화 함수
│   └── neis-validator.ts    # 나이스 검증
├── hooks/                   # Custom React Hooks
├── types/                   # TypeScript 타입 정의
├── public/                  # 정적 파일
├── .env.local.example       # 환경 변수 예시
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### 10.2 Vercel 배포 설정

#### **vercel.json**

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["icn1"],
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase-api-key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "@firebase-project-id",
    "FIREBASE_ADMIN_PRIVATE_KEY": "@firebase-admin-private-key",
    "GEMINI_API_KEY": "@gemini-api-key"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### **배포 프로세스**

```bash
# 1. GitHub에 푸시
git add .
git commit -m "feat: 학생 관리 기능 추가"
git push origin main

# 2. Vercel 자동 배포 (GitHub Integration)
# - main 브랜치 푸시 → Production 배포
# - feature/* 브랜치 → Preview 배포

# 3. 배포 확인
# Vercel Dashboard에서 배포 로그 확인
# https://nugabar.vercel.app 접속 테스트
```

### 10.3 Firebase 설정

#### **Firebase 프로젝트 생성**

```bash
# 1. Firebase CLI 설치
npm install -g firebase-tools

# 2. Firebase 로그인
firebase login

# 3. Firebase 프로젝트 초기화
firebase init

# 선택 항목:
# ✓ Firestore
# ✓ Authentication
# ✓ Storage
# ✓ Hosting (선택사항)

# 4. Firestore 인덱스 배포
firebase deploy --only firestore:indexes

# 5. Security Rules 배포
firebase deploy --only firestore:rules
```

#### **firebase.json**

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### 10.4 환경별 설정

#### **Development (로컬)**
```bash
# .env.local
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nugabar-dev
```

#### **Staging (Preview)**
```bash
# Vercel 환경 변수 (Staging)
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nugabar-staging
```

#### **Production**
```bash
# Vercel 환경 변수 (Production)
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nugabar-prod
```

---

## 11. 개발 로드맵

### 11.1 Phase 1: 핵심 기능 구현 (4주)

#### **Week 1: 프로젝트 셋업 및 인증**
- [ ] Next.js 14 프로젝트 초기화
- [ ] shadcn/ui 설치 및 테마 설정
- [ ] Firebase 프로젝트 생성 및 연동
- [ ] Google 로그인 구현
- [ ] 기본 레이아웃 및 라우팅

#### **Week 2: 학생 관리 기능**
- [ ] 학생 추가/수정/삭제 UI
- [ ] 클라이언트 측 암호화 구현
- [ ] Firestore CRUD API 구현
- [ ] 학생 목록 페이지 (검색, 필터)
- [ ] CSV 일괄 업로드 기능

#### **Week 3: 행동특성 생성 + Apps Script 코드 이관**
- [ ] **키워드 데이터베이스 Firestore 이식**
  - [ ] `OBSERVATION_CATEGORIES` 상수 → Firestore 컬렉션 완전 이관
  - [ ] 63개 키워드 × 9개 카테고리 100% 보존
  - [ ] 키워드 메타데이터 (설명, 예시, 빈도) 모두 이관

- [ ] **키워드 선택 UI (9개 카테고리 탭)**
  - [ ] Apps Script HTML UI 참고하여 동일한 UX 구현

- [ ] **Gemini API 연동 및 프롬프트 이관**
  - [ ] `createBehaviorCharacteristicsPrompt()` → `lib/prompts.ts` 완전 이관
  - [ ] 프롬프트 텍스트 100% 동일하게 보존
  - [ ] System Instruction 텍스트 완전 보존

- [ ] **나이스 규정 검증 시스템 이관**
  - [ ] `checkNeisCompliance()` → `lib/neis-validator.ts` 완전 이관
  - [ ] `ensureNeisCompliance()` → 3단계 검증 프로세스 보존
  - [ ] `validateDetailedNeisCompliance()` → 상세 검증 로직 보존
  - [ ] `validateAndCorrectNounEndings()` → 명사형 어미 교정 보존
  - [ ] `checkNounEndingCompliance()` → 명사형 어미 검증 보존
  - [ ] 정규식 패턴 100% 동일하게 이관

- [ ] **폴백 템플릿 시스템 이관**
  - [ ] `generateBehaviorCharacteristicsFallback()` → `lib/fallback.ts` 완전 이관
  - [ ] 템플릿 문구 100% 동일하게 보존

#### **Week 4: 누가기록 생성 + Apps Script 코드 이관**
- [ ] **누가기록 생성 API 및 프롬프트 이관**
  - [ ] `createCumulativeRecordsPrompt()` → `lib/prompts.ts` 완전 이관
  - [ ] `generateCumulativeRecords()` → API Route 구현 시 로직 100% 보존
  - [ ] `generateCumulativeRecordsFallback()` → 템플릿 문구 100% 보존
  - [ ] `generateCumulativeRecordsForStudents()` → 배치 생성 로직 보존

- [ ] **날짜 자동 설정 로직 이관**
  - [ ] `getKoreanHolidays(year)` → `lib/holidays.ts` 완전 이관
  - [ ] 2024-2030년 공휴일 데이터 100% 보존
  - [ ] `generateRandomSchoolDate()` → `lib/date-generator.ts` 완전 이관
  - [ ] 평일 선택 + 공휴일 제외 알고리즘 100% 보존

- [ ] **일괄 생성 기능**
  - [ ] 전체 학생 대상 배치 생성 기능 구현

- [ ] **대시보드 통계 구현**
  - [ ] 키워드 사용 빈도 통계 (`updateKeywordFrequency()` 로직 보존)
  - [ ] 인기 키워드 TOP 10 (`getPopularKeywords()` 로직 보존)

- [ ] **기본 기능 통합 테스트**
  - [ ] Apps Script 기능과 동일한 결과 생성 검증

### 11.2 Phase 2: 고급 기능 및 최적화 (3주)

#### **Week 5: 사용자 경험 개선**
- [ ] 사용자별 API 키 입력 시스템
- [ ] 키워드 검색 및 필터 기능
- [ ] 생성 결과 편집 기능
- [ ] 히스토리 관리 페이지
- [ ] 통계 대시보드 강화 (차트)

#### **Week 6: 보안 및 성능**
- [ ] 암호화 키 관리 UI
- [ ] Firebase Security Rules 강화
- [ ] API 응답 캐싱 (React Query)
- [ ] 이미지 최적화 (Next.js Image)
- [ ] 페이지 로딩 성능 개선

#### **Week 7: 테스트 및 디버깅**
- [ ] 단위 테스트 작성 (Vitest)
- [ ] E2E 테스트 (Playwright)
- [ ] 접근성 테스트 (Lighthouse)
- [ ] 크로스 브라우저 테스트
- [ ] 버그 수정 및 리팩토링

### 11.3 Phase 3: 배포 및 런칭 (2주)

#### **Week 8: 베타 테스트**
- [ ] Vercel Preview 배포
- [ ] 베타 테스터 모집 (교사 5~10명)
- [ ] 피드백 수집 및 개선
- [ ] 사용 가이드 작성
- [ ] FAQ 페이지 작성

#### **Week 9: 정식 출시**
- [ ] Production 배포
- [ ] 도메인 연결 (nugabar.app)
- [ ] 모니터링 설정 (Vercel Analytics)
- [ ] 에러 추적 (Sentry)
- [ ] 런칭 공지 및 홍보

### 11.4 Phase 4: 지속적 개선 (Ongoing)

#### **향후 개선 사항**
- [ ] 다크 모드 지원
- [ ] 키워드 커스터마이징 기능
- [ ] 엑셀 내보내기 (xlsx)
- [ ] 다국어 지원 (영어)
- [ ] 모바일 앱 (React Native - 선택사항)
- [ ] AI 모델 업그레이드 (Gemini 2.0)

---

## 12. 테스트 전략

### 12.1 단위 테스트 (Vitest)

```typescript
// lib/__tests__/crypto.test.ts
import { describe, it, expect } from 'vitest';
import { encryptStudentData, decryptStudentData, deriveKey } from '@/lib/crypto';

describe('암호화 함수', () => {
  it('학생 데이터를 암호화하고 복호화할 수 있다', async () => {
    const password = 'test-password';
    const salt = 'test-salt';
    const key = await deriveKey(password, salt);

    const studentData = {
      name: '홍길동',
      class: '1-3',
      birthDate: '2010-05-15',
      gender: 'M' as const,
    };

    // 암호화
    const encrypted = await encryptStudentData(studentData, key);
    expect(encrypted.encryptedData).toBeTruthy();
    expect(encrypted.iv).toBeTruthy();

    // 복호화
    const decrypted = await decryptStudentData(
      encrypted.encryptedData,
      encrypted.iv,
      key
    );

    expect(decrypted).toEqual(studentData);
  });
});
```

### 12.2 통합 테스트 (API Routes)

```typescript
// app/api/students/__tests__/route.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('POST /api/students', () => {
  beforeEach(() => {
    // Firebase Admin SDK 모킹
  });

  it('유효한 학생 데이터로 학생을 생성할 수 있다', async () => {
    const request = new NextRequest('http://localhost:3000/api/students', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer mock-token',
      },
      body: JSON.stringify({
        studentNumber: '20240101',
        encryptedData: {
          name: 'encrypted-name',
          class: '1-3',
          birthDate: '2010-05-15',
          gender: 'M',
        },
        iv: 'mock-iv',
        salt: 'mock-salt',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.studentId).toBeTruthy();
  });

  it('인증 토큰 없이 요청하면 401을 반환한다', async () => {
    const request = new NextRequest('http://localhost:3000/api/students', {
      method: 'POST',
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
```

### 12.3 E2E 테스트 (Playwright)

```typescript
// e2e/student-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('학생 관리', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/auth/signin');
    await page.click('text=Google 계정으로 로그인');
    // ... Google OAuth 모킹
  });

  test('학생을 추가할 수 있다', async ({ page }) => {
    await page.goto('/students');
    await page.click('text=학생 추가');

    // 학생 정보 입력
    await page.fill('input[name="studentNumber"]', '20240101');
    await page.fill('input[name="name"]', '홍길동');
    await page.selectOption('select[name="class"]', '1-3');
    await page.fill('input[name="birthDate"]', '2010-05-15');
    await page.check('input[value="M"]');

    // 저장
    await page.click('button:has-text("저장")');

    // 학생 목록에 표시되는지 확인
    await expect(page.locator('text=홍길동')).toBeVisible();
  });

  test('행동특성을 생성할 수 있다', async ({ page }) => {
    await page.goto('/generate/behavior');

    // 학생 선택
    await page.selectOption('select[name="studentId"]', '홍길동');

    // 키워드 선택
    await page.click('text=학습태도');
    await page.click('button:has-text("적극적 참여")');
    await page.click('button:has-text("집중력 우수")');

    // 생성 버튼 클릭
    await page.click('button:has-text("행동특성 생성하기")');

    // 결과 확인
    await expect(page.locator('textarea[readonly]')).toContainText('적극적으로');
  });
});
```

### 12.4 접근성 테스트

```bash
# Lighthouse CI 설정
npm install -g @lhci/cli

# lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000/', 'http://localhost:3000/dashboard'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
  },
};
```

---

## 13. 부록

### 13.1 기존 코드 이식 가이드

#### **키워드 데이터베이스 이식**

```typescript
// 기존 (Code.gs)
const OBSERVATION_CATEGORIES = [
  {
    id: 'learning_attitude',
    name: '학습태도',
    keywords: [...]
  }
];

// 신규 (Firestore에 초기 데이터 삽입)
// scripts/seed-keywords.ts
import { db } from './firebase-admin';
import { OBSERVATION_CATEGORIES } from './legacy-data';

async function seedKeywords() {
  const batch = db.batch();

  OBSERVATION_CATEGORIES.forEach((category) => {
    const ref = db.collection('sharedKeywords').doc(category.id);
    batch.set(ref, category);
  });

  await batch.commit();
  console.log('키워드 데이터베이스 이식 완료');
}

seedKeywords();
```

#### **나이스 검증 로직 이식**

```typescript
// 기존 (Code.gs - Line 2718)
function checkNeisCompliance(text) {
  const prohibitedPatterns = [
    /~하지\s*않는다/g,
    /부족하다/g,
    /~하지\s*못한다/g
  ];
  // ...
}

// 신규 (lib/neis-validator.ts)
export function checkNeisCompliance(text: string): ComplianceResult {
  const prohibitedPatterns = [
    /~하지\s*않는다/g,
    /부족하다/g,
    /~하지\s*못한다/g,
  ];

  const issues: string[] = [];

  prohibitedPatterns.forEach((pattern, index) => {
    if (pattern.test(text)) {
      issues.push(`금지 표현 감지: ${pattern.source}`);
    }
  });

  return {
    isCompliant: issues.length === 0,
    issues,
  };
}
```

### 13.2 마이그레이션 체크리스트

#### **개발 시작 전**
- [ ] Firebase 프로젝트 생성
- [ ] Vercel 계정 생성 및 GitHub 연결
- [ ] Gemini API 키 발급
- [ ] 도메인 구매 (선택사항)

#### **코드 이식**
- [ ] 키워드 데이터베이스 63개 이식
- [ ] 나이스 검증 로직 이식
- [ ] AI 프롬프트 시스템 이식
- [ ] 폴백 템플릿 시스템 이식

#### **테스트**
- [ ] 암호화/복호화 기능 테스트
- [ ] Google 로그인 테스트
- [ ] 학생 CRUD 테스트
- [ ] 행동특성 생성 테스트
- [ ] 누가기록 생성 테스트

#### **배포**
- [ ] Production 환경 변수 설정
- [ ] Firebase Security Rules 배포
- [ ] Vercel Production 배포
- [ ] 도메인 연결
- [ ] SSL 인증서 확인

### 13.3 참고 자료

#### **공식 문서**
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)

#### **추천 리소스**
- [Next.js App Router 완벽 가이드](https://nextjs.org/docs/app)
- [Firestore 데이터 모델링 Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Web.dev Accessibility Guide](https://web.dev/accessibility)
- [React Query 사용법](https://tanstack.com/query/latest)

---

## 📝 **문서 버전 관리**

| 버전 | 날짜 | 작성자 | 변경 내역 |
|------|------|--------|-----------|
| 1.0 | 2025-01-27 | Moon | 초안 작성 |
| 1.1 | TBD | - | Phase 1 완료 후 업데이트 예정 |

---

## ✅ **승인 및 검토**

- [ ] 기획자 검토 완료
- [ ] 개발자 검토 완료
- [ ] 보안 담당자 검토 완료
- [ ] 최종 승인

---

**📧 문의**: [문의 이메일 또는 이슈 트래커]
**🔗 프로젝트 저장소**: [GitHub Repository URL]
**🌐 배포 URL**: [https://nugabar.app](https://nugabar.app) (예정)
