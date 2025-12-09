import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addPost, updatePost, deletePost, Post, CreatePostRequest } from "../../../entity/post"
import { queryKeys } from "../../../app/store/queryKeys"

// 게시물 생성 Mutation
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: CreatePostRequest) => addPost(post),
    onSuccess: (newPost) => {
      // 게시물 목록 쿼리 무효화하여 자동으로 새로고침
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() })
      // 새로 생성된 게시물의 상세 정보도 캐시에 추가
      queryClient.setQueryData(queryKeys.posts.detail(newPost.id), newPost)
    },
  })
}

// 게시물 수정 Mutation
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, post }: { id: number; post: Partial<Post> }) => updatePost(id, post),
    onSuccess: (updatedPost) => {
      // 게시물 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() })
      // 수정된 게시물의 상세 정보 업데이트
      queryClient.setQueryData(queryKeys.posts.detail(updatedPost.id), updatedPost)
    },
  })
}

// 게시물 삭제 Mutation
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_, deletedId) => {
      // 게시물 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() })
      // 삭제된 게시물의 상세 정보 제거
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(deletedId) })
    },
  })
}

