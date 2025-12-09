# TanStack Query 사용 명세서

## 목차
1. [TanStack Query란?](#tanstack-query란)
2. [왜 사용하는가?](#왜-사용하는가)
3. [기본 개념](#기본-개념)
4. [프로젝트 구조](#프로젝트-구조)
5. [실제 사용 예시](#실제-사용-예시)
6. [주요 패턴](#주요-패턴)
7. [베스트 프랙티스](#베스트-프랙티스)
8. [주의사항](#주의사항)

---

## TanStack Query란?

TanStack Query(이전 React Query)는 **서버 상태 관리 라이브러리**입니다.

### 핵심 특징
- **자동 캐싱**: 서버 데이터를 자동으로 캐싱하여 불필요한 네트워크 요청 방지
- **자동 동기화**: 백그라운드에서 데이터를 자동으로 갱신
- **낙관적 업데이트**: 서버 응답을 기다리지 않고 즉시 UI 업데이트
- **에러 처리**: 자동 재시도 및 에러 상태 관리
- **로딩 상태**: 자동으로 로딩 상태 관리

### 기존 방식 vs TanStack Query

**기존 방식 (fetch + useState)**
```typescript
const [posts, setPosts] = useState([])
const [loading, setLoading] = useState(false)

const loadPosts = async () => {
  setLoading(true)
  try {
    const data = await fetchPosts()
    setPosts(data)
  } finally {
    setLoading(false)
  }
}
```

**TanStack Query 방식**
```typescript
const { data: posts, isLoading } = usePostListQuery({ limit: 10, skip: 0 })
// 끝! 자동으로 캐싱, 로딩, 에러 처리됨
```

---

## 왜 사용하는가?

### 1. **코드 간소화**
- `useState`, `useEffect`, `loading`, `error` 상태를 수동으로 관리할 필요 없음
- 선언적 코드로 비즈니스 로직에 집중 가능

### 2. **성능 향상**
- 자동 캐싱으로 불필요한 네트워크 요청 방지
- 백그라운드 리프레시로 사용자 경험 개선

### 3. **일관된 상태 관리**
- 서버 상태와 클라이언트 상태를 명확히 분리
- 전역 상태 관리 라이브러리(Jotai, Zustand)와 역할 분담

### 4. **낙관적 업데이트**
- 서버 응답을 기다리지 않고 즉시 UI 업데이트
- 사용자 경험 크게 개선

---

## 기본 개념

### 1. QueryClient
전역 쿼리 클라이언트. 앱의 최상위에서 Provider로 감싸야 합니다.

```typescript
// src/app/providers/QueryProvider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분간 데이터를 fresh로 유지
      gcTime: 1000 * 60 * 10,    // 10분간 캐시 유지
      refetchOnWindowFocus: false, // 창 포커스 시 자동 리프레시 비활성화
      retry: 1,                   // 실패 시 1번 재시도
    },
  },
})

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools /> {/* 개발 도구 */}
    </QueryClientProvider>
  )
}
```

### 2. useQuery
**데이터 조회**에 사용합니다.

```typescript
const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ['posts', { limit, skip }],
  queryFn: () => fetchPosts(limit, skip),
  enabled: true, // 쿼리 활성화 여부
  staleTime: 1000 * 60 * 2, // 2분간 fresh
})
```

**반환값:**
- `data`: 서버에서 받은 데이터
- `isLoading`: 첫 로딩 중인지 여부
- `isFetching`: 데이터를 가져오는 중인지 여부 (리프레시 포함)
- `isError`: 에러 발생 여부
- `error`: 에러 객체
- `refetch`: 수동으로 다시 가져오기

### 3. useMutation
**데이터 변경** (생성, 수정, 삭제)에 사용합니다.

```typescript
const mutation = useMutation({
  mutationFn: (newPost) => addPost(newPost),
  onSuccess: (data) => {
    // 성공 시 처리
  },
  onError: (error) => {
    // 에러 시 처리
  },
})

// 사용
mutation.mutate(newPost)
// 또는
await mutation.mutateAsync(newPost)
```

**반환값:**
- `mutate`: 비동기 함수 호출
- `mutateAsync`: Promise를 반환하는 비동기 함수
- `isPending`: mutation 진행 중인지 여부
- `isError`: 에러 발생 여부
- `data`: 성공 시 받은 데이터

### 4. Query Keys
쿼리를 식별하는 고유한 키입니다. **계층적 구조**로 관리합니다.

```typescript
// 좋은 예: 계층적 구조
['posts']                    // 모든 posts 관련 쿼리
['posts', 'list']            // posts 목록 쿼리
['posts', 'list', { limit: 10, skip: 0 }]  // 특정 필터의 목록
['posts', 'detail', 1]       // 특정 post 상세

// 나쁜 예: 평면적 구조
['postList']  // 확장성이 떨어짐
```

---

## 프로젝트 구조

### 1. QueryProvider 설정
```typescript
// src/app/providers/QueryProvider.tsx
// 앱의 최상위에서 QueryProvider로 감싸기
```

### 2. Query Keys 관리
```typescript
// src/app/store/queryKeys.ts
// 모든 쿼리 키를 중앙에서 관리
export const queryKeys = {
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters) => [...queryKeys.posts.lists(), filters] as const,
    detail: (id) => [...queryKeys.posts.details(), id] as const,
  },
}
```

### 3. Query Hooks
```typescript
// src/features/post/model/usePostListQuery.ts
// useQuery를 래핑한 커스텀 훅
export const usePostListQuery = ({ limit, skip, enabled = true }) => {
  return useQuery({
    queryKey: queryKeys.posts.list({ limit, skip }),
    queryFn: () => fetchPosts(limit, skip),
    enabled,
    staleTime: 1000 * 60 * 2,
  })
}
```

### 4. Mutation Hooks
```typescript
// src/features/post/model/usePostMutations.ts
// useMutation을 래핑한 커스텀 훅
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post) => addPost(post),
    // ... 낙관적 업데이트 로직
  })
}
```

---

## 실제 사용 예시

### 1. 데이터 조회 (useQuery)

#### 기본 사용
```typescript
// src/features/post/model/usePostListQuery.ts
import { useQuery } from "@tanstack/react-query"
import { fetchPosts } from "../../../entity/post"
import { queryKeys } from "../../../app/store/queryKeys"

export const usePostListQuery = ({ limit, skip, enabled = true }) => {
  return useQuery({
    queryKey: queryKeys.posts.list({ limit, skip }),
    queryFn: () => fetchPosts(limit, skip),
    enabled, // 조건부 활성화
    staleTime: 1000 * 60 * 2, // 2분간 fresh
  })
}
```

#### 컴포넌트에서 사용
```typescript
const { data, isLoading, isError } = usePostListQuery({ 
  limit: 10, 
  skip: 0 
})

if (isLoading) return <div>로딩 중...</div>
if (isError) return <div>에러 발생</div>

return <div>{data.posts.map(...)}</div>
```

### 2. 데이터 생성 (useMutation)

#### 낙관적 업데이트 포함
```typescript
// src/features/post/model/usePostMutations.ts
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post) => addPost(post),
    
    // 1. onMutate: mutation 실행 전 (낙관적 업데이트)
    onMutate: async (newPost) => {
      // 진행 중인 쿼리 취소 (낙관적 업데이트와 충돌 방지)
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.lists() })

      // 이전 값 백업 (에러 시 롤백용)
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: queryKeys.posts.lists() 
      })

      // 임시 ID 생성
      const tempId = Date.now()

      // 낙관적 업데이트: 임시 데이터를 캐시에 추가
      queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (old) => {
        if (!old) return old
        return {
          ...old,
          posts: [...old.posts, { ...newPost, id: tempId }],
          total: old.total + 1,
        }
      })

      // context 반환 (onError, onSuccess에서 사용)
      return { previousQueries, tempId }
    },

    // 2. onError: mutation 실패 시
    onError: (err, newPost, context) => {
      // 이전 값으로 롤백
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    // 3. onSuccess: mutation 성공 시
    onSuccess: (newPost, _, context) => {
      // 서버 응답으로 임시 데이터 교체 (리프레시 방지)
      queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (old) => {
        if (!old) return old
        // 임시 ID를 실제 서버 응답으로 교체
        if (context?.tempId) {
          return {
            ...old,
            posts: old.posts.map(p => 
              p.id === context.tempId ? newPost : p
            ),
          }
        }
        return old
      })
    },
  })
}
```

#### 컴포넌트에서 사용
```typescript
const createPostMutation = useCreatePostMutation()

const handleSubmit = async () => {
  try {
    await createPostMutation.mutateAsync(newPost)
    // 성공 처리
  } catch (error) {
    // 에러 처리 (onError에서도 처리됨)
  }
}
```

### 3. 데이터 수정 (useMutation)

```typescript
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, post }) => updatePost(id, post),
    
    onMutate: async ({ id, post }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.lists() })
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: queryKeys.posts.lists() 
      })

      // 낙관적 업데이트: 캐시에서 해당 항목 수정
      queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (old) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.map(p => 
            p.id === id ? { ...p, ...post } : p
          ),
        }
      })

      return { previousQueries }
    },

    onError: (err, variables, context) => {
      // 롤백
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    onSuccess: (updatedPost) => {
      // 서버 응답으로 캐시 업데이트 (리프레시 방지)
      queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (old) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.map(p => 
            p.id === updatedPost.id ? updatedPost : p
          ),
        }
      })
    },
  })
}
```

### 4. 데이터 삭제 (useMutation)

```typescript
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deletePost(id),
    
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.lists() })
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: queryKeys.posts.lists() 
      })

      // 낙관적 업데이트: 캐시에서 해당 항목 제거
      queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (old) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.filter(p => p.id !== deletedId),
          total: old.total - 1,
        }
      })

      return { previousQueries }
    },

    onError: (err, deletedId, context) => {
      // 롤백
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    onSuccess: () => {
      // 낙관적 업데이트에서 이미 제거되었으므로 추가 작업 불필요
      // invalidateQueries를 호출하지 않아 리프레시 방지
    },
  })
}
```

---

## 주요 패턴

### 1. 낙관적 업데이트 (Optimistic Updates)

**목적**: 서버 응답을 기다리지 않고 즉시 UI 업데이트

**패턴:**
1. `onMutate`: 낙관적 업데이트 실행 + 이전 값 백업
2. `onError`: 에러 시 롤백
3. `onSuccess`: 서버 응답으로 실제 데이터 교체

**장점:**
- 사용자 경험 향상 (즉각적인 피드백)
- 네트워크 지연을 느끼지 않음

**주의사항:**
- 항상 `onError`에서 롤백 처리 필수
- `invalidateQueries` 대신 `setQueryData`로 직접 업데이트 (리프레시 방지)

### 2. Query Keys 계층 구조

**목적**: 쿼리 무효화를 효율적으로 관리

```typescript
// 계층적 구조
queryKeys.posts.all              // ['posts']
queryKeys.posts.lists()          // ['posts', 'list']
queryKeys.posts.list({ limit: 10 })  // ['posts', 'list', { limit: 10 }]

// 무효화 시
queryClient.invalidateQueries({ 
  queryKey: queryKeys.posts.lists() 
})
// → 모든 posts 목록 쿼리가 무효화됨
```

### 3. 조건부 쿼리 활성화

```typescript
const { data } = usePostListQuery({
  limit,
  skip,
  enabled: searchQuery.length === 0, // 검색어가 없을 때만 활성화
})
```

### 4. 여러 쿼리 중 하나만 활성화

```typescript
// 검색, 필터, 기본 목록 중 하나만 활성화
const searchQuery = usePostSearchQuery({
  query: searchQuery,
  enabled: searchQuery.length > 0,
})

const tagFilterQuery = usePostFilterQuery({
  tag: selectedTag,
  enabled: selectedTag.length > 0,
})

const postListQuery = usePostListQuery({
  limit,
  skip,
  enabled: searchQuery.length === 0 && selectedTag.length === 0,
})

// 활성화된 쿼리만 사용
const activeQuery = searchQuery.length > 0 
  ? searchQuery 
  : selectedTag.length > 0 
    ? tagFilterQuery 
    : postListQuery
```

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

## 주의사항

### 1. invalidateQueries는 신중하게 사용
- `invalidateQueries`는 쿼리를 무효화하고 자동으로 리프레시합니다
- 낙관적 업데이트 후에는 `setQueryData`로 직접 업데이트하는 것이 좋습니다
- 리프레시가 필요한 경우에만 `invalidateQueries` 사용

### 2. Query Keys는 직렬화 가능해야 함
```typescript
// ✅ 좋은 예
queryKey: ['posts', { limit: 10, skip: 0 }]

// ❌ 나쁜 예 (함수는 직렬화 불가)
queryKey: ['posts', () => getLimit()]
```

### 3. enabled 옵션으로 조건부 쿼리
```typescript
// 필수 파라미터가 없으면 쿼리 비활성화
enabled: !!postId && postId > 0
```

### 4. onMutate에서 cancelQueries 호출
- 낙관적 업데이트와 진행 중인 쿼리가 충돌하지 않도록
- 항상 `onMutate` 시작 부분에서 호출

### 5. context 타입 안전성
```typescript
// context에 타입 명시
onMutate: async (newPost) => {
  return { previousQueries, tempId } as { 
    previousQueries: any
    tempId: number 
  }
}
```

---

## 프로젝트에서의 실제 적용

### 1. 게시물 목록 조회
- `usePostListQuery`: 기본 목록
- `usePostSearchQuery`: 검색 결과
- `usePostFilterQuery`: 태그 필터 결과

### 2. 게시물 CRUD
- `useCreatePostMutation`: 생성 (낙관적 업데이트)
- `useUpdatePostMutation`: 수정 (낙관적 업데이트)
- `useDeletePostMutation`: 삭제 (낙관적 업데이트)

### 3. 댓글 CRUD
- `useCommentsQuery`: 댓글 목록 조회
- `useCreateCommentMutation`: 생성
- `useUpdateCommentMutation`: 수정
- `useDeleteCommentMutation`: 삭제
- `useLikeCommentMutation`: 좋아요 (낙관적 업데이트)

### 4. 태그 목록
- `useTagsQuery`: 태그 목록 조회 (긴 staleTime)

---

## 요약

### TanStack Query의 핵심
1. **서버 상태는 TanStack Query로 관리**
2. **클라이언트 상태는 Jotai/Zustand로 관리**
3. **낙관적 업데이트로 UX 향상**
4. **계층적 Query Keys로 효율적 관리**
5. **커스텀 훅으로 재사용성 향상**

### 기억할 점
- `useQuery`: 데이터 조회
- `useMutation`: 데이터 변경
- `onMutate`: 낙관적 업데이트
- `onError`: 롤백 처리
- `onSuccess`: 서버 응답으로 업데이트
- `setQueryData`: 직접 캐시 업데이트 (리프레시 방지)
- `invalidateQueries`: 쿼리 무효화 (신중하게 사용)

---

## 참고 자료
- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [Query Keys 가이드](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [낙관적 업데이트 가이드](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)

