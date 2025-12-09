import { useMemo } from "react"
import { useAtom } from "jotai"
import { PostWithAuthor } from "../../../entity/post"
import { usePostListQuery, usePostFilterQuery, usePostSearchQuery } from "../../../features/post"
import { limitAtom, skipAtom, searchQueryAtom, selectedTagAtom } from "../../../app/store"

interface UsePostListWithFiltersProps {
  localPosts?: PostWithAuthor[]
}

export const usePostListWithFilters = ({ localPosts = [] }: UsePostListWithFiltersProps) => {
  const [limit] = useAtom(limitAtom)
  const [skip] = useAtom(skipAtom)
  const [searchQuery] = useAtom(searchQueryAtom)
  const [selectedTag] = useAtom(selectedTagAtom)

  // 검색어가 있으면 검색 쿼리 사용
  const searchQueryResult = usePostSearchQuery({
    query: searchQuery,
    enabled: searchQuery.length > 0,
  })

  // 태그가 선택되어 있으면 태그 필터 쿼리 사용
  const tagFilterQueryResult = usePostFilterQuery({
    tag: selectedTag,
    enabled: selectedTag.length > 0 && selectedTag !== "all",
  })

  // 기본 게시물 목록 쿼리 (검색/필터가 없을 때만 활성화)
  const postListQueryResult = usePostListQuery({
    limit,
    skip,
    enabled: searchQuery.length === 0 && (selectedTag.length === 0 || selectedTag === "all"),
  })

  // 현재 활성화된 쿼리 결정
  const activeQuery = useMemo(() => {
    if (searchQuery.length > 0) {
      return searchQueryResult
    }
    if (selectedTag.length > 0 && selectedTag !== "all") {
      return tagFilterQueryResult
    }
    return postListQueryResult
  }, [searchQuery, selectedTag, searchQueryResult, tagFilterQueryResult, postListQueryResult])

  // 게시물 목록과 총 개수 추출
  const posts = useMemo(() => {
    if (activeQuery.data) {
      return activeQuery.data.posts || []
    }
    return []
  }, [activeQuery.data])

  const total = useMemo(() => {
    if (activeQuery.data) {
      return activeQuery.data.total || 0
    }
    return 0
  }, [activeQuery.data])

  const loading = activeQuery.isLoading || activeQuery.isFetching

  // 로컬 게시물과 서버 게시물 병합 (검색 시)
  const mergedPosts = useMemo(() => {
    if (searchQuery.length > 0 && localPosts.length > 0) {
      const query = searchQuery.toLowerCase().trim()
      const filteredLocalPosts = localPosts.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(query)
        const bodyMatch = post.body?.toLowerCase().includes(query)
        return titleMatch || bodyMatch
      })

      // 서버 결과와 로컬 게시물 병합 (중복 제거)
      const serverPostIds = new Set(posts.map((p) => p.id))
      const uniqueLocalPosts = filteredLocalPosts.filter((p) => !serverPostIds.has(p.id))
      return [...posts, ...uniqueLocalPosts]
    }
    return posts
  }, [posts, localPosts, searchQuery])

  const mergedTotal = useMemo(() => {
    if (searchQuery.length > 0 && localPosts.length > 0) {
      const query = searchQuery.toLowerCase().trim()
      const filteredLocalPosts = localPosts.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(query)
        const bodyMatch = post.body?.toLowerCase().includes(query)
        return titleMatch || bodyMatch
      })
      const serverPostIds = new Set(posts.map((p) => p.id))
      const uniqueLocalPosts = filteredLocalPosts.filter((p) => !serverPostIds.has(p.id))
      return total + uniqueLocalPosts.length
    }
    return total
  }, [total, posts, localPosts, searchQuery])

  // 검색 핸들러 (TanstackQuery가 자동으로 처리하므로 빈 함수)
  const handleSearchPosts = () => {
    // 검색은 searchQuery atom 변경으로 자동 처리됨
  }

  // 태그 필터 핸들러 (TanstackQuery가 자동으로 처리하므로 빈 함수)
  const handleTagFilter = () => {
    // 태그 필터는 selectedTag atom 변경으로 자동 처리됨
  }

  // 게시물 업데이트 핸들러 (쿼리 캐시 직접 업데이트)
  const updatePostInList = () => {
    // TanstackQuery의 쿼리 캐시는 mutation에서 자동으로 처리됨
    // 필요시 queryClient.setQueryData를 사용할 수 있지만, mutation의 onSuccess에서 처리하는 것이 더 좋음
  }

  // 게시물 삭제 핸들러 (쿼리 캐시 직접 업데이트)
  const removePostFromList = () => {
    // TanstackQuery의 쿼리 캐시는 mutation에서 자동으로 처리됨
  }

  return {
    posts: mergedPosts,
    total: mergedTotal,
    loading,
    handleSearchPosts,
    handleTagFilter,
    updatePostInList,
    removePostFromList,
    refetch: activeQuery.refetch,
  }
}

