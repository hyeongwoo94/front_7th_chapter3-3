import { useState } from "react"
import { searchPosts, PostWithAuthor } from "../../../entity/post"

export const usePostSearch = () => {
  const [loading, setLoading] = useState(false)

  const handleSearch = async (query: string, onSuccess?: (posts: PostWithAuthor[], total: number) => void) => {
    if (!query.trim()) {
      return
    }

    setLoading(true)
    try {
      const { posts: searchedPosts, total: searchedTotal } = await searchPosts(query)
      onSuccess?.(searchedPosts as PostWithAuthor[], searchedTotal)
      return { posts: searchedPosts, total: searchedTotal }
    } catch (error: unknown) {
      console.error("게시물 검색 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    handleSearch,
    loading,
  }
}
