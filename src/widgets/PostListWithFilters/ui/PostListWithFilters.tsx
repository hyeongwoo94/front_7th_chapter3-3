import { usePostListWithFilters } from "../model/usePostListWithFilters"
import { PostControls } from "./PostControls"
import { PostTableSection } from "./PostTableSection"
import { PostPagination } from "./PostPagination"

export const PostListWithFilters = () => {
  const { posts, total, loading, handleSearchPosts } = usePostListWithFilters()

  return (
    <div className="flex flex-col gap-4">
      <PostControls onSearch={handleSearchPosts} />
      <PostTableSection posts={posts} loading={loading} />
      <PostPagination total={total} />
    </div>
  )
}
