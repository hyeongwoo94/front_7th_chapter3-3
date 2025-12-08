import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui"
import { usePostFilter } from "../model/usePostFilter"

interface PostFilterProps {
  selectedTag?: string
  sortBy?: string
  sortOrder?: string
  onTagChange?: (tag: string) => void
  onSortByChange?: (sortBy: string) => void
  onSortOrderChange?: (sortOrder: string) => void
}

export const PostFilter = ({
  selectedTag: externalSelectedTag,
  sortBy: externalSortBy,
  sortOrder: externalSortOrder,
  onTagChange,
  onSortByChange,
  onSortOrderChange,
}: PostFilterProps) => {
  const { tags } = usePostFilter()
  const selectedTag = externalSelectedTag || ""
  const sortBy = externalSortBy || ""
  const sortOrder = externalSortOrder || "asc"

  return (
    <div className="flex gap-4">
      <Select
        value={selectedTag || "all"}
        onValueChange={(value) => {
          // "all"을 선택하면 빈 문자열로 변환
          onTagChange?.(value === "all" ? "" : value)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={(value) => onSortByChange?.(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={(value) => onSortOrderChange?.(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

