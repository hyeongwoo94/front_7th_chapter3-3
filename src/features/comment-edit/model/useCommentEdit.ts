import { useState } from "react"
import { updateComment, Comment } from "../../../entity/comment"

export const useCommentEdit = () => {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpdateComment = async (onSuccess?: () => void) => {
    if (!selectedComment) return

    setLoading(true)
    try {
      const data = await updateComment(selectedComment.id, { body: selectedComment.body })
      onSuccess?.()
      return data
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    selectedComment,
    setSelectedComment,
    handleUpdateComment,
    loading,
  }
}

