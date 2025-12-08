import { useState, useCallback, useRef, useEffect } from "react"
import { PostWithAuthor } from "../../../entity/post"
import { fetchComments, Comment } from "../../../entity/comment"

export const usePostDetail = () => {
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | null>(null)
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [loading, setLoading] = useState(false)
  const commentsRef = useRef<Record<number, Comment[]>>({})

  // comments 상태가 변경될 때마다 ref 업데이트
  useEffect(() => {
    commentsRef.current = comments
  }, [comments])

  const loadComments = useCallback(async (postId: number, force = false) => {
    // force가 false이고 이미 불러온 댓글이 있으면 다시 불러오지 않음
    if (!force && commentsRef.current[postId]) {
      console.log("댓글 이미 로드됨, 건너뜀:", postId)
      return
    }

    setLoading(true)
    try {
      console.log("댓글 불러오기 시도:", postId, "force:", force)
      const fetchedComments = await fetchComments(postId)
      console.log("댓글 불러오기 성공:", fetchedComments.length, "개")
      setComments((prev) => {
        const updated = { ...prev, [postId]: fetchedComments }
        console.log("댓글 상태 업데이트 완료, postId:", postId, "댓글 수:", fetchedComments.length)
        return updated
      })
    } catch (error: unknown) {
      console.error("댓글 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const openPostDetail = useCallback(
    async (post: PostWithAuthor) => {
      setSelectedPost(post)
      await loadComments(post.id)
    },
    [loadComments],
  )

  return {
    selectedPost,
    setSelectedPost,
    comments,
    openPostDetail,
    loadComments,
    loading,
  }
}
