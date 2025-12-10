# Card 컴포넌트 분석: UI vs Layout

## 현재 Card의 특성

### Card 컴포넌트 구조
```typescript
// Card.tsx - 컨테이너 역할
<Card> // div를 감싸는 레이아웃 컨테이너
  <CardHeader> // 헤더 영역 (레이아웃)
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <CardContent> // 콘텐츠 영역 (레이아웃)
    내용
  </CardContent>
</Card>
```

### 실제 사용 예시
```typescript
// PostsManagerPage.tsx
<Card className="w-full max-w-6xl mx-auto"> // 레이아웃 컨테이너
  <CardContent> // 레이아웃 영역
    <PostListWithFilters />
  </CardContent>
</Card>

// PostManagerHeader.tsx
<CardHeader> // 레이아웃 영역
  <CardTitle>게시물 관리</CardTitle>
</CardHeader>
```

## Card는 레이아웃인가?

### ✅ 레이아웃으로 볼 수 있는 이유

1. **구조적 역할**
   - 콘텐츠를 감싸는 컨테이너
   - Header, Content 등 영역을 구분
   - 레이아웃 구조를 정의

2. **스타일링보다 구조**
   - `border`, `shadow` 등 스타일도 있지만
   - 주 목적은 **구조적 레이아웃**

3. **Button, Input과의 차이**
   - Button: 클릭 가능한 요소 (UI 컴포넌트)
   - Input: 입력 필드 (UI 컴포넌트)
   - Card: 콘텐츠를 감싸는 구조 (레이아웃 컴포넌트)

### ❌ UI로 볼 수 있는 이유

1. **시각적 스타일링**
   - `border`, `shadow`, `rounded-lg` 등 시각적 효과
   - Button처럼 스타일이 중요

2. **일반적인 관례**
   - shadcn/ui, Material-UI 등에서도 `ui` 폴더에 Card 포함
   - 많은 프로젝트에서 `ui`에 넣는 관례

## FSD에서의 위치

### 옵션 1: shared/ui (현재)
```
shared/
  ├── ui/
  │   ├── Button.tsx (UI)
  │   ├── Input.tsx (UI)
  │   ├── Card/ (레이아웃? UI?)
  │   └── ...
  └── lib/
```

**장점:**
- 일반적인 관례
- shadcn/ui 등과 일치
- UI 라이브러리 패턴과 일치

**단점:**
- 레이아웃과 UI의 구분이 모호함

### 옵션 2: shared/layout (더 명확)
```
shared/
  ├── ui/
  │   ├── Button.tsx (UI)
  │   ├── Input.tsx (UI)
  │   └── ...
  ├── layout/
  │   ├── Card/
  │   │   ├── Card.tsx
  │   │   ├── CardHeader.tsx
  │   │   ├── CardContent.tsx
  │   │   └── CardTitle.tsx
  │   └── ...
  └── lib/
```

**장점:**
- 레이아웃과 UI의 구분이 명확
- FSD 원칙에 더 부합
- 구조적 역할이 명확

**단점:**
- 일반적인 관례와 다름
- 많은 프로젝트에서 `ui`에 넣음

## 비교: Button vs Card

### Button (명확한 UI 컴포넌트)
```typescript
<Button onClick={handleClick}>클릭</Button>
```
- **역할**: 사용자 인터랙션 (클릭)
- **특성**: 액션, 이벤트 핸들러
- **위치**: `shared/ui` ✅ 명확

### Card (레이아웃 컴포넌트)
```typescript
<Card>
  <CardHeader>제목</CardHeader>
  <CardContent>내용</CardContent>
</Card>
```
- **역할**: 콘텐츠 구조화 (레이아웃)
- **특성**: 구조, 영역 구분
- **위치**: `shared/ui` vs `shared/layout` 🤔 모호

## 다른 레이아웃 컴포넌트들

### 현재 프로젝트의 레이아웃
```
pages/layout/
  ├── Header.tsx (레이아웃)
  └── Footer.tsx (레이아웃)
```

### 만약 shared/layout이 있다면
```
shared/layout/
  ├── Card/ (구조적 레이아웃)
  ├── Container/ (컨테이너 레이아웃)
  ├── Grid/ (그리드 레이아웃)
  └── Stack/ (스택 레이아웃)
```

## 결론 및 제안

### 현재 상태 (shared/ui)
- ✅ 일반적인 관례
- ✅ shadcn/ui 등과 일치
- ⚠️ 레이아웃과 UI 구분이 모호

### 개선 옵션 (shared/layout)
- ✅ FSD 원칙에 더 부합
- ✅ 구조적 역할이 명확
- ⚠️ 일반적인 관례와 다름

### 추천

**현재 프로젝트 규모에서는 `shared/ui`에 두는 것이 합리적:**
1. 프로젝트가 작음 (Card만 레이아웃 컴포넌트)
2. 일반적인 관례와 일치
3. shadcn/ui 패턴과 일치

**하지만 프로젝트가 커지면 `shared/layout`으로 분리 고려:**
- 레이아웃 컴포넌트가 많아질 때
- 구조적 역할이 더 중요해질 때
- FSD 원칙을 더 엄격히 따를 때

## 실제 프로젝트 사례

### shadcn/ui
- Card를 `ui` 폴더에 포함
- 일반적인 관례

### Material-UI
- Card를 `components` 폴더에 포함
- UI 컴포넌트로 분류

### FSD 공식 예시
- 레이아웃 컴포넌트는 `shared/layout`에 넣는 경우도 있음
- 하지만 Card는 보통 `shared/ui`에 포함

---

**핵심**: Card는 레이아웃 컴포넌트이지만, 일반적인 관례와 프로젝트 규모를 고려하면 `shared/ui`에 두는 것이 합리적입니다.

