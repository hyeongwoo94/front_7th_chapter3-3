# Shared UI 컴포넌트 설명

## Shared UI에 있는 컴포넌트들

### 1. Button (`shared/ui/Button.tsx`)
- **역할**: 기본 버튼 컴포넌트
- **특징**: 
  - 여러 variant (default, destructive, outline, secondary, ghost, link)
  - 여러 size (sm, default, lg, icon)
  - 비즈니스 로직 없음, 순수 UI만
- **사용 예시**: 
  - `features/post/ui/PostCreateForm.tsx` - 게시물 생성 버튼
  - `features/comment/ui/CommentCreateForm.tsx` - 댓글 생성 버튼
  - `entity/post/ui/PostActions.tsx` - 액션 버튼들

### 2. Input (`shared/ui/Input.tsx`)
- **역할**: 기본 입력 필드 컴포넌트
- **특징**: 
  - 모든 input 타입 지원 (text, number, email 등)
  - 스타일링만 담당
  - 비즈니스 로직 없음
- **사용 예시**:
  - `features/post/ui/PostCreateForm.tsx` - 제목, 사용자 ID 입력
  - `features/post/ui/PostEditForm.tsx` - 게시물 수정 입력

### 3. Textarea (`shared/ui/Textarea.tsx`)
- **역할**: 다중 줄 텍스트 입력 컴포넌트
- **특징**: 
  - 여러 줄 입력 지원
  - 스타일링만 담당
- **사용 예시**:
  - `features/post/ui/PostCreateForm.tsx` - 게시물 내용 입력
  - `features/comment/ui/CommentCreateForm.tsx` - 댓글 내용 입력

### 4. Select (`shared/ui/Select/`)
- **역할**: 드롭다운 선택 컴포넌트
- **구성**: Select, SelectTrigger, SelectContent, SelectItem 등
- **특징**: 
  - Radix UI 기반
  - 접근성 지원
  - 비즈니스 로직 없음
- **사용 예시**:
  - `features/post/ui/PostFilter.tsx` - 태그 필터, 정렬 기준 선택

### 5. Dialog (`shared/ui/Dialog/`)
- **역할**: 모달/다이얼로그 컴포넌트
- **구성**: Dialog, DialogContent, DialogHeader, DialogTitle 등
- **특징**: 
  - Radix UI 기반
  - 접근성 지원
  - 비즈니스 로직 없음
- **사용 예시**:
  - `features/post/ui/PostCreateForm.tsx` - 게시물 생성 다이얼로그
  - `features/post/ui/PostDetailDialog.tsx` - 게시물 상세 다이얼로그
  - `features/comment/ui/CommentCreateForm.tsx` - 댓글 생성 다이얼로그

### 6. Table (`shared/ui/Table/`)
- **역할**: 테이블 컴포넌트
- **구성**: Table, TableHeader, TableBody, TableRow, TableHead, TableCell
- **특징**: 
  - 테이블 구조만 제공
  - 비즈니스 로직 없음
- **사용 예시**:
  - `widgets/PostListWithFilters/ui/PostTableSection.tsx` - 게시물 목록 테이블

### 7. Card (`shared/ui/Card/`)
- **역할**: 카드 컨테이너 컴포넌트
- **구성**: Card, CardHeader, CardTitle, CardContent
- **특징**: 
  - 콘텐츠를 카드 형태로 감싸기
  - 비즈니스 로직 없음

---

## 왜 Shared에 넣었는가?

### 1. **범용성 (Universal)**
- **어디서든 사용 가능**: Post, Comment, User 등 어떤 도메인에서도 사용
- **비즈니스 로직 없음**: 순수하게 UI만 담당
- **재사용성**: 프로젝트 전체에서 재사용

**예시:**
```typescript
// Post 기능에서 사용
features/post/ui/PostCreateForm.tsx
  → Button, Input, Textarea, Dialog 사용

// Comment 기능에서 사용  
features/comment/ui/CommentCreateForm.tsx
  → Button, Textarea, Dialog 사용

// User 기능에서 사용
features/user-view/ui/UserViewModal.tsx
  → Dialog 사용
```

