import { useState } from "react"
import { addComment, updateComment, likeComment, CreateCommentRequest, Comment } from "../../../entity/comment"

export const useCommentManagement = () => {
  // 댓글 생성 관련 상태
  const [newComment, setNewComment] = useState<CreateCommentRequest>({ body: "", postId: null, userId: 1 })
  const [createLoading, setCreateLoading] = useState(false)

  // 댓글 수정 관련 상태
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [editLoading, setEditLoading] = useState(false)

  // 댓글 생성
  const handleAddComment = async (onSuccess?: (comment: Comment) => void) => {
    setCreateLoading(true)
    try {
      const data = await addComment(newComment)
      setNewComment({ body: "", postId: null, userId: 1 })
      onSuccess?.(data)
      return data
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      throw error
    } finally {
      setCreateLoading(false)
    }
  }

  // 댓글 수정
  const handleUpdateComment = async (onSuccess?: () => void) => {
    if (!selectedComment) return

    setEditLoading(true)
    try {
      const data = await updateComment(selectedComment.id, { body: selectedComment.body })
      onSuccess?.()
      return data
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
      throw error
    } finally {
      setEditLoading(false)
    }
  }

  // 댓글 좋아요
  const handleLikeComment = async (id: number, currentLikes: number, onSuccess?: () => void) => {
    try {
      await likeComment(id, currentLikes)
      onSuccess?.()
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
      throw error
    }
  }

  return {
    // 생성 관련
    newComment,
    setNewComment,
    handleAddComment,
    createLoading,
    // 수정 관련
    selectedComment,
    setSelectedComment,
    handleUpdateComment,
    editLoading,
    // 좋아요 관련
    handleLikeComment,
  }
}

