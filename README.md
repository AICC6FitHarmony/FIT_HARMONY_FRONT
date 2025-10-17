# FIT_HARMONY 프론트엔드

FIT_HARMONY는 헬스장 운영 및 회원 관리를 위한 통합 플랫폼의 프론트엔드 애플리케이션입니다. React 기반의 SPA(Single Page Application)로 구축되었으며, 트레이너와 회원 간의 소통, 인바디 분석, 일정 관리, 커뮤니티 등의 기능을 제공합니다.

## 📚 기술 스택

### 핵심 프레임워크 및 빌드 도구
- **React** `v19.1.0` - UI 라이브러리
- **React Router DOM** `v7.6.2` - 클라이언트 사이드 라우팅
- **Vite** `v6.3.5` - 빌드 도구 및 개발 서버
- **Tailwind CSS** `v4.1.10` - 유틸리티 우선 CSS 프레임워크

### 상태 관리
- **Redux Toolkit** `v2.8.2` - 전역 상태 관리
- **React Redux** `v9.2.0` - React와 Redux 바인딩
- **Context API** - 인증 및 모달 상태 관리

### UI/UX 라이브러리
- **Framer Motion** `v12.23.0` - 애니메이션
- **Lucide React** `v0.522.0` - 아이콘
- **React Icons** `v5.5.0` - 추가 아이콘 세트
- **React Toastify** `v11.0.5` - 토스트 알림
- **SweetAlert2** `v11.22.2` - 모달 알림
- **Swiper** `v11.2.10` - 터치 슬라이더
- **React Loading Skeleton** `v3.5.0` - 스켈레톤 로딩

### 데이터 시각화 및 편집기
- **Recharts** `v3.0.0` - 차트 라이브러리
- **FullCalendar** `v6.1.17` - 캘린더 컴포넌트
- **TipTap** `v2.23.0` - 리치 텍스트 에디터

### HTTP 통신 및 유틸리티
- **Axios** `v1.10.0` - HTTP 클라이언트
- **date-fns** `v4.1.0` - 날짜 유틸리티

### 외부 API 통합
- **react-kakao-maps-sdk** `v1.2.0` - 카카오 지도 API
- **react-daum-postcode** `v3.2.0` - 다음 우편번호 API

### 개발 도구
- **ESLint** `v9.25.0` - 코드 품질 검사
- **@vitejs/plugin-react** `v4.4.1` - React용 Vite 플러그인

## 📁 소스 구조

