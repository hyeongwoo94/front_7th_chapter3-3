# FSD 경험 분석 및 대안 구조 설계

## 목차
1. [현재 구조 분석](#현재-구조-분석)
2. [FSD 적용 경험 분석](#fsd-적용-경험-분석)
3. [프로젝트 특성 분석](#프로젝트-특성-분석)
4. [대안 구조 설계](#대안-구조-설계)
5. [마이그레이션 계획](#마이그레이션-계획)

---

## 현재 구조 분석

### 현재 폴더 구조
```
src/
├── app/                    # 앱 초기화 및 설정
│   ├── providers/          # QueryProvider
│   └── store/              # Jotai atoms, queryKeys
├── pages/                  # 페이지 컴포넌트
│   ├── layout/             # Header, Footer
│   └── PostsManagerPage/   # 게시물 관리 페이지
│       ├── hooks/          # useURLSync, usePostManagerHandlers, useDialogManager
│       └── ui/             # PostsManagerPage, PostManagerHeader, PostManagerDialogs
├── widgets/                # 복합 UI 블록
│   └── PostListWithFilters/
│       ├── model/          # usePostListWithFilters
│       └── ui/             # PostListWithFilters, PostControls, PostTableSection, PostPagination
├── features/               # 사용자 기능
│   ├── post/               # 게시물 관련 기능
│   │   ├── model/          # usePostListQuery, usePostMutations 등
│   │   └── ui/             # PostCreateForm, PostEditForm, PostSearchInput 등
│   ├── comment/            # 댓글 관련 기능
│   │   ├── model/          # useCommentQueries, useCommentMutations
│   │   └── ui/             # CommentCreateForm, CommentEditForm
│   └── user-view/          # 사용자 보기 기능
│       ├── model/          # useUserView
│       └── ui/             # UserViewModal
├── entities/               # 비즈니스 엔티티
│   ├── post/               # Post 엔티티
│   │   ├── api/            # posts.ts
│   │   ├── model/          # types.ts
│   │   └── ui/             # PostTableRow, PostTitle, PostActions 등
│   ├── comment/            # Comment 엔티티
│   │   ├── api/            # comments.ts
│   │   ├── model/          # types.ts
│   │   └── ui/             # CommentItem, CommentList
│   ├── tag/                # Tag 엔티티
│   │   ├── api/            # tags.ts
│   │   ├── model/          # types.ts
│   │   └── ui/             # TagBadge
│   └── user/               # User 엔티티
│       ├── api/            # users.ts
│       ├── model/          # types.ts
│       └── ui/             # UserAvatar, UserInfo
└── shared/                 # 공통 코드
    ├── lib/                # utils.tsx, api.ts
    └── ui/                 # Button, Card, Dialog, Input 등
```

### 현재 구조의 특징
- **FSD 레이어 구조 준수**: app > pages > widgets > features > entities > shared
- **관심사 분리**: 각 레이어가 명확한 역할을 가짐
- **타입 중심 설계**: entities에서 타입 정의
- **API 분리**: entities/api에 API 호출 로직 분리
- **재사용 가능한 컴포넌트**: shared/ui에 공통 컴포넌트

---

## FSD 적용 경험 분석

### ✅ FSD의 장점

#### 1. **명확한 계층 구조**
- **장점**: 코드의 위치를 예측하기 쉬움
  - "이 컴포넌트는 어디에 있어야 할까?" → 레이어 규칙에 따라 결정 가능
  - 새로운 개발자도 빠르게 구조 이해 가능

- **실제 경험**:
  - Post 관련 코드는 `entities/post`에 있다는 것을 바로 알 수 있음
  - 공통 컴포넌트는 `shared/ui`에 있다는 것이 명확함

#### 2. **의존성 방향 명확화**
- **장점**: 상위 레이어가 하위 레이어에만 의존
  - `pages` → `widgets` → `features` → `entities` → `shared`
  - 순환 의존성 방지
  - 테스트하기 쉬운 구조

- **실제 경험**:
  - `PostsManagerPage`는 `widgets`, `features`를 사용하지만, `entities`를 직접 사용하지 않음
  - 의존성 방향이 명확하여 리팩토링이 안전함

#### 3. **재사용성 향상**
- **장점**: entities와 features를 다른 페이지에서도 재사용 가능
  - `PostCreateForm`은 다른 페이지에서도 사용 가능
  - `Post` 엔티티는 프로젝트 전체에서 일관되게 사용

- **실제 경험**:
  - `entities/post/ui`의 컴포넌트들을 여러 곳에서 재사용
  - `features/post`의 hooks를 다른 페이지에서도 활용 가능

#### 4. **관심사 분리**
- **장점**: 각 레이어가 명확한 책임을 가짐
  - `entities`: 비즈니스 도메인 모델
  - `features`: 사용자 기능
  - `widgets`: 복합 UI 블록
  - `pages`: 페이지 구성

- **실제 경험**:
  - 게시물 생성 기능은 `features/post`에만 집중
  - Post 타입은 `entities/post`에서 관리
  - 페이지 구성은 `pages`에서만 처리

#### 5. **확장성**
- **장점**: 새로운 기능 추가가 쉬움
  - 새로운 엔티티 추가: `entities/new-entity`
  - 새로운 기능 추가: `features/new-feature`
  - 기존 코드에 영향 최소화

### ❌ FSD의 단점 및 불편함

#### 1. **과도한 폴더 깊이**
- **문제**: 파일을 찾기 위해 여러 폴더를 탐색해야 함
  ```
  src/features/post/model/usePostListQuery.ts
  src/features/post/ui/PostCreateForm.tsx
  ```
  - 파일 경로가 길어짐
  - import 경로도 길어짐

- **실제 경험**:
  - `import { PostCreateForm } from "../../../features/post"`
  - 상대 경로가 복잡해짐

#### 2. **레이어 구분의 모호함**
- **문제**: 어떤 레이어에 어떤 코드를 넣어야 할지 애매한 경우가 있음
  - `usePostListWithFilters`는 `widgets`에 있는데, 비즈니스 로직이 많음
  - `features/post/model`에 많은 hooks가 있어서 관리가 어려움

- **실제 경험**:
  - `features/post/model`에 10개 이상의 hooks 파일
  - 어떤 hook이 어떤 기능에 속하는지 파악하기 어려움

#### 3. **중복된 구조**
- **문제**: 각 레이어마다 비슷한 구조 반복
  ```
  entities/post/
    ├── api/
    ├── model/
    └── ui/
  features/post/
    ├── model/
    └── ui/
  ```
  - 작은 프로젝트에서는 오버엔지니어링일 수 있음

- **실제 경험**:
  - 프로젝트가 작아서 일부 레이어가 비어있거나 파일이 1-2개만 있음

#### 4. **상태 관리의 분산**
- **문제**: 상태 관리가 여러 곳에 분산됨
  - Jotai atoms: `app/store`
  - TanStack Query: `features/*/model`
  - 로컬 상태: 각 컴포넌트
  - 상태 관리 전략을 파악하기 어려움

- **실제 경험**:
  - 전역 상태는 `app/store`에 있지만
  - 서버 상태는 `features`에 있고
  - 페이지별 상태는 `pages`에 있어서 일관성이 떨어짐

#### 5. **테스트 파일 위치의 모호함**
- **문제**: 테스트 파일을 어디에 둘지 명확하지 않음
  - FSD에서는 테스트 파일 위치에 대한 명확한 가이드가 부족
  - 각 레이어마다 테스트를 둘지, 별도 폴더에 둘지 애매함

### 🔍 개선점 도출

#### 1. **폴더 구조 단순화**
- 현재: `features/post/model/usePostListQuery.ts`
- 개선: `features/post/usePostListQuery.ts` (model 폴더 제거)
- 이유: 작은 프로젝트에서는 model/ui 분리가 불필요할 수 있음

#### 2. **기능 중심 그룹화**
- 현재: hooks가 `model` 폴더에 모두 모여있음
- 개선: 기능별로 그룹화
  ```
  features/post/
    ├── list/          # 목록 관련
    │   ├── usePostListQuery.ts
    │   └── PostList.tsx
    ├── create/        # 생성 관련
    │   ├── useCreatePostMutation.ts
    │   └── PostCreateForm.tsx
    └── edit/          # 수정 관련
  ```

#### 3. **상태 관리 통합**
- 현재: 상태가 여러 곳에 분산
- 개선: 상태 관리 전략을 명확히 구분
  ```
  app/
    ├── store/
    │   ├── client/    # 클라이언트 상태 (Jotai)
    │   └── server/    # 서버 상태 (TanStack Query hooks)
  ```

#### 4. **API 레이어 통합**
- 현재: 각 entity마다 api 폴더
- 개선: API를 한 곳에서 관리하거나, 도메인별로 그룹화

---

## 프로젝트 특성 분석

### 프로젝트 규모
- **소규모 프로젝트**: 단일 페이지 애플리케이션
- **주요 기능**: 게시물 CRUD, 댓글 CRUD
- **복잡도**: 중간 수준 (FSD의 모든 레이어가 필요하지 않을 수 있음)

### 프로젝트 요구사항
1. **게시물 관리**: 생성, 조회, 수정, 삭제, 검색, 필터링
2. **댓글 관리**: 생성, 조회, 수정, 삭제, 좋아요
3. **사용자 정보**: 사용자 프로필 보기
4. **URL 동기화**: 필터/검색 상태를 URL에 반영

### 기술 스택
- **React 19**: 최신 React 기능 사용
- **TypeScript**: 타입 안정성
- **Jotai**: 클라이언트 상태 관리
- **TanStack Query**: 서버 상태 관리
- **React Router**: 라우팅 (현재는 단일 페이지)

### 개발 팀 규모
- **1인 개발**: 개인 프로젝트 또는 소규모 팀
- **유지보수**: 장기적인 유지보수 필요
- **확장성**: 향후 기능 추가 가능성

---

## 대안 구조 설계

### 설계 원칙

1. **단순성**: 작은 프로젝트에 맞는 단순한 구조
2. **명확성**: 코드 위치를 쉽게 찾을 수 있음
3. **확장성**: 향후 기능 추가가 쉬움
4. **일관성**: 일관된 패턴과 규칙
5. **실용성**: 실무에서 바로 사용 가능

### 제안 구조 1: 기능 중심 구조 (Feature-First)

```
src/
├── app/                    # 앱 초기화
│   ├── providers/          # 전역 프로바이더
│   └── store/              # 전역 상태
│       ├── client/         # 클라이언트 상태 (Jotai)
│       └── server/         # 서버 상태 설정 (queryKeys)
├── features/               # 기능별 모듈 (핵심)
│   ├── posts/              # 게시물 기능
│   │   ├── api/            # API 호출
│   │   ├── hooks/          # 커스텀 훅
│   │   ├── components/     # UI 컴포넌트
│   │   ├── types.ts        # 타입 정의
│   │   └── index.ts        # Public API
│   ├── comments/           # 댓글 기능
│   └── users/              # 사용자 기능
├── shared/                 # 공통 코드
│   ├── components/        # 공통 UI 컴포넌트
│   ├── hooks/              # 공통 훅
│   ├── utils/              # 유틸리티
│   └── lib/                # 라이브러리 설정
├── pages/                  # 페이지
│   ├── PostsManagerPage/
│   │   ├── components/     # 페이지 전용 컴포넌트
│   │   ├── hooks/          # 페이지 전용 훅
│   │   └── index.tsx
│   └── layout/             # 레이아웃
└── App.tsx
```

**장점**:
- 기능별로 모든 것이 한 곳에 모여있음
- 파일을 찾기 쉬움
- 기능 추가/제거가 간단함

**단점**:
- 엔티티 간 공유가 어려울 수 있음
- 타입 정의가 분산될 수 있음

### 제안 구조 2: 하이브리드 구조 (Hybrid) ⭐ **추천**

```
src/
├── app/                    # 앱 초기화 및 설정
│   ├── providers/          # QueryProvider 등
│   └── store/              # 전역 상태
│       ├── atoms/          # Jotai atoms
│       └── queries/        # Query keys
├── domains/                # 도메인 모델 (entities 대체)
│   ├── post/
│   │   ├── types.ts        # 타입 정의
│   │   ├── api.ts          # API 호출
│   │   └── components/     # 도메인 특화 UI (PostTableRow 등)
│   ├── comment/
│   ├── user/
│   └── tag/
├── features/               # 사용자 기능
│   ├── post-management/    # 게시물 관리 기능
│   │   ├── list/           # 목록 기능
│   │   │   ├── hooks/
│   │   │   └── components/
│   │   ├── create/          # 생성 기능
│   │   ├── edit/            # 수정 기능
│   │   └── delete/          # 삭제 기능
│   ├── comment-management/ # 댓글 관리 기능
│   └── user-profile/        # 사용자 프로필 기능
├── modules/                # 복합 모듈 (widgets 대체)
│   └── post-list/          # 게시물 목록 모듈
│       ├── hooks/
│       └── components/
├── pages/                  # 페이지
│   ├── PostsManagerPage/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── index.tsx
│   └── layout/
├── shared/                 # 공통 코드
│   ├── components/         # 공통 UI
│   ├── hooks/              # 공통 훅
│   └── utils/              # 유틸리티
└── App.tsx
```

**장점**:
- 기능별 세분화로 관리 용이
- 도메인 모델은 별도로 관리
- 확장성과 유지보수성 균형

**단점**:
- 구조가 다소 복잡할 수 있음
- 초기 학습 곡선 존재

### 제안 구조 3: 도메인 중심 구조 (Domain-Driven)

```
src/
├── app/                    # 앱 설정
│   ├── providers/
│   └── store/
├── domains/                # 도메인별 모듈
│   ├── posts/              # 게시물 도메인
│   │   ├── api/            # API
│   │   ├── hooks/          # 도메인 훅
│   │   ├── components/     # 도메인 컴포넌트
│   │   ├── types.ts
│   │   └── index.ts
│   ├── comments/
│   └── users/
├── pages/
│   └── PostsManagerPage/
├── shared/
└── App.tsx
```

**장점**:
- 도메인별로 완전히 독립적
- 도메인 로직이 한 곳에 모임
- 마이크로프론트엔드로 전환 용이

**단점**:
- 작은 프로젝트에서는 과할 수 있음
- 기능이 여러 도메인에 걸칠 때 복잡

---

## 최종 추천 구조: 하이브리드 구조 (Hybrid)

### 선택 이유

1. **프로젝트 규모에 적합**: 중소규모 프로젝트에 최적화
2. **기능 중심 + 도메인 분리**: 기능별 관리 + 도메인 모델 분리
3. **실용성**: 실무에서 바로 적용 가능한 구조
4. **확장성**: 향후 기능 추가 시에도 구조 유지 가능

### 상세 구조

```
src/
├── app/                          # 앱 초기화 및 설정
│   ├── providers/
│   │   └── QueryProvider.tsx
│   └── store/                    # 전역 상태 관리
│       ├── atoms/                # Jotai atoms
│       │   ├── filterAtoms.ts
│       │   └── uiAtoms.ts
│       └── queries/              # TanStack Query 설정
│           └── queryKeys.ts
│
├── domains/                      # 도메인 모델 (비즈니스 엔티티)
│   ├── post/
│   │   ├── types.ts              # Post 타입 정의
│   │   ├── api.ts                # Post API 호출
│   │   └── components/           # Post 특화 UI
│   │       ├── PostTableRow.tsx
│   │       ├── PostTitle.tsx
│   │       └── PostActions.tsx
│   ├── comment/
│   │   ├── types.ts
│   │   ├── api.ts
│   │   └── components/
│   │       ├── CommentItem.tsx
│   │       └── CommentList.tsx
│   ├── user/
│   │   ├── types.ts
│   │   ├── api.ts
│   │   └── components/
│   │       ├── UserAvatar.tsx
│   │       └── UserInfo.tsx
│   └── tag/
│       ├── types.ts
│       ├── api.ts
│       └── components/
│           └── TagBadge.tsx
│
├── features/                     # 사용자 기능 (비즈니스 로직)
│   ├── post-management/          # 게시물 관리 기능
│   │   ├── list/                 # 목록 기능
│   │   │   ├── hooks/
│   │   │   │   ├── usePostListQuery.ts
│   │   │   │   ├── usePostSearchQuery.ts
│   │   │   │   └── usePostFilterQuery.ts
│   │   │   └── components/
│   │   │       ├── PostSearchInput.tsx
│   │   │       └── PostFilter.tsx
│   │   ├── create/               # 생성 기능
│   │   │   ├── hooks/
│   │   │   │   └── useCreatePostMutation.ts
│   │   │   └── components/
│   │   │       └── PostCreateForm.tsx
│   │   ├── edit/                 # 수정 기능
│   │   │   ├── hooks/
│   │   │   │   └── useUpdatePostMutation.ts
│   │   │   └── components/
│   │   │       └── PostEditForm.tsx
│   │   ├── delete/               # 삭제 기능
│   │   │   └── hooks/
│   │   │       └── useDeletePostMutation.ts
│   │   └── detail/               # 상세 보기 기능
│   │       ├── hooks/
│   │       │   └── usePostDetail.ts
│   │       └── components/
│   │           └── PostDetailDialog.tsx
│   ├── comment-management/       # 댓글 관리 기능
│   │   ├── create/
│   │   ├── edit/
│   │   ├── delete/
│   │   └── like/
│   └── user-profile/             # 사용자 프로필 기능
│       └── view/
│
├── modules/                      # 복합 모듈 (재사용 가능한 블록)
│   └── post-list/                # 게시물 목록 모듈
│       ├── hooks/
│       │   └── usePostListWithFilters.ts
│       └── components/
│           ├── PostListWithFilters.tsx
│           ├── PostControls.tsx
│           ├── PostTableSection.tsx
│           └── PostPagination.tsx
│
├── pages/                        # 페이지 컴포넌트
│   ├── PostsManagerPage/
│   │   ├── hooks/                # 페이지 전용 훅
│   │   │   ├── useURLSync.ts
│   │   │   ├── usePostManagerHandlers.ts
│   │   │   └── useDialogManager.ts
│   │   ├── components/           # 페이지 전용 컴포넌트
│   │   │   ├── PostManagerHeader.tsx
│   │   │   └── PostManagerDialogs.tsx
│   │   └── index.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── shared/                       # 공통 코드
│   ├── components/               # 공통 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card/
│   │   ├── Dialog/
│   │   ├── Input.tsx
│   │   └── ...
│   ├── hooks/                    # 공통 훅
│   └── utils/                    # 유틸리티
│       ├── api.ts
│       └── utils.tsx
│
└── App.tsx
```

### 구조 설명

#### 1. `app/` - 앱 초기화
- **역할**: 앱 전역 설정
- **포함**: Providers, 전역 상태 설정
- **변경점**: `store/`를 `atoms/`와 `queries/`로 세분화

#### 2. `domains/` - 도메인 모델 (entities 대체)
- **역할**: 비즈니스 도메인 모델
- **포함**: 타입, API, 도메인 특화 UI
- **변경점**: `entities` → `domains`로 명명 변경 (더 명확한 의미)

#### 3. `features/` - 사용자 기능
- **역할**: 사용자가 수행하는 기능
- **포함**: 기능별로 세분화 (list, create, edit, delete 등)
- **변경점**: 기능별로 폴더를 나누어 관리 용이성 향상

#### 4. `modules/` - 복합 모듈 (widgets 대체)
- **역할**: 여러 기능을 조합한 재사용 가능한 모듈
- **포함**: 복합적인 UI 블록
- **변경점**: `widgets` → `modules`로 명명 변경 (더 일반적인 용어)

#### 5. `pages/` - 페이지
- **역할**: 페이지 컴포넌트 및 페이지 전용 로직
- **포함**: 페이지 컴포넌트, 페이지 전용 훅
- **변경점**: 없음 (기존과 동일)

#### 6. `shared/` - 공통 코드
- **역할**: 프로젝트 전체에서 사용하는 공통 코드
- **포함**: 공통 컴포넌트, 훅, 유틸리티
- **변경점**: `lib/` → `utils/`로 명명 변경

### 의존성 규칙

```
pages → modules → features → domains → shared
  ↓       ↓         ↓         ↓        ↓
  └───────┴─────────┴─────────┴────────┘
              app (모든 레이어에서 사용 가능)
```

- **상위 레이어는 하위 레이어에만 의존**
- **같은 레이어 내에서는 의존 불가** (순환 의존 방지)
- **`app`은 모든 레이어에서 사용 가능**

---

## 구조 비교

### FSD vs 하이브리드 구조

| 항목                       | FSD             | 하이브리드 구조 |
|----------------------------|----------------|-------------------|
| **폴더 깊이**              | 깊음 (5-6단계)   | 중간 (4-5단계)    |
| **기능 그룹화**            | 레이어별         | 기능별 + 도메인별  |
| **파일 찾기**              | 어려움           | 쉬움              |
| **확장성**                 | 높음             | 높음             |
| **학습 곡선**              | 높음             | 중간             |
| **소규모 프로젝트 적합성**  | 낮음             | 높음             |

### 주요 개선점

1. **기능별 세분화**: `features/post-management/list/`처럼 기능별로 명확히 분리
2. **도메인 모델 통합**: `domains/`에서 타입, API, 컴포넌트를 함께 관리
3. **상태 관리 통합**: `app/store/`에서 클라이언트/서버 상태를 명확히 구분
4. **명명 개선**: `entities` → `domains`, `widgets` → `modules`

---

## 마이그레이션 계획

### Phase 1: 구조 생성 및 도메인 모델 이동
1. 새로운 폴더 구조 생성
2. `entities/` → `domains/`로 이동
3. 타입, API, 컴포넌트 통합

### Phase 2: Features 재구성
1. `features/post/` → `features/post-management/`로 재구성
2. 기능별로 폴더 분리 (list, create, edit, delete, detail)
3. hooks와 components를 기능별로 그룹화

### Phase 3: Modules 및 Pages 정리
1. `widgets/` → `modules/`로 이동
2. `pages/` 구조 유지 (이미 잘 구성됨)

### Phase 4: Shared 및 App 정리
1. `shared/lib/` → `shared/utils/`로 정리
2. `app/store/` 구조 개선

### Phase 5: Import 경로 수정
1. 모든 import 경로 수정
2. 테스트 및 검증

---

## 다음 단계

1. ✅ **FSD 경험 분석 완료**
2. ✅ **대안 구조 설계 완료**
3. ⏭️ **구조 선택 및 확정**
4. ⏭️ **마이그레이션 실행**

**추천**: 하이브리드 구조로 마이그레이션 진행

---

## 참고 자료

- [FSD 공식 문서](https://feature-sliced.design/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

