import { usePostListWithFilters } from "../model/usePostListWithFilters"
import { PostControls } from "./PostControls"
import { PostTableSection } from "./PostTableSection"
import { PostPagination } from "./PostPagination"

export const PostListWithFilters = () => {
  const { posts, total, loading, error, refetch } = usePostListWithFilters()

  return (
    <div className="flex flex-col gap-4">
      <PostControls />
      <PostTableSection posts={posts} loading={loading} error={error} onRetry={refetch} />
      <PostPagination total={total} />
    </div>
  )
}
