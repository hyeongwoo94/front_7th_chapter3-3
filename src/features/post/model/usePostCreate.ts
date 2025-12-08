import { useState } from "react"
import { addPost, CreatePostRequest, PostWithAuthor } from "../../../entity/post"

export const usePostCreate = () => {
  const [newPost, setNewPost] = useState<CreatePostRequest>({ title: "", body: "", userId: 1 })
  const [loading, setLoading] = useState(false)

  const handleAddPost = async (onSuccess?: (post: PostWithAuthor) => void) => {
    setLoading(true)
    try {
      const data = await addPost(newPost)
      setNewPost({ title: "", body: "", userId: 1 })
      onSuccess?.(data as PostWithAuthor)
      return data
    } catch (error: unknown) {
      console.error("게시물 추가 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    newPost,
    setNewPost,
    handleAddPost,
    loading,
  }
}
