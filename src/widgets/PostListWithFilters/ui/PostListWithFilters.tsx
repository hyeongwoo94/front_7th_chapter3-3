import { useEffect } from "react"
import { PostWithAuthor } from "../../../entity/post"
import { PostTableRow } from "../../../entity/post/ui"
import { PostSearchInput, PostFilter, usePostList, usePostFilter } from "../../../features/post"
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/ui"

interface PostListWithFiltersProps {
  limit: number
  skip: number
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string
  onLimitChange: (limit: number) => void
  onSkipChange: (skip: number) => void
  onSearchQueryChange: (query: string) => void
  onTagChange: (tag: string) => void
  onSortByChange: (sortBy: string) => void
  onSortOrderChange: (sortOrder: string) => void
  onViewDetail: (post: PostWithAuthor) => void
  onEdit: (post: PostWithAuthor) => void
  onDelete: (id: number) => void
  onUserClick: (userId: number) => void
  refreshTrigger?: number
  localPosts?: PostWithAuthor[]
}

export const PostListWithFilters = ({
  limit,
  skip,
  searchQuery,
  selectedTag,
  sortBy,
  sortOrder,
  onLimitChange,
  onSkipChange,
  onSearchQueryChange,
  onTagChange,
  onSortByChange,
  onSortOrderChange,
  onViewDetail,
  onEdit,
  onDelete,
  onUserClick,
  refreshTrigger,
  localPosts = [],
}: PostListWithFiltersProps) => {
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
    onTagChange(tag)
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

  return (
    <div className="flex flex-col gap-4">
      {/* 검색 및 필터 컨트롤 */}
      <div className="flex gap-4">
        <PostSearchInput
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          onSearch={handleSearchPosts}
        />
        <PostFilter
          selectedTag={selectedTag}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onTagChange={handleTagFilter}
          onSortByChange={onSortByChange}
          onSortOrderChange={onSortOrderChange}
        />
      </div>

      {/* 게시물 테이블 */}
      {loading ? (
        <div className="flex justify-center p-4">로딩 중...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-[150px]">작성자</TableHead>
              <TableHead className="w-[150px]">반응</TableHead>
              <TableHead className="w-[150px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <PostTableRow
                key={post.id}
                post={post}
                searchQuery={searchQuery}
                selectedTag={selectedTag}
                onTagClick={(tag) => handleTagFilter(tag)}
                onViewDetail={() => onViewDetail(post)}
                onEdit={() => onEdit(post)}
                onDelete={() => onDelete(post.id)}
                onUserClick={() => onUserClick(post.author?.id || 0)}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {/* 페이지네이션 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span>표시</span>
          <Select value={limit.toString()} onValueChange={(value) => onLimitChange(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
          <span>항목</span>
        </div>
        <div className="flex gap-2">
          <Button disabled={skip === 0} onClick={() => onSkipChange(Math.max(0, skip - limit))}>
            이전
          </Button>
          <Button disabled={skip + limit >= total} onClick={() => onSkipChange(skip + limit)}>
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}
