import { useState, useEffect } from "react"
import { fetchPostsByTag, PostWithAuthor } from "../../../entity/post"
import { fetchTags, Tag } from "../../../entity/tag"

export const usePostFilter = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTag, setSelectedTag] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await fetchTags()
        setTags(data)
      } catch (error: unknown) {
        console.error("태그 가져오기 오류:", error)
      }
    }
    loadTags()
  }, [])

  const handleFilterByTag = async (tag: string, onSuccess?: (posts: PostWithAuthor[], total: number) => void) => {
    if (!tag || tag === "all") {
      setSelectedTag("")
      return
    }

    setSelectedTag(tag)
    setLoading(true)
    try {
      const { posts: fetchedPosts, total: fetchedTotal } = await fetchPostsByTag(tag)
      onSuccess?.(fetchedPosts, fetchedTotal)
      return { posts: fetchedPosts, total: fetchedTotal }
    } catch (error: unknown) {
      console.error("태그별 게시물 가져오기 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    tags,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleFilterByTag,
    loading,
  }
}
