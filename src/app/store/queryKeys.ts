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

