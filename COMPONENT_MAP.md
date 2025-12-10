# 컴포넌트 위치 맵

> 컴포넌트를 찾을 때 빠르게 참조할 수 있는 맵입니다.
> `Ctrl + P`로 파일명을 검색하는 것이 가장 빠르지만, 이 맵도 유용합니다.

---

## Post 관련 컴포넌트

### Features (사용자 기능) - `features/post/ui/`

| 컴포넌트명 | 파일 경로 | 설명 |
|-----------|----------|------|
| `PostCreateForm` | `features/post/ui/PostCreateForm.tsx` | 게시물 생성 폼 |
| `PostEditForm` | `features/post/ui/PostEditForm.tsx` | 게시물 수정 폼 |
| `PostDetailDialog` | `features/post/ui/PostDetailDialog.tsx` | 게시물 상세 다이얼로그 |
| `PostFilter` | `features/post/ui/PostFilter.tsx` | 게시물 필터 (태그, 정렬) |
| `PostSearchInput` | `features/post/ui/PostSearchInput.tsx` | 게시물 검색 입력 |

**Import 방법:**
```typescript
import { PostCreateForm, PostEditForm } from "../../../features/post"
```

### Entities (비즈니스 엔티티) - `entity/post/ui/`

| 컴포넌트명 | 파일 경로 | 설명 |
|-----------|----------|------|
| `PostTableRow` | `entity/post/ui/PostTableRow.tsx` | 게시물 테이블 행 |
| `PostTitle` | `entity/post/ui/PostTitle.tsx` | 게시물 제목 (하이라이트 포함) |
| `PostActions` | `entity/post/ui/PostActions.tsx` | 게시물 액션 버튼 (보기/수정/삭제) |
| `PostReactions` | `entity/post/ui/PostReactions.tsx` | 게시물 반응 (좋아요/싫어요) |

**Import 방법:**
```typescript
import { PostTableRow, PostTitle, PostActions } from "../../../entity/post/ui"
```

---

## Comment 관련 컴포넌트

### Features (사용자 기능) - `features/comment/ui/`

| 컴포넌트명 | 파일 경로 | 설명 |
|-----------|----------|------|
| `CommentCreateForm` | `features/comment/ui/CommentCreateForm.tsx` | 댓글 생성 폼 |
| `CommentEditForm` | `features/comment/ui/CommentEditForm.tsx` | 댓글 수정 폼 |

**Import 방법:**
```typescript
import { CommentCreateForm, CommentEditForm } from "../../../features/comment"
```

### Entities (비즈니스 엔티티) - `entity/comment/ui/`

| 컴포넌트명 | 파일 경로 | 설명 |
|-----------|----------|------|
| `CommentList` | `entity/comment/ui/CommentList.tsx` | 댓글 목록 |
| `CommentItem` | `entity/comment/ui/CommentItem.tsx` | 댓글 아이템 (개별 댓글) |

**Import 방법:**
```typescript
import { CommentList, CommentItem } from "../../../entity/comment/ui"
```

---

## User 관련 컴포넌트

### Features (사용자 기능) - `features/user-view/ui/`

| 컴포넌트명 | 파일 경로 | 설명 |
|-----------|----------|------|
| `UserViewModal` | `features/user-view/ui/UserViewModal.tsx` | 사용자 정보 보기 모달 |

**Import 방법:**
```typescript
import { UserViewModal } from "../../../features/user-view"
```

### Entities (비즈니스 엔티티) - `entity/user/ui/`

| 컴포넌트명 | 파일 경로 | 설명 |
|-----------|----------|------|
| `UserAvatar` | `entity/user/ui/UserAvatar.tsx` | 사용자 아바타 |
| `UserInfo` | `entity/user/ui/UserInfo.tsx` | 사용자 정보 표시 |

**Import 방법:**
```typescript
import { UserAvatar, UserInfo } from "../../../entity/user/ui"
```

---

## Tag 관련 컴포넌트

### Entities (비즈니스 엔티티) - `entity/tag/ui/`

| 컴포넌트명 | 파일 경로 | 설명 |
|-----------|----------|------|
| `TagBadge` | `entity/tag/ui/TagBadge.tsx` | 태그 배지 |

**Import 방법:**
```typescript
import { TagBadge } from "../../../entity/tag/ui"
```

---

## Widgets (복합 UI 블록)

### `widgets/PostListWithFilters/`

