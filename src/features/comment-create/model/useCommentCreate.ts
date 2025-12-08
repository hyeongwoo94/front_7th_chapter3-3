import { useState } from "react"
import { addComment, CreateCommentRequest, Comment } from "../../../entity/comment"

export const useCommentCreate = () => {
  const [newComment, setNewComment] = useState<CreateCommentRequest>({ body: "", postId: null, userId: 1 })
  const [loading, setLoading] = useState(false)

  const handleAddComment = async (onSuccess?: (comment: Comment) => void) => {
    setLoading(true)
    try {
      const data = await addComment(newComment)
      setNewComment({ body: "", postId: null, userId: 1 })
      onSuccess?.(data)
      return data
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    newComment,
    setNewComment,
    handleAddComment,
    loading,
  }
}

