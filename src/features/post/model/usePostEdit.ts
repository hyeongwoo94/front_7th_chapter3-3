import { useState } from "react"
import { updatePost, PostWithAuthor } from "../../../entity/post"

export const usePostEdit = () => {
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpdatePost = async (onSuccess?: () => void) => {
    if (!selectedPost) return

    setLoading(true)
    try {
      const data = await updatePost(selectedPost.id, selectedPost)
      onSuccess?.()
      return data
    } catch (error: unknown) {
      console.error("게시물 업데이트 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    selectedPost,
    setSelectedPost,
    handleUpdatePost,
    loading,
  }
}
