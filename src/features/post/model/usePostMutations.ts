import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addPost, updatePost, deletePost, Post, PostWithAuthor, CreatePostRequest } from "../../../entity/post"
import { queryKeys } from "../../../app/store/queryKeys"

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
          posts: [...(old.posts || []), { ...newPost, id: tempId, reactions: 0 } as Post],
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

