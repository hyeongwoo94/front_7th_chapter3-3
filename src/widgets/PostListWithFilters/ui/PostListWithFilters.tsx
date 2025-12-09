import { useEffect, useRef } from "react"
import { PostWithAuthor } from "../../../entity/post"
import { usePostListWithFilters } from "../model/usePostListWithFilters"
import { PostControls } from "./PostControls"
import { PostTableSection } from "./PostTableSection"
import { PostPagination } from "./PostPagination"

interface PostListWithFiltersProps {
  onViewDetail: (post: PostWithAuthor) => void
  onEdit: (post: PostWithAuthor) => void
  onDelete: (id: number) => void
  onUserClick: (userId: number) => void
  localPosts?: PostWithAuthor[]
}

export const PostListWithFilters = ({
  onViewDetail,
  onEdit,
  onDelete,
  onUserClick,
  localPosts = [],
}: PostListWithFiltersProps) => {
  const { posts, total, loading, handleSearchPosts, handleTagFilter } = usePostListWithFilters({
    localPosts,
  })

  return (
    <div className="flex flex-col gap-4">
      <PostControls onSearch={handleSearchPosts} />
      <PostTableSection
        posts={posts}
        loading={loading}
        onTagClick={handleTagFilter}
        onViewDetail={onViewDetail}
        onEdit={onEdit}
        onDelete={onDelete}
        onUserClick={onUserClick}
      />
      <PostPagination total={total} />
    </div>
  )
}
