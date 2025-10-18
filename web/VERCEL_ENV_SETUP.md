# Vercel 환경변수 설정 가이드

## 📋 개요
Vercel 프로젝트 배포 시 반드시 입력해야 할 환경변수 목록입니다.

---

## 🔑 필수 환경변수 (8개)

Vercel 프로젝트 설정 → Environment Variables 메뉴에서 아래 변수들을 **모두** 입력해야 합니다.

### Firebase 설정 변수 (7개)

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

**값 확인 방법**:
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. 프로젝트 설정(⚙️) → 일반 탭
4. "내 앱" 섹션에서 웹 앱 선택
5. Firebase SDK 구성 정보 복사

### 운영 모드 변수 (1개)

```
NEXT_PUBLIC_DEV_MODE=false
```

**⚠️ 중요**: Vercel 배포 시 반드시 `false`로 설정해야 합니다!
- `true`: 개발 모드 (Google 로그인 없이 더미 사용자 사용)
- `false`: 프로덕션 모드 (실제 Google 인증 필수)

---

## 🚀 Vercel 환경변수 입력 방법

### 1. Vercel 프로젝트 페이지 접속
```
https://vercel.com/your-team/nugabar
```

### 2. Settings → Environment Variables 메뉴로 이동

### 3. 환경변수 추가
각 변수를 다음과 같이 추가합니다:

**Name** (이름):
```
NEXT_PUBLIC_FIREBASE_API_KEY
```

**Value** (값):
```
AIzaSy... (실제 Firebase API 키)
```

**Environment** (적용 환경):
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. 모든 8개 변수 입력 완료 후 "Save" 클릭

---

## 🔐 Firebase Console 추가 설정

### Google 로그인 승인된 도메인 추가

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. Authentication → Settings → Authorized domains
4. "Add domain" 클릭하여 다음 도메인 추가:
   - `localhost` (로컬 개발용)
   - `nugabar.vercel.app` (Vercel 배포 도메인)
   - 커스텀 도메인이 있다면 추가

### Google OAuth 클라이언트 ID 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. API 및 서비스 → 사용자 인증 정보
3. OAuth 2.0 클라이언트 ID 선택
4. "승인된 자바스크립트 원본" 에 다음 추가:
   - `http://localhost:3000` (로컬 개발)
   - `https://nugabar.vercel.app` (Vercel 배포)
5. "승인된 리디렉션 URI" 에 다음 추가:
   - `http://localhost:3000`
   - `https://nugabar.vercel.app`

---

## ✅ 배포 후 검증 체크리스트

- [ ] Vercel 환경변수 8개 모두 입력 완료
- [ ] `NEXT_PUBLIC_DEV_MODE=false` 확인
- [ ] Firebase 승인된 도메인에 Vercel URL 추가
- [ ] Google OAuth 클라이언트 ID에 Vercel URL 추가
- [ ] Vercel 배포 성공 확인
- [ ] 배포된 사이트에서 Google 로그인 테스트
- [ ] 로그인 후 행동특성 생성 기능 테스트
- [ ] 학급 관리 기능 테스트

---

## 🆘 문제 해결

### Google 로그인 팝업이 열리지 않아요
- Firebase Console에서 승인된 도메인에 Vercel URL 추가 확인
- Google Cloud Console에서 OAuth 클라이언트 ID 설정 확인
- 브라우저 팝업 차단 해제

### "Firebase: Error (auth/unauthorized-domain)"
- Firebase Console → Authentication → Settings → Authorized domains
- Vercel 배포 도메인 추가

### 환경변수가 적용되지 않아요
- Vercel Dashboard에서 변수 이름 철자 확인
- 변수 저장 후 Redeploy 실행
- 브라우저 캐시 삭제 후 재시도

---

## 📞 지원

문제가 계속되면 다음 정보를 확인하세요:
- [Vercel 환경변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)
- [Firebase 인증 문서](https://firebase.google.com/docs/auth/web/start)
- [Next.js 환경변수 가이드](https://nextjs.org/docs/basic-features/environment-variables)
