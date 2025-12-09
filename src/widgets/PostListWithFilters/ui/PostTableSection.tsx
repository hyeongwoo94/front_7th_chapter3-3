import { PostWithAuthor } from "../../../entity/post"
import { PostTableRow } from "../../../entity/post/ui"
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
  onTagClick: (tag: string) => void
  onViewDetail: (post: PostWithAuthor) => void
  onEdit: (post: PostWithAuthor) => void
  onDelete: (id: number) => void
  onUserClick: (userId: number) => void
}

export const PostTableSection = ({
  posts,
  loading,
  onTagClick,
  onViewDetail,
  onEdit,
  onDelete,
  onUserClick,
}: PostTableSectionProps) => {
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
          <PostTableRow
            key={post.id}
            post={post}
            onTagClick={onTagClick}
            onViewDetail={() => onViewDetail(post)}
            onEdit={() => onEdit(post)}
            onDelete={() => onDelete(post.id)}
            onUserClick={() => onUserClick(post.author?.id || 0)}
          />
        ))}
      </TableBody>
    </Table>
  )
}