```
front/
├── dist/                          # 빌드 결과물
│   ├── assets/                   # 빌드된 정적 파일
│   └── index.html               # 빌드된 HTML
│
├── src/                          # 소스 코드
│   ├── main.jsx                 # 애플리케이션 진입점
│   ├── App.jsx                  # 루트 컴포넌트 (라우팅 정의)
│   │
│   ├── components/              # React 컴포넌트
│   │   ├── common/             # 공통 컴포넌트
│   │   │   ├── Header.jsx      # 헤더 (네비게이션)
│   │   │   ├── Footer.jsx      # 푸터
│   │   │   ├── NavBar.jsx      # 사이드 네비게이션
│   │   │   ├── Img.jsx         # 이미지 컴포넌트
│   │   │   └── Reload.jsx      # 리로드 페이지
│   │   │
│   │   ├── cmmn/               # 공통 유틸리티 컴포넌트
│   │   │   ├── Home.jsx        # 홈 컴포넌트
│   │   │   ├── StandardModal.jsx        # 표준 모달
│   │   │   ├── ModalContext.jsx         # 모달 Context
│   │   │   ├── InputWithLabel.jsx       # 레이블 포함 입력
│   │   │   ├── ListSelector.jsx         # 리스트 선택기
│   │   │   └── ListMultiSelector.jsx    # 다중 선택기
│   │   │
│   │   ├── intro/              # 메인/소개 페이지
│   │   │   ├── Intro.jsx       # 메인 페이지
│   │   │   ├── IntroTrainer.jsx
│   │   │   ├── IntroDiet.jsx
│   │   │   └── IntroCommunity.jsx
│   │   │
│   │   ├── login/              # 로그인 및 회원가입
│   │   │   ├── Login.jsx       # 로그인 라우터
│   │   │   ├── LoginPage.jsx   # 로그인 페이지
│   │   │   ├── SignUpSelect.jsx         # 회원가입 선택
│   │   │   ├── SignPerson.jsx           # 회원 가입
│   │   │   ├── SignTrainer.jsx          # 트레이너 가입
│   │   │   └── common/         # 회원가입 공통 컴포넌트
│   │   │       ├── SignNav.jsx
│   │   │       ├── SignButton.jsx
│   │   │       ├── SignInputTab.jsx
│   │   │       ├── SignProfilePage.jsx
│   │   │       ├── SignBodyPage.jsx
│   │   │       ├── SignGym.jsx
│   │   │       ├── GymSelector.jsx
│   │   │       ├── AddressSelector.jsx
│   │   │       └── SignSelectText.jsx
│   │   │
│   │   ├── dashboard/          # 대시보드
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── inbody/             # 인바디 분석
│   │   │   ├── Inbody.jsx
│   │   │   ├── InbodyRegisterForm.jsx
│   │   │   ├── InbodyDetailForm.jsx
│   │   │   ├── InbodyRadarCharts.jsx
│   │   │   └── InbodyCalendarModal.jsx
│   │   │
│   │   ├── schedule/           # 일정 관리
│   │   │   ├── Schedule.jsx
│   │   │   └── common/
│   │   │       ├── DayScheduleTable.jsx
│   │   │       ├── DietScheduleTable.jsx
│   │   │       ├── DietCalCharts.jsx
│   │   │       └── RadioLabels.jsx
│   │   │
│   │   ├── mypage/             # 마이페이지
│   │   │   ├── MyPage.jsx
│   │   │   ├── ProfileEdit.jsx
│   │   │   ├── MyActivity.jsx
│   │   │   ├── ManageMember.jsx
│   │   │   ├── RequestResponse.jsx
│   │   │   ├── Withdraw.jsx
│   │   │   └── common/
│   │   │       ├── MenuBar.jsx
│   │   │       ├── FormInput.jsx
│   │   │       ├── IntroductionEditor.jsx
│   │   │       └── GymSelector.jsx
│   │   │
│   │   ├── Trainer/            # 트레이너 찾기
│   │   │   ├── Trainer.jsx
│   │   │   ├── TrainerMain.jsx
│   │   │   ├── TrainerReadMore.jsx
│   │   │   ├── TrainerReview.jsx
│   │   │   └── TrainerMapModal.jsx
│   │   │
│   │   ├── Community/          # 커뮤니티
│   │   │   ├── Community.jsx
│   │   │   ├── CommunityNav.jsx
│   │   │   ├── CommunityBoard.jsx
│   │   │   ├── CommunityAdmin.jsx
│   │   │   ├── PostView.jsx
│   │   │   ├── CommunityPostEdit.jsx
│   │   │   ├── CommunityPostUpdate.jsx
│   │   │   └── components/
│   │   │       ├── MenuBar.jsx
│   │   │       ├── PostEditor.jsx
│   │   │       ├── Comment.jsx
│   │   │       ├── CommentInput.jsx
│   │   │       └── CommentsView.jsx
│   │   │
│   │   └── products/           # 상품 페이지
│   │       └── Products.jsx
│   │
│   ├── js/                      # JavaScript 유틸리티 및 설정
│   │   ├── config/             # 설정 파일
│   │   │   └── requests.js     # API 요청 커스텀 훅
│   │   │
│   │   ├── redux/              # Redux 상태 관리
│   │   │   ├── store.js        # Redux 스토어 설정
│   │   │   └── slice/          # Redux 슬라이스
│   │   │       ├── commonSlice.js
│   │   │       ├── sliceInbody.js
│   │   │       ├── sliceTrainer.js
│   │   │       ├── sliceSchedule.js
│   │   │       ├── sliceMypage.js
│   │   │       ├── sliceCommunity.js
│   │   │       └── sliceDashboard.js
│   │   │
│   │   ├── login/              # 로그인 관련 로직
│   │   │   ├── AuthContext.jsx # 인증 Context
│   │   │   ├── loginUtils.js
│   │   │   ├── loginSlices.js
│   │   │   └── gymUtil.js
│   │   │
│   │   ├── common/             # 공통 유틸리티
│   │   │   ├── util.js
│   │   │   └── navbar.js
│   │   │
│   │   ├── community/          # 커뮤니티 유틸리티
│   │   │   ├── communityUtils.js
│   │   │   └── CustomImage.jsx
│   │   │
│   │   ├── inbody/
│   │   ├── schedule/
│   │   │   └── schedule.js
│   │   ├── mypage/
│   │   │   └── mypage.js
│   │   ├── intro/
│   │   │   └── intro.js
│   │   └── dashboard/
│   │
│   ├── css/                     # 스타일 파일
│   │   ├── intro.css
│   │   ├── Mypage.css
│   │   ├── products.css
│   │   └── schedule.css
│   │
│   ├── images/                  # 이미지 리소스
│   │   ├── profile.png
│   │   ├── exam_good.png
│   │   ├── intro_gym.jpg
│   │   └── spinner.svg
│   │
│   ├── index.css               # 글로벌 스타일
│   └── media.css               # 반응형 미디어 쿼리
│
├── index.html                   # HTML 템플릿
├── vite.config.js              # Vite 설정
├── eslint.config.js            # ESLint 설정
├── package.json                # 의존성 관리
└── .env                        # 환경 변수 (git 제외)
```

