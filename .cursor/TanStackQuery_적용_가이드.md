# TanStack Query 적용 가이드

> 현재 프로젝트에서 TanStack Query가 어떻게 적용되었는지 상세히 설명하는 문서입니다.

## 목차

1. [개요](#개요)
2. [설치 및 설정](#설치-및-설정)
3. [프로젝트 구조](#프로젝트-구조)
4. [실제 구현 예시](#실제-구현-예시)
5. [핵심 패턴](#핵심-패턴)
6. [파일별 상세 설명](#파일별-상세-설명)
7. [베스트 프랙티스](#베스트-프랙티스)
8. [트러블슈팅](#트러블슈팅)

---

## 개요

### TanStack Query란?

TanStack Query(이전 React Query)는 **서버 상태 관리 라이브러리**입니다. 클라이언트 상태(Jotai)와 서버 상태를 명확히 분리하여 관리합니다.

### 프로젝트에서의 역할

- **서버 상태**: TanStack Query로 관리 (게시물, 댓글, 사용자 데이터)
- **클라이언트 상태**: Jotai로 관리 (UI 상태, 필터, 검색어)

### 왜 사용하는가?

1. **자동 캐싱**: 불필요한 네트워크 요청 방지
2. **낙관적 업데이트**: 서버 응답 전 즉시 UI 업데이트
3. **자동 재시도**: 네트워크 오류 시 자동 재시도
4. **로딩/에러 상태**: 자동으로 관리
5. **선언적 코드**: `useState` + `useEffect` 대신 선언적 훅 사용

---

## 설치 및 설정

### 1. 패키지 설치

```json
// package.json
{
  "dependencies": {
    "@tanstack/react-query": "^5.90.12",
    "@tanstack/react-query-devtools": "^5.91.1"
  }
}
```

### 2. QueryProvider 설정

```1:32:src/app/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ReactNode } from "react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (이전 cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
})

interface QueryProviderProps {
  children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export { queryClient }
```

**설정 설명:**
- `staleTime: 5분`: 데이터가 5분간 "fresh" 상태로 유지 (리프레시 안 함)
- `gcTime: 10분`: 사용하지 않는 캐시를 10분간 유지
- `refetchOnWindowFocus: false`: 창 포커스 시 자동 리프레시 비활성화
- `retry: 1`: 실패 시 1번만 재시도

### 3. App에 적용

```1:21:src/App.tsx
import { BrowserRouter as Router } from "react-router-dom"
import { QueryProvider } from "./app/providers/QueryProvider"
import Header from "./pages/layout/Header.tsx"
import Footer from "./pages/layout/Footer.tsx"
import PostsManagerPage from "./pages/PostsManagerPage"

const App = () => {
  return (
    <QueryProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PostsManagerPage />
          </main>
          <Footer />
        </div>
      </Router>
    </QueryProvider>
  )
}

export default App
```

---

## 프로젝트 구조

### 폴더 구조

```
src/
├── app/
│   ├── providers/
│   │   └── QueryProvider.tsx      # QueryClient 설정
│   └── store/
│       └── queryKeys.ts            # 쿼리 키 중앙 관리
├── entity/
│   ├── post/
│   │   └── api/
│   │       └── posts.ts            # 순수 API 함수 (fetch)
│   └── comment/
│       └── api/
│           └── comments.ts        # 순수 API 함수 (fetch)
└── features/
    ├── post/
    │   └── model/
    │       ├── usePostListQuery.ts      # useQuery 훅
    │       ├── usePostSearchQuery.ts    # useQuery 훅
    │       ├── usePostFilterQuery.ts    # useQuery 훅
    │       └── usePostMutations.ts      # useMutation 훅
    └── comment/
        └── model/
            ├── useCommentQueries.ts     # useQuery 훅
            └── useCommentMutations.ts   # useMutation 훅
```

### 역할 분담

1. **Entity Layer (`entity/*/api`)**: 순수 API 함수만 포함
   - `fetchPosts()`, `addPost()`, `updatePost()`, `deletePost()`
   - 네트워크 요청만 담당

2. **Features Layer (`features/*/model`)**: TanStack Query 훅
   - `usePostListQuery()`, `useCreatePostMutation()`
   - 비즈니스 로직과 캐싱 전략 포함

3. **App Layer (`app/store/queryKeys`)**: 쿼리 키 중앙 관리
   - 계층적 쿼리 키 구조
   - 쿼리 무효화를 위한 키 관리

---

## 실제 구현 예시

### 1. Query Keys 관리

```1:42:src/app/store/queryKeys.ts
/**
 * TanstackQuery 쿼리 키 팩토리
 * 계층적 쿼리 키 구조를 사용하여 쿼리 무효화를 쉽게 관리
 */

export const queryKeys = {
  // Posts 관련 쿼리 키
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters: { limit?: number; skip?: number; tag?: string; search?: string }) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.posts.details(), id] as const,
  },

  // Comments 관련 쿼리 키
  comments: {
    all: ["comments"] as const,
    lists: () => [...queryKeys.comments.all, "list"] as const,
    list: (postId: number) => [...queryKeys.comments.lists(), postId] as const,
    details: () => [...queryKeys.comments.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.comments.details(), id] as const,
  },

  // Tags 관련 쿼리 키
  tags: {
    all: ["tags"] as const,
    list: () => [...queryKeys.tags.all, "list"] as const,
  },

  // Users 관련 쿼리 키
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: { limit?: number; select?: string }) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
} as const
```

**계층 구조 예시:**
```
["posts"]                              // 모든 posts 관련
["posts", "list"]                      // 모든 posts 목록
["posts", "list", { limit: 10, skip: 0 }]  // 특정 필터의 목록
["posts", "detail", 1]                 // 특정 post 상세
```

### 2. useQuery 예시: 게시물 목록 조회

```1:18:src/features/post/model/usePostListQuery.ts
import { useQuery } from "@tanstack/react-query"
import { fetchPosts, PostWithAuthor } from "../../../entity/post"
import { queryKeys } from "../../../app/store/queryKeys"

interface UsePostListQueryProps {
  limit: number
  skip: number
  enabled?: boolean
}

export const usePostListQuery = ({ limit, skip, enabled = true }: UsePostListQueryProps) => {
  return useQuery({
    queryKey: queryKeys.posts.list({ limit, skip }),
    queryFn: () => fetchPosts(limit, skip),
    enabled,
    staleTime: 1000 * 60 * 2, // 2분
  })
}
```

**사용 예시:**
```typescript
const { data, isLoading, isError, error } = usePostListQuery({ 
  limit: 10, 
  skip: 0 
})

if (isLoading) return <div>로딩 중...</div>
if (isError) return <div>에러: {error.message}</div>

return <div>{data.posts.map(post => ...)}</div>
```

### 3. useQuery 예시: 검색

```1:17:src/features/post/model/usePostSearchQuery.ts
import { useQuery } from "@tanstack/react-query"
import { searchPosts, Post } from "../../../entity/post"
import { queryKeys } from "../../../app/store/queryKeys"

interface UsePostSearchQueryProps {
  query: string
  enabled?: boolean
}

export const usePostSearchQuery = ({ query, enabled = true }: UsePostSearchQueryProps) => {
  return useQuery({
    queryKey: queryKeys.posts.list({ search: query }),
    queryFn: () => searchPosts(query),
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 2, // 2분
  })
}
```

**조건부 활성화:**
- `enabled: enabled && query.length > 0`: 검색어가 있을 때만 쿼리 실행

### 4. useMutation 예시: 게시물 생성 (낙관적 업데이트)

```5:77:src/features/post/model/usePostMutations.ts
// 게시물 생성 Mutation (낙관적 업데이트 적용)
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: CreatePostRequest) => addPost(post),
    onMutate: async (newPost) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.lists() })

      // 이전 값 백업
      const previousQueries = queryClient.getQueriesData({ queryKey: queryKeys.posts.lists() })

      // 임시 ID 생성
      const tempId = Date.now()

      // 낙관적 업데이트: 임시 게시물을 목록에 추가
      queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (old: any) => {
        if (!old) return old
        // old가 { posts, total } 형태인지 확인
        if (Array.isArray(old)) return old
        return {
          ...old,
          posts: [...(old.posts || []), { ...newPost, id: tempId, reactions: { likes: 0, dislikes: 0 } } as Post],
          total: (old.total || 0) + 1,
        }
      })

      return { previousQueries, tempId }
    },
    onError: (err, newPost, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSuccess: (newPost, _, context) => {
      // 성공 시 서버에서 받은 실제 데이터로 캐시 직접 업데이트 (리프레시 방지)
      queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (old: any) => {
        if (!old) return old
        if (Array.isArray(old)) {
          // 배열인 경우 (일반적으로는 발생하지 않지만 안전을 위해)
          // 임시 게시물을 실제 서버 응답으로 교체
          if (context?.tempId) {
            return old.map((p: Post) => (p.id === context.tempId ? newPost : p))
          }
          const exists = old.some((p: Post) => p.id === newPost.id)
          return exists ? old : [...old, newPost as PostWithAuthor]
        }
        // { posts, total } 형태인 경우
        const posts = old.posts || []
        // 임시 게시물을 실제 서버 응답으로 교체
        if (context?.tempId) {
          return {
            ...old,
            posts: posts.map((p: Post) => (p.id === context.tempId ? newPost : p)),
          }
        }
        // 임시 ID가 없으면 (낙관적 업데이트가 실패한 경우) 추가
        const exists = posts.some((p: Post) => p.id === newPost.id)
        return {
          ...old,
          posts: exists ? posts : [...posts, newPost as PostWithAuthor],
          total: exists ? old.total : (old.total || 0) + 1,
        }
      })
      // 새로 생성된 게시물의 상세 정보도 캐시에 추가
      queryClient.setQueryData(queryKeys.posts.detail(newPost.id), newPost)
    },
  })
}
```

**낙관적 업데이트 흐름:**

1. **onMutate** (mutation 실행 전):
   - 진행 중인 쿼리 취소 (`cancelQueries`)
   - 이전 값 백업 (롤백용)
   - 임시 데이터를 캐시에 추가 (즉시 UI 업데이트)

2. **onError** (mutation 실패 시):
   - 백업된 이전 값으로 롤백

3. **onSuccess** (mutation 성공 시):
   - 서버 응답으로 임시 데이터 교체
   - `invalidateQueries` 대신 `setQueryData` 사용 (리프레시 방지)

### 5. useMutation 예시: 게시물 수정

```79:144:src/features/post/model/usePostMutations.ts
// 게시물 수정 Mutation (낙관적 업데이트 적용)
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, post }: { id: number; post: Partial<Post> }) => updatePost(id, post),
    onMutate: async ({ id, post }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.lists() })

      // 이전 값 백업
      const previousQueries = queryClient.getQueriesData({ queryKey: queryKeys.posts.lists() })

      // 낙관적 업데이트: 목록에서 해당 게시물 업데이트
      queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (old: any) => {
        if (!old) return old
        if (Array.isArray(old)) return old
        return {
          ...old,
          posts: (old.posts || []).map((p: Post) => (p.id === id ? { ...p, ...post } : p)),
        }
      })

      return { previousQueries }
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSuccess: (updatedPost, variables) => {
      // 성공 시 서버에서 받은 실제 데이터로 캐시 직접 업데이트 (리프레시 방지)
      queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (old: any) => {
        if (!old) return old
        if (Array.isArray(old)) {
          return old.map((p: PostWithAuthor) => {
            if (p.id === updatedPost.id) {
              // author 정보 유지
              return { ...updatedPost, author: p.author } as PostWithAuthor
            }
            return p
          })
        }
        return {
          ...old,
          posts: (old.posts || []).map((p: PostWithAuthor) => {
            if (p.id === updatedPost.id) {
              // author 정보 유지
              return { ...updatedPost, author: p.author } as PostWithAuthor
            }
            return p
          }),
        }
      })
      // 수정된 게시물의 상세 정보 업데이트 (author 정보 유지)
      const existingPost = queryClient.getQueryData<PostWithAuthor>(queryKeys.posts.detail(updatedPost.id))
      queryClient.setQueryData(queryKeys.posts.detail(updatedPost.id), {
        ...updatedPost,
        author: existingPost?.author,
      } as PostWithAuthor)
    },
  })
}
```

### 6. useMutation 예시: 게시물 삭제

```146:187:src/features/post/model/usePostMutations.ts
// 게시물 삭제 Mutation (낙관적 업데이트 적용)
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onMutate: async (deletedId) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.lists() })

      // 이전 값 백업
      const previousQueries = queryClient.getQueriesData({ queryKey: queryKeys.posts.lists() })

      // 낙관적 업데이트: 목록에서 해당 게시물 제거
      queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (old: any) => {
        if (!old) return old
        if (Array.isArray(old)) return old.filter((p: Post) => p.id !== deletedId)
        return {
          ...old,
          posts: (old.posts || []).filter((p: Post) => p.id !== deletedId),
          total: Math.max(0, (old.total || 0) - 1),
        }
      })

      return { previousQueries }
    },
    onError: (err, deletedId, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSuccess: (_, deletedId) => {
      // 성공 시 캐시에서 직접 제거 (리프레시 방지)
      // 낙관적 업데이트에서 이미 제거되었으므로 추가 작업 불필요
      // 삭제된 게시물의 상세 정보 제거
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(deletedId) })
    },
  })
}
```

### 7. 댓글 조회 및 Mutation

```1:17:src/features/comment/model/useCommentQueries.ts
import { useQuery } from "@tanstack/react-query"
import { fetchComments } from "../../../entity/comment"
import { queryKeys } from "../../../app/store/queryKeys"

interface UseCommentsQueryProps {
  postId: number
  enabled?: boolean
}

export const useCommentsQuery = ({ postId, enabled = true }: UseCommentsQueryProps) => {
  return useQuery({
    queryKey: queryKeys.comments.list(postId),
    queryFn: () => fetchComments(postId),
    enabled: enabled && postId > 0,
    staleTime: 1000 * 60 * 2, // 2분
  })
}
```

```146:184:src/features/comment/model/useCommentMutations.ts
// 댓글 좋아요 Mutation (낙관적 업데이트 적용)
export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, currentLikes, postId }: { id: number; currentLikes: number; postId: number }) =>
      likeComment(id, currentLikes),
    onMutate: async ({ id, postId }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.comments.list(postId) })

      // 이전 값 백업
      const previousComments = queryClient.getQueryData<Comment[]>(queryKeys.comments.list(postId))

      // 낙관적 업데이트
      queryClient.setQueryData<Comment[]>(queryKeys.comments.list(postId), (old) => {
        if (!old) return old
        return old.map((comment) => (comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment))
      })

      return { previousComments }
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(queryKeys.comments.list(variables.postId), context.previousComments)
      }
    },
    onSuccess: (updatedComment, variables) => {
      // 성공 시 서버에서 받은 실제 데이터로 캐시 직접 업데이트 (리프레시 방지)
      queryClient.setQueryData<Comment[]>(queryKeys.comments.list(variables.postId), (old) => {
        if (!old) return old
        return old.map((comment) => 
          comment.id === variables.id ? { ...comment, likes: updatedComment.likes } : comment
        )
      })
    },
  })
}
```

---

## 핵심 패턴

### 1. 낙관적 업데이트 패턴

**목적**: 서버 응답을 기다리지 않고 즉시 UI 업데이트

**구조:**
```typescript
useMutation({
  mutationFn: (data) => apiCall(data),
  
  // 1. mutation 실행 전
  onMutate: async (data) => {
    // 진행 중인 쿼리 취소
    await queryClient.cancelQueries(...)
    
    // 이전 값 백업
    const previous = queryClient.getQueryData(...)
    
    // 낙관적 업데이트
    queryClient.setQueryData(..., (old) => {
      // 임시 데이터 추가/수정/삭제
    })
    
    return { previous } // context 반환
  },
  
  // 2. mutation 실패 시
  onError: (err, variables, context) => {
    // 롤백
    if (context?.previous) {
      queryClient.setQueryData(..., context.previous)
    }
  },
  
  // 3. mutation 성공 시
  onSuccess: (result, variables, context) => {
    // 서버 응답으로 교체 (리프레시 방지)
    queryClient.setQueryData(..., (old) => {
      // 실제 데이터로 교체
    })
  },
})
```

### 2. Query Keys 계층 구조

**목적**: 효율적인 쿼리 무효화

```typescript
// 계층적 구조
queryKeys.posts.all                    // ["posts"]
queryKeys.posts.lists()                 // ["posts", "list"]
queryKeys.posts.list({ limit: 10 })     // ["posts", "list", { limit: 10 }]
queryKeys.posts.detail(1)               // ["posts", "detail", 1]

// 무효화 시
queryClient.invalidateQueries({ 
  queryKey: queryKeys.posts.lists() 
})
// → 모든 posts 목록 쿼리가 무효화됨
```

### 3. 조건부 쿼리 활성화

```typescript
// 검색어가 있을 때만 검색 쿼리 실행
const searchQuery = usePostSearchQuery({
  query: searchQuery,
  enabled: searchQuery.length > 0,
})

// 여러 쿼리 중 하나만 활성화
const postListQuery = usePostListQuery({
  limit,
  skip,
  enabled: searchQuery.length === 0 && selectedTag === "all",
})
```

### 4. setQueryData vs invalidateQueries

**setQueryData** (권장):
- 직접 캐시 업데이트
- 리프레시 발생 안 함
- 낙관적 업데이트 후 사용

**invalidateQueries**:
- 쿼리 무효화 후 자동 리프레시
- 서버에서 최신 데이터 가져옴
- 리프레시가 필요한 경우에만 사용

---

## 파일별 상세 설명

### Entity Layer: 순수 API 함수

#### `src/entity/post/api/posts.ts`

```5:27:src/entity/post/api/posts.ts
export const fetchPosts = async (limit: number, skip: number): Promise<{ posts: PostWithAuthor[]; total: number }> => {
  const postsResponse = await fetch(`${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`)
  if (!postsResponse.ok) {
    throw new Error(`Failed to fetch posts: ${postsResponse.status}`)
  }
  const postsData: PostsResponse = await postsResponse.json()

  const usersResponse = await fetch(`${API_BASE_URL}/users?limit=0&select=username,image`)
  if (!usersResponse.ok) {
    throw new Error(`Failed to fetch users: ${usersResponse.status}`)
  }
  const usersData = await usersResponse.json()

  const postsWithUsers: PostWithAuthor[] = postsData.posts.map((post) => ({
    ...post,
    author: usersData.users.find((user: User) => user.id === post.userId),
  }))

  return {
    posts: postsWithUsers,
    total: postsData.total,
  }
}
```

**특징:**
- 순수 함수: 부작용 없음
- 에러 처리: `throw new Error()`
- 데이터 변환: posts와 users를 결합하여 `PostWithAuthor` 반환

#### `src/entity/comment/api/comments.ts`

```4:11:src/entity/comment/api/comments.ts
export const fetchComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.status}`)
  }
  const data: CommentsResponse = await response.json()
  return data.comments
}
```

### Features Layer: TanStack Query 훅

#### `src/features/post/model/usePostListQuery.ts`

- `useQuery`를 래핑한 커스텀 훅
- `queryKeys.posts.list()` 사용
- `enabled` 옵션으로 조건부 활성화

#### `src/features/post/model/usePostMutations.ts`

- `useMutation`을 래핑한 커스텀 훅
- 낙관적 업데이트 구현
- `onMutate`, `onError`, `onSuccess` 핸들러 포함

---

## 베스트 프랙티스

### 1. Query Keys는 중앙에서 관리

```typescript
// ✅ 좋은 예
// src/app/store/queryKeys.ts
export const queryKeys = {
  posts: {
    all: ["posts"] as const,
    list: (filters) => [...queryKeys.posts.all, "list", filters] as const,
  },
}

// ❌ 나쁜 예
// 각 파일에서 직접 정의
const queryKey = ['posts', limit, skip]
```

### 2. 커스텀 훅으로 래핑

```typescript
// ✅ 좋은 예
export const usePostListQuery = ({ limit, skip }) => {
  return useQuery({
    queryKey: queryKeys.posts.list({ limit, skip }),
    queryFn: () => fetchPosts(limit, skip),
  })
}

// ❌ 나쁜 예
// 컴포넌트에서 직접 useQuery 사용
const { data } = useQuery({
  queryKey: ['posts', limit, skip],
  queryFn: () => fetchPosts(limit, skip),
})
```

### 3. 낙관적 업데이트는 항상 롤백 처리

```typescript
onMutate: async (newPost) => {
  // 이전 값 백업 (필수!)
  const previousQueries = queryClient.getQueriesData(...)
  
  // 낙관적 업데이트
  queryClient.setQueryData(...)
  
  return { previousQueries } // context 반환
},

onError: (err, variables, context) => {
  // 항상 롤백 처리
  if (context?.previousQueries) {
    // 롤백 로직
  }
}
```

### 4. invalidateQueries 대신 setQueryData 사용

```typescript
// ❌ 나쁜 예: 리프레시 발생
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() })
}

// ✅ 좋은 예: 직접 업데이트 (리프레시 방지)
onSuccess: (updatedPost) => {
  queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (old) => {
    // 직접 업데이트
  })
}
```

### 5. staleTime 적절히 설정

```typescript
// 자주 변경되지 않는 데이터: 긴 staleTime
staleTime: 1000 * 60 * 10, // 10분 (태그 목록)

// 자주 변경되는 데이터: 짧은 staleTime
staleTime: 1000 * 60 * 2,  // 2분 (게시물 목록)

// 실시간 데이터: 0
staleTime: 0, // 항상 fresh
```

---

## 트러블슈팅

### 1. 쿼리가 실행되지 않을 때

**원인**: `enabled` 옵션이 `false`

**해결**:
```typescript
const { data } = usePostListQuery({
  limit: 10,
  skip: 0,
  enabled: true, // 명시적으로 true 설정
})
```

### 2. 낙관적 업데이트가 롤백되지 않을 때

**원인**: `onError`에서 롤백 로직 누락

**해결**:
```typescript
onError: (err, variables, context) => {
  // 항상 롤백 처리
  if (context?.previousQueries) {
    context.previousQueries.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data)
    })
  }
}
```

### 3. 쿼리가 계속 리프레시될 때

**원인**: `invalidateQueries` 사용 또는 `staleTime` 설정 문제

**해결**:
```typescript
// setQueryData 사용 (리프레시 방지)
onSuccess: (data) => {
  queryClient.setQueryData(queryKey, data)
}

