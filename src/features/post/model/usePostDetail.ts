import { useState } from "react"
import { PostWithAuthor } from "../../../entity/post"
import { fetchComments, Comment } from "../../../entity/comment"

export const usePostDetail = () => {
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | null>(null)
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [loading, setLoading] = useState(false)

  const openPostDetail = async (post: PostWithAuthor) => {
    setSelectedPost(post)
    await loadComments(post.id)
  }

  const loadComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음

    setLoading(true)
    try {
      const fetchedComments = await fetchComments(postId)
      setComments((prev) => ({ ...prev, [postId]: fetchedComments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    selectedPost,
    setSelectedPost,
    comments,
    openPostDetail,
    loadComments,
    loading,
  }
}

