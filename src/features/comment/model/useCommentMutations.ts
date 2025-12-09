import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment, updateComment, deleteComment, likeComment, Comment, CreateCommentRequest } from "../../../entity/comment"
import { queryKeys } from "../../../app/store/queryKeys"

// 댓글 생성 Mutation
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: CreateCommentRequest) => addComment(comment),
    onSuccess: (newComment) => {
      // 해당 게시물의 댓글 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(newComment.postId) })
    },
  })
}

// 댓글 수정 Mutation
export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: string }) => updateComment(id, body),
    onSuccess: (updatedComment) => {
      // 해당 게시물의 댓글 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(updatedComment.postId) })
    },
  })
}

// 댓글 삭제 Mutation
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, postId }: { id: number; postId: number }) => deleteComment(id),
    onSuccess: (_, variables) => {
      // 해당 게시물의 댓글 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(variables.postId) })
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
    onSuccess: (_, variables) => {
      // 성공 시 쿼리 무효화하여 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(variables.postId) })
    },
  })
}