### 주요 디렉토리 설명

#### `src/components/`
- 페이지별로 구분된 React 컴포넌트
- `common/`, `cmmn/` - 재사용 가능한 공통 컴포넌트
- 각 도메인별 하위 `common/` 폴더 - 해당 도메인 전용 공통 컴포넌트

#### `src/js/`
- 비즈니스 로직, 유틸리티 함수, 상태 관리
- `redux/` - Redux Toolkit 기반 전역 상태 관리
- `config/requests.js` - API 요청을 위한 커스텀 훅

#### `src/css/`, `src/images/`
- 도메인별 CSS 및 이미지 리소스

## 🔄 기본적인 소스 플로우

### 1. 애플리케이션 초기화
```
main.jsx
  ├── Redux Store Provider 적용
  ├── ModalProvider 적용 (전역 모달)
  ├── App 컴포넌트 렌더링
  └── React 루트 생성
```

### 2. 앱 구조 및 라우팅
```
App.jsx
  ├── BrowserRouter 설정
  ├── AuthProvider 적용 (인증 상태 관리)
  ├── Header (전역 헤더)
  ├── Routes (페이지 라우팅)
  │   ├── / → Intro (메인 페이지)
  │   ├── /login/* → Login (로그인/회원가입)
  │   ├── /dashboard → Dashboard
  │   ├── /inbody → Inbody
  │   ├── /schedule → Schedule
  │   ├── /mypage → MyPage
  │   ├── /trainer/* → Trainer
  │   ├── /community/* → Community
  │   └── /products → Products
  ├── 전역 로딩 스피너
  └── Footer (전역 푸터)
```

### 3. 인증 플로우
```
사용자 접근
    ↓
AuthContext (AuthProvider)
    ↓
/login/check-auth API 호출
    ↓
세션 쿠키로 인증 상태 확인
    ↓
user 상태 업데이트
    ↓
[인증 필요 페이지 접근 시]
    ↓
useAuthRedirect() 훅 사용
    ↓
미인증 상태 → 로그인 모달 → /login 리다이렉트
인증 완료 → 페이지 접근 허용
```

