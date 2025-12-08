import { likeComment } from "../../../entity/comment"

export const useCommentLike = () => {
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
    handleLikeComment,
  }
}

