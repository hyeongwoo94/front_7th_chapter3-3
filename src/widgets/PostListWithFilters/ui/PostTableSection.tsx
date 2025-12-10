import { PostWithAuthor } from "../../../entity/post"
import { PostTableRowWithActions } from "../../../features/post/ui/PostTableRowWithActions"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/ui"

interface PostTableSectionProps {
  posts: PostWithAuthor[]
  loading: boolean
}

export const PostTableSection = ({ posts, loading }: PostTableSectionProps) => {
  if (loading) {
    return <div className="flex justify-center p-4">로딩 중...</div>
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

