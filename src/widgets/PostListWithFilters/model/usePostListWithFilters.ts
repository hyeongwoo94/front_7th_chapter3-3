import { useEffect } from "react"
import { useAtom } from "jotai"
import { PostWithAuthor } from "../../../entity/post"
import { usePostList, usePostFilter } from "../../../features/post"
import { limitAtom, skipAtom, searchQueryAtom, selectedTagAtom } from "../../../app/store"

interface UsePostListWithFiltersProps {
  refreshTrigger?: number
  localPosts?: PostWithAuthor[]
}

export const usePostListWithFilters = ({ refreshTrigger, localPosts = [] }: UsePostListWithFiltersProps) => {
  const [limit] = useAtom(limitAtom)
  const [skip] = useAtom(skipAtom)
  const [searchQuery] = useAtom(searchQueryAtom)
  const [selectedTag] = useAtom(selectedTagAtom)
  const { posts, setPosts, total, setTotal, loading, reload } = usePostList({ limit, skip })
  const { handleFilterByTag } = usePostFilter()

  // 검색 핸들러 - 서버 검색 결과와 로컬 게시물을 병합
  const handleSearchPosts = (searchedPosts: PostWithAuthor[], searchedTotal: number) => {
    // 로컬 게시물에서도 검색어로 필터링
    const query = searchQuery.toLowerCase().trim()
    const filteredLocalPosts = localPosts.filter((post) => {
      const titleMatch = post.title?.toLowerCase().includes(query)
      const bodyMatch = post.body?.toLowerCase().includes(query)
      return titleMatch || bodyMatch
    })

    // 서버 결과와 로컬 게시물 병합 (중복 제거)
    const serverPostIds = new Set(searchedPosts.map((p) => p.id))
    const uniqueLocalPosts = filteredLocalPosts.filter((p) => !serverPostIds.has(p.id))
    const mergedPosts = [...searchedPosts, ...uniqueLocalPosts]

    setPosts(mergedPosts)
    setTotal(searchedTotal + uniqueLocalPosts.length)
  }

  // 태그 필터 핸들러
  const handleTagFilter = (tag: string) => {
    handleFilterByTag(tag, (filteredPosts, filteredTotal) => {
      setPosts(filteredPosts)
      setTotal(filteredTotal)
    })
  }

  // limit, skip 변경 시 자동으로 reload
  useEffect(() => {
    reload()
  }, [limit, skip, reload])

  // refreshTrigger 변경 시 reload (게시물 추가/수정/삭제 후 갱신용)
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0 && !searchQuery && !selectedTag) {
      reload()
    }
  }, [refreshTrigger, reload, searchQuery, selectedTag])

  return {
    posts,
    total,
    loading,
    handleSearchPosts,
    handleTagFilter,
  }
}