| 컴포넌트명 | 파일 경로 | 설명 |
|-----------|----------|------|
| `PostListWithFilters` | `widgets/PostListWithFilters/ui/PostListWithFilters.tsx` | 게시물 목록 + 필터 (메인 위젯) |
| `PostControls` | `widgets/PostListWithFilters/ui/PostControls.tsx` | 검색 + 필터 컨트롤 |
| `PostTableSection` | `widgets/PostListWithFilters/ui/PostTableSection.tsx` | 게시물 테이블 섹션 |
| `PostPagination` | `widgets/PostListWithFilters/ui/PostPagination.tsx` | 페이지네이션 |

**Import 방법:**
```typescript
import { PostListWithFilters } from "../../../widgets/PostListWithFilters"
```

---

## Pages (페이지)

### `pages/PostsManagerPage/`

| 컴포넌트명 | 파일 경로 | 설명 |
|-----------|----------|------|
| `PostsManagerPage` | `pages/PostsManagerPage/ui/PostsManagerPage.tsx` | 게시물 관리 페이지 (메인) |
| `PostManagerHeader` | `pages/PostsManagerPage/ui/PostManagerHeader.tsx` | 페이지 헤더 |
| `PostManagerDialogs` | `pages/PostsManagerPage/ui/PostManagerDialogs.tsx` | 모든 다이얼로그 통합 |

---

## Shared (공통 컴포넌트)

### `shared/ui/`

| 컴포넌트명 | 파일 경로 | 설명 |
|-----------|----------|------|
| `Button` | `shared/ui/Button.tsx` | 버튼 컴포넌트 |
| `Input` | `shared/ui/Input.tsx` | 입력 필드 |
| `Textarea` | `shared/ui/Textarea.tsx` | 텍스트 영역 |
| `Card` | `shared/ui/Card/` | 카드 컴포넌트 |
| `Dialog` | `shared/ui/Dialog/` | 다이얼로그 컴포넌트 |
| `Select` | `shared/ui/Select/` | 셀렉트 컴포넌트 |
| `Table` | `shared/ui/Table/` | 테이블 컴포넌트 |

**Import 방법:**
```typescript
import { Button, Input, Dialog } from "../../../shared/ui"
```

---

## 빠른 찾기 가이드

### "PostCreateForm을 수정하고 싶어요"
1. `Ctrl + P` → `PostCreateForm` 입력
2. 또는 `features/post/ui/PostCreateForm.tsx` 직접 이동

### "PostTableRow를 수정하고 싶어요"
1. `Ctrl + P` → `PostTableRow` 입력
2. 또는 `entity/post/ui/PostTableRow.tsx` 직접 이동

### "어떤 컴포넌트가 있는지 확인하고 싶어요"
1. `features/post/index.ts` 확인 → 모든 Post 기능 컴포넌트
2. `entity/post/ui/index.tsx` 확인 → 모든 Post 엔티티 컴포넌트

### "이 컴포넌트가 어디서 사용되는지 알고 싶어요"
1. 컴포넌트명 선택 → `Shift + F12` (참조 찾기)
2. 또는 `Ctrl + Shift + F` → 컴포넌트명 검색

---

## 레이어별 역할 정리

### Features (사용자 기능)
- **역할**: 사용자가 할 수 있는 행동/기능
- **예시**: 생성, 수정, 삭제, 검색, 필터링
- **위치**: `features/{기능명}/ui/`

### Entities (비즈니스 엔티티)
- **역할**: 비즈니스 도메인 객체의 표현
- **예시**: 테이블 행, 제목, 액션 버튼, 반응 표시
- **위치**: `entity/{엔티티명}/ui/`

### Widgets (복합 UI 블록)
- **역할**: 여러 features/entities를 조합한 복합 컴포넌트
- **예시**: 게시물 목록 + 필터 + 페이지네이션
- **위치**: `widgets/{위젯명}/ui/`

### Pages (페이지)
- **역할**: 전체 페이지 레벨 컴포넌트
- **예시**: PostsManagerPage, UserProfilePage
- **위치**: `pages/{페이지명}/ui/`

---

## 팁

1. **가장 빠른 방법**: `Ctrl + P`로 파일명 검색
2. **인덱스 파일 활용**: `features/post/index.ts`에서 모든 export 확인
3. **전역 검색**: `Ctrl + Shift + F`로 컴포넌트 사용처 확인
4. **이 맵 활용**: 헷갈릴 때 이 문서 참조

