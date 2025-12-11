import { PostWithAuthor } from "../../../entity/post"
import { PostTableRowWithActions } from "../../../features/post/ui/PostTableRowWithActions"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  ErrorMessage,
} from "../../../shared/ui"
import { PostTableSkeleton } from "./PostTableSkeleton"

interface PostTableSectionProps {
  posts: PostWithAuthor[]
  loading: boolean
  error?: Error | unknown
  onRetry?: () => void
}

export const PostTableSection = ({ posts, loading, error, onRetry }: PostTableSectionProps) => {
  if (error) {
    return (
      <ErrorMessage
        error={error}
        title="게시물을 불러오는 중 오류가 발생했습니다"
        onRetry={onRetry}
      />
    )
  }

  if (loading) {
    return <PostTableSkeleton />
  }

  return (
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
          <PostTableRowWithActions key={post.id} post={post} />
        ))}
      </TableBody>
    </Table>
  )
}

