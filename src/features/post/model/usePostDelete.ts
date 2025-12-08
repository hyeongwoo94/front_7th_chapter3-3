import { deletePost } from "../../../entity/post"

export const usePostDelete = () => {
  const handleDeletePost = async (id: number, onSuccess?: () => void) => {
    try {
      await deletePost(id)
      onSuccess?.()
    } catch (error: unknown) {
      console.error("게시물 삭제 오류:", error)
      throw error
    }
  }

  return {
    handleDeletePost,
  }
}