### 2. **FSD 원칙에 부합**

#### Shared 레이어의 역할
- **공통 컴포넌트**: 프로젝트 전체에서 재사용
- **비즈니스 로직 없음**: 순수 UI/유틸리티
- **도메인 독립적**: 특정 도메인에 종속되지 않음

#### 다른 레이어와의 차이

**Entities (비즈니스 엔티티)**
- ❌ Button을 entities에 넣으면 안 되는 이유:
  - Button은 Post, Comment, User 등 특정 도메인에 종속되지 않음
  - Button은 비즈니스 로직이 없는 순수 UI

**Features (사용자 기능)**
- ❌ Button을 features에 넣으면 안 되는 이유:
  - Button은 "기능"이 아니라 "도구"
  - 여러 features에서 공통으로 사용됨

**Widgets (복합 UI 블록)**
- ❌ Button을 widgets에 넣으면 안 되는 이유:
  - Button은 "복합 블록"이 아니라 "기본 컴포넌트"
  - Widgets는 여러 컴포넌트를 조합한 것

### 3. **실제 사용 패턴**

**Shared UI 사용 예시:**
```typescript
// features/post/ui/PostCreateForm.tsx
import { Button, Input, Textarea, Dialog } from "../../../shared/ui"

// features/comment/ui/CommentCreateForm.tsx  
import { Button, Textarea, Dialog } from "../../../shared/ui"

// features/post/ui/PostFilter.tsx
import { Select, SelectContent, SelectItem } from "../../../shared/ui"
```

**만약 Shared가 아니라면:**
```typescript
// ❌ 나쁜 예: 각 features에 Button을 복사
features/post/ui/Button.tsx
features/comment/ui/Button.tsx
features/user-view/ui/Button.tsx
// → 중복 코드, 유지보수 어려움

// ❌ 나쁜 예: entities에 Button을 넣음
entity/post/ui/Button.tsx
// → Post 전용이 아닌데 Post에 종속됨
```

### 4. **비즈니스 로직이 없는 순수 UI**

**Shared UI 컴포넌트:**
- ✅ Props만 받아서 렌더링
- ✅ 상태 관리 없음 (상태는 사용하는 쪽에서 관리)
- ✅ API 호출 없음
- ✅ 비즈니스 로직 없음

**Features/Entities 컴포넌트:**
- ✅ 비즈니스 로직 포함
- ✅ 상태 관리 포함
- ✅ API 호출 포함

**예시 비교:**

```typescript
// ✅ Shared UI - 순수 UI만
export const Button = ({ children, onClick, variant }) => {
  return <button className={...} onClick={onClick}>{children}</button>
}

// ✅ Features - 비즈니스 로직 포함
export const PostCreateForm = () => {
  const [post, setPost] = useState(...)
  const createMutation = useCreatePostMutation()
  
  const handleSubmit = async () => {
    await createMutation.mutateAsync(post) // API 호출
  }
  
  return (
    <Dialog>
      <Input value={post.title} onChange={...} />
      <Button onClick={handleSubmit}>생성</Button> // Shared UI 사용
    </Dialog>
  )
}
```

---

## 정리

### Shared UI를 Shared에 넣은 이유

1. **범용성**: 어디서든 사용 가능
2. **재사용성**: 프로젝트 전체에서 재사용
3. **비즈니스 로직 없음**: 순수 UI만 담당
4. **도메인 독립적**: 특정 도메인에 종속되지 않음
5. **FSD 원칙**: Shared 레이어의 역할에 부합

### 다른 폴더가 아닌 이유

- **Entities**: 비즈니스 도메인 객체 (Post, Comment, User 등)
- **Features**: 사용자 기능 (생성, 수정, 삭제 등)
- **Widgets**: 복합 UI 블록 (여러 컴포넌트 조합)
- **Shared**: 공통 컴포넌트/유틸리티 (Button, Input, Dialog 등)

**핵심**: Shared UI는 "도구"이고, Features/Entities는 "작품"입니다.
- Shared UI = 레고 블록 (기본 부품)
- Features/Entities = 레고로 만든 작품 (기능/도메인)

