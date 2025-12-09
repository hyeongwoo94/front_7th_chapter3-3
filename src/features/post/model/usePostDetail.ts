import { useState, useCallback } from "react"
import { PostWithAuthor } from "../../../entity/post"
import { Comment } from "../../../entity/comment"
import { useCommentsQuery } from "../../../features/comment/model/useCommentQueries"

export const usePostDetail = () => {
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | null>(null)
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({})

  // 현재 선택된 게시물의 댓글 쿼리
  const commentsQuery = useCommentsQuery({
    postId: selectedPost?.id || 0,
    enabled: !!selectedPost,
  })

  // comments를 Record 형태로 변환 (기존 인터페이스 유지)
  const comments: Record<number, Comment[]> = selectedPost
    ? { [selectedPost.id]: commentsQuery.data || [] }
    : commentsMap

  const loadComments = useCallback(async (postId: number, force = false) => {
    // TanstackQuery가 자동으로 처리하므로 빈 함수
    // 필요시 refetch를 호출할 수 있음
  }, [])

  const openPostDetail = useCallback(async (post: PostWithAuthor) => {
    setSelectedPost(post)
    // TanstackQuery가 자동으로 댓글을 불러옴
  }, [])

  // 댓글 추가 (TanstackQuery mutation에서 처리)
  const addCommentToPost = useCallback(() => {
    // TanstackQuery mutation의 onSuccess에서 자동 처리됨
  }, [])

  // 댓글 수정 (TanstackQuery mutation에서 처리)
  const updateCommentInPost = useCallback(() => {
    // TanstackQuery mutation의 onSuccess에서 자동 처리됨
  }, [])

  // 댓글 삭제 (TanstackQuery mutation에서 처리)
  const removeCommentFromPost = useCallback(() => {
    // TanstackQuery mutation의 onSuccess에서 자동 처리됨
  }, [])

  return {
    selectedPost,
    setSelectedPost,
    comments,
    openPostDetail,
    loadComments,
    loading: commentsQuery.isLoading || commentsQuery.isFetching,
    addCommentToPost,
    updateCommentInPost,
    removeCommentFromPost,
  }
}