// 또는 staleTime 증가
staleTime: 1000 * 60 * 5, // 5분
```

### 4. 타입 에러 발생 시

**원인**: Query Keys 타입 불일치

**해결**:
```typescript
// queryKeys에 as const 추가
export const queryKeys = {
  posts: {
    all: ["posts"] as const,
  },
} as const
```

---

## 요약

### 핵심 개념

1. **useQuery**: 데이터 조회 (GET)
2. **useMutation**: 데이터 변경 (POST, PUT, DELETE, PATCH)
3. **낙관적 업데이트**: 서버 응답 전 즉시 UI 업데이트
4. **Query Keys**: 계층적 구조로 관리
5. **setQueryData**: 직접 캐시 업데이트 (리프레시 방지)

### 프로젝트 구조

- **Entity Layer**: 순수 API 함수
- **Features Layer**: TanStack Query 훅
- **App Layer**: QueryClient 설정 및 Query Keys 관리

### 기억할 점

- 서버 상태는 TanStack Query로 관리
- 클라이언트 상태는 Jotai로 관리
- 낙관적 업데이트는 항상 롤백 처리
- `invalidateQueries` 대신 `setQueryData` 사용 (낙관적 업데이트 후)

---

## 참고 자료

- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [Query Keys 가이드](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [낙관적 업데이트 가이드](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [React Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools)

