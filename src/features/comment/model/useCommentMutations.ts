import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment, updateComment, deleteComment, likeComment, Comment, CreateCommentRequest } from "../../../entity/comment"
import { queryKeys } from "../../../app/store/queryKeys"

// 댓글 생성 Mutation (낙관적 업데이트 적용)
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: CreateCommentRequest) => addComment(comment),
    onMutate: async (newComment) => {
      if (!newComment.postId) return { previousComments: null, tempId: null }

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.comments.list(newComment.postId) })

      // 이전 값 백업
      const previousComments = queryClient.getQueryData<Comment[]>(queryKeys.comments.list(newComment.postId))

      // 임시 ID 생성
      const tempId = Date.now()

      // 낙관적 업데이트: 임시 댓글을 목록에 추가
      queryClient.setQueryData<Comment[]>(queryKeys.comments.list(newComment.postId), (old) => {
        if (!old) return old
        const tempComment: Comment = {
          id: tempId, // 임시 ID
          body: newComment.body,
          postId: newComment.postId!,
          userId: newComment.userId,
          likes: 0,
          user: { id: newComment.userId, username: "", email: "" } as any, // 임시 사용자 정보
        }
        return [...old, tempComment]
      })

      return { previousComments, tempId }
    },
    onError: (err, newComment, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousComments && newComment.postId) {
        queryClient.setQueryData(queryKeys.comments.list(newComment.postId), context.previousComments)
      }
    },
    onSuccess: (newComment, _, context) => {
      // 성공 시 서버에서 받은 실제 데이터로 캐시 직접 업데이트 (리프레시 방지)
      queryClient.setQueryData<Comment[]>(queryKeys.comments.list(newComment.postId), (old) => {
        if (!old) return [newComment]
        // 임시 댓글을 실제 서버 응답으로 교체
        if (context?.tempId) {
          return old.map((c) => (c.id === context.tempId ? newComment : c))
        }
        // 임시 ID가 없으면 (낙관적 업데이트가 실패한 경우) 추가
        const exists = old.some((c) => c.id === newComment.id)
        return exists ? old : [...old, newComment]
      })
    },
  })
}

// 댓글 수정 Mutation (낙관적 업데이트 적용)
export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: string }) => updateComment(id, { body }),
    onMutate: async ({ id, body }) => {
      // 모든 댓글 쿼리에서 해당 댓글 찾기
      const allCommentQueries = queryClient.getQueriesData<Comment[]>({ queryKey: queryKeys.comments.lists() })
      let targetPostId: number | null = null

      // 해당 댓글이 있는 게시물 찾기
      for (const [queryKey, comments] of allCommentQueries) {
        if (comments?.some((c) => c.id === id)) {
          targetPostId = (queryKey as any)[2] as number // queryKeys.comments.list(postId)에서 postId 추출
          break
        }
      }

      if (!targetPostId) return { previousComments: null }

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.comments.list(targetPostId) })

      // 이전 값 백업
      const previousComments = queryClient.getQueryData<Comment[]>(queryKeys.comments.list(targetPostId))

      // 낙관적 업데이트
      queryClient.setQueryData<Comment[]>(queryKeys.comments.list(targetPostId), (old) => {
        if (!old) return old
        return old.map((comment) => (comment.id === id ? { ...comment, body } : comment))
      })

      return { previousComments, targetPostId }
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousComments && context.targetPostId) {
        queryClient.setQueryData(queryKeys.comments.list(context.targetPostId), context.previousComments)
      }
    },
    onSuccess: (updatedComment) => {
      // 성공 시 서버에서 받은 실제 데이터로 캐시 직접 업데이트 (리프레시 방지)
      queryClient.setQueryData<Comment[]>(queryKeys.comments.list(updatedComment.postId), (old) => {
        if (!old) return old
        return old.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment))
      })
    },
  })
}

// 댓글 삭제 Mutation (낙관적 업데이트 적용)
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, postId }: { id: number; postId: number }) => deleteComment(id),
    onMutate: async ({ id, postId }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.comments.list(postId) })

      // 이전 값 백업
      const previousComments = queryClient.getQueryData<Comment[]>(queryKeys.comments.list(postId))

      // 낙관적 업데이트: 목록에서 해당 댓글 제거
      queryClient.setQueryData<Comment[]>(queryKeys.comments.list(postId), (old) => {
        if (!old) return old
        return old.filter((comment) => comment.id !== id)
      })

      return { previousComments }
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(queryKeys.comments.list(variables.postId), context.previousComments)
      }
    },
    onSuccess: (_, variables) => {
      // 성공 시 캐시에서 직접 제거 (리프레시 방지)
      // 낙관적 업데이트에서 이미 제거되었으므로 추가 작업 불필요
    },
  })
}

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