### 4. API 요청 플로우
```
컴포넌트에서 useRequest() 훅 호출
    ↓
request(url, options) 함수 실행
    ↓
[요청 시작]
  - requestCount 증가
  - showLoading() 디스패치 (로딩 스피너 표시)
    ↓
fetch API로 백엔드 요청
  - credentials: 'include' (세션 쿠키 포함)
  - VITE_BACKEND_DOMAIN + url
    ↓
응답 처리
  - 성공 (200~299): JSON 파싱 후 반환
  - 에러 (400, 401, 403, 404, 500 등)
    → responseErrorToast() 토스트 알림
    → 401: 2초 후 /login 리다이렉트
    ↓
[요청 종료]
  - requestCount 감소
  - requestCount === 0 → hideLoading() (로딩 스피너 숨김)
```

### 5. Redux 상태 관리 플로우
```
컴포넌트
    ↓
useSelector() - 상태 조회
useDispatch() - 액션 디스패치
    ↓
Redux Store (store.js)
    ├── commonSlice (로딩, 공통 상태)
    ├── inbodySlice (인바디 데이터)
    ├── trainerSlice (트레이너 정보)
    ├── scheduleSlice (일정 데이터)
    └── mypageSlice (마이페이지 상태)
    ↓
Reducer 실행 → 상태 업데이트
    ↓
컴포넌트 자동 리렌더링
```

### 6. 페이지별 일반적인 플로우

#### 예시: 인바디 페이지 (Inbody.jsx)
```
1. 컴포넌트 마운트
   ↓
2. useAuthRedirect() - 인증 확인
   ↓
3. useEffect() - 초기 데이터 로드
   ↓
4. useRequest() - API 호출
   ↓
5. Redux 상태 업데이트 (dispatch)
   ↓
6. useSelector() - 상태 조회
   ↓
7. UI 렌더링 (차트, 폼, 모달 등)
   ↓
8. 사용자 인터랙션
   ↓
9. 이벤트 핸들러 실행
   ↓
10. API 요청 → Redux 업데이트 → 리렌더링
```

### 7. 이미지 에러 처리 플로우
```
App.jsx useEffect()
    ↓
전역 error 이벤트 리스너 등록 (캡처 단계)
    ↓
이미지 로드 실패 시
    ↓
fallback SVG 이미지로 대체
("📷 이미지 없음" 텍스트)
```

## 🚀 동작 방법

### 1. 환경 설정

#### 필수 요구사항
- **Node.js** v18 이상
- **npm** v8 이상

#### 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 정보를 입력합니다:

```bash
# 백엔드 API 도메인
VITE_BACKEND_DOMAIN=http://localhost:8000

# 카카오 지도 API Key (선택)
VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key
```

### 2. 설치 및 실행

#### 의존성 설치
```bash
npm install
```

#### 개발 서버 실행
```bash
npm run dev
```

