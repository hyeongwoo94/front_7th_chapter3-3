import { useState, useCallback } from "react"
import { fetchPosts, PostWithAuthor } from "../../../entity/post"

interface UsePostListProps {
  limit: number
  skip: number
}

export const usePostList = ({ limit, skip }: UsePostListProps) => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const { posts: fetchedPosts, total: fetchedTotal } = await fetchPosts(limit, skip)
      setPosts(fetchedPosts)
      setTotal(fetchedTotal)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }, [limit, skip])

  return {
    posts,
    setPosts,
    total,
    setTotal,
    loading,
    reload: loadPosts,
  }
}

