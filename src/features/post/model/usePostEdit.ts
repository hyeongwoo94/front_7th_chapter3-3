import { useState } from "react"
import { updatePost, PostWithAuthor } from "../../../entity/post"

export const usePostEdit = () => {
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpdatePost = async (onSuccess?: (updatedPost: PostWithAuthor) => void) => {
    if (!selectedPost) return

    setLoading(true)
    try {
      const data = await updatePost(selectedPost.id, selectedPost)
      // Post를 PostWithAuthor로 변환 (author 정보는 기존 selectedPost에서 가져옴)
      const updatedPost: PostWithAuthor = {
        ...data,
        author: selectedPost.author, // author 정보는 기존 것 유지
      }
      onSuccess?.(updatedPost)
      return updatedPost
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