개발 서버가 시작되면 다음과 같이 표시됩니다:
```
VITE v6.3.5  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

#### 프로덕션 빌드
```bash
npm run build
```

빌드 결과물은 `dist/` 디렉토리에 생성됩니다.

#### 프로덕션 프리뷰
```bash
npm run preview
```

### 3. 코드 품질 검사

#### ESLint 실행
```bash
npm run lint
```

### 4. 주요 페이지 접근 경로

| 경로 | 설명 | 인증 필요 |
|------|------|-----------|
| `/` | 메인 페이지 (소개) | ❌ |
| `/login` | 로그인 페이지 | ❌ |
| `/login/signup` | 회원가입 선택 | ❌ |
| `/dashboard` | 대시보드 | ✅ |
| `/inbody` | 인바디 분석 | ✅ |
| `/schedule` | 일정 관리 | ✅ |
| `/mypage` | 마이페이지 | ✅ |
| `/trainer` | 트레이너 찾기 | ❌ |
| `/community` | 커뮤니티 | ❌ |
| `/products` | 상품 페이지 | ✅ |

## 🔧 주요 기능 설명

### 1. 인증 관리 (AuthContext)
- 세션 기반 인증 상태 관리
- 페이지 접근 시 자동 인증 체크
- `useAuth()`: 로그인 정보만 가져오기
- `useAuthRedirect()`: 미인증 시 로그인 페이지로 리다이렉트

### 2. API 요청 (useRequest, useFormRequest)
- 커스텀 훅을 통한 일관된 API 통신
- 자동 로딩 상태 관리
- 에러 핸들링 및 토스트 알림
- 세션 쿠키 자동 포함

### 3. 전역 상태 관리 (Redux Toolkit)
- 도메인별 슬라이스 분리
- 불변성 자동 관리
- Redux DevTools 지원

### 4. 모달 관리 (ModalContext)
- Context API 기반 전역 모달
- StandardModal 컴포넌트를 통한 일관된 UI

### 5. 로딩 UI
- API 요청 중 전역 로딩 스피너 표시
- 다중 비동기 요청 처리 (requestCount)
- "FIT-HARMONY" 애니메이션 텍스트

## 🎨 스타일링 가이드

### Tailwind CSS 사용
- 유틸리티 클래스 기반 스타일링
- `tailwind.config.js`를 통한 커스텀 설정
- 반응형 디자인 (`sm:`, `md:`, `lg:` 등)

### 커스텀 CSS
- 도메인별 CSS 파일 (`src/css/`)
- 글로벌 스타일 (`src/index.css`)
- 반응형 미디어 쿼리 (`src/media.css`)

### 애니메이션
- Framer Motion을 활용한 부드러운 전환 효과
- CSS 애니메이션 (로딩 스피너 등)

## 📝 개발 가이드

### 새로운 페이지 추가하기

1. **컴포넌트 생성** (`src/components/`)
```jsx
// src/components/example/Example.jsx
import { useAuthRedirect } from '../../js/login/AuthContext';
import { useRequest } from '../../js/config/requests';

export default function Example() {
  const { user } = useAuthRedirect(); // 인증 필요 시
  const request = useRequest();

  // 로직 구현
  return <div>Example Page</div>;
}
```

2. **라우트 등록** (`src/App.jsx`)
```jsx
import Example from './components/example/Example';

<Routes>
  <Route path="/example" element={<Example />} />
</Routes>
```

3. **Redux 슬라이스 추가** (필요시)
```javascript
// src/js/redux/slice/sliceExample.js
import { createSlice } from '@reduxjs/toolkit';

const exampleSlice = createSlice({
  name: 'example',
  initialState: { data: null },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const { setData } = exampleSlice.actions;
export default exampleSlice.reducer;
```

4. **스토어에 등록**
```javascript
// src/js/redux/store.js
import exampleReducer from './slice/sliceExample';

const store = configureStore({
  reducer: {
    example: exampleReducer,
    // ... 기타 리듀서
  }
});
```

### API 요청 예시

```jsx
import { useRequest } from '../js/config/requests';

function MyComponent() {
  const request = useRequest();

  const fetchData = async () => {
    const data = await request('/api/endpoint', {
      method: 'GET', // 기본값: POST
      body: { key: 'value' }, // JSON 자동 변환
      pathParam: ['id', '123'], // /api/endpoint/id/123
      callback: (data) => {
        console.log('성공:', data);
      }
    });
  };

  return <button onClick={fetchData}>데이터 가져오기</button>;
}
```

## 🛡️ 보안 고려사항

- ✅ 세션 쿠키 기반 인증 (HttpOnly)
- ✅ CORS 설정으로 허용된 백엔드만 통신
- ✅ 인증 필요 페이지 접근 제어
- ✅ XSS 방지를 위한 React의 자동 이스케이핑
- ✅ 환경 변수로 민감 정보 관리 (.env)

## 🌐 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 📄 라이선스

ISC

## 👥 기여자

FIT_HARMONY 개발팀

---

**FIT_HARMONY** - 헬스장과 트레이너, 회원을 하나로 연결하는 플랫폼
