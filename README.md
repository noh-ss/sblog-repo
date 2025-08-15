# Firebase Blog

React + Vite + Firebase로 구축한 블로그 시스템입니다.

## 기능

- 글 작성, 수정, 삭제 (마크다운 지원)
- 카테고리별 분류
- 조회수 통계
- 관리자 인증
- 반응형 디자인

## 기술 스택

- **Frontend**: React, Vite
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting
- **Styling**: CSS Modules

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com)에서 새 프로젝트 생성
2. 웹 앱 추가
3. Firebase 설정 값을 `.env` 파일에 추가:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Firestore Database 생성 (테스트 모드로 시작)
5. Authentication 활성화 (이메일/비밀번호 인증 활성화)

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드
```bash
npm run build
```

## Firebase 배포

### 1. Firebase CLI 설치
```bash
npm install -g firebase-tools
```

### 2. Firebase 로그인
```bash
firebase login
```

### 3. `.firebaserc` 파일 수정
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### 4. 배포
```bash
npm run build
firebase deploy
```

## 프로젝트 구조

```
blog/
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── Layout/      # 레이아웃 컴포넌트
│   │   └── PostList/    # 글 목록 컴포넌트
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── Home.jsx     # 메인 페이지
│   │   ├── PostView.jsx # 글 상세 페이지
│   │   ├── Write.jsx    # 글 작성/수정 페이지
│   │   ├── Admin.jsx    # 관리자 페이지
│   │   └── Login.jsx    # 로그인 페이지
│   ├── services/        # Firebase 설정
│   └── App.jsx          # 메인 앱 컴포넌트
├── firebase.json        # Firebase 호스팅 설정
└── package.json
```

## 사용 방법

1. **회원가입/로그인**: `/login` 페이지에서 이메일로 회원가입
2. **글 작성**: 로그인 후 상단 메뉴의 "글쓰기" 클릭
3. **글 수정/삭제**: 자신이 작성한 글에서만 가능
4. **관리자 페이지**: `/admin`에서 전체 글 관리

## 라이센스

MIT

#테스트