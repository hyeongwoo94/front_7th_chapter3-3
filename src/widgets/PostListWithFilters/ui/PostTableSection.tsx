import { useSetAtom } from "jotai"
import { PostWithAuthor } from "../../../entity/post"
import { PostTableRow } from "../../../entity/post/ui"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/ui"
import { selectedTagAtom } from "../../../app/store"

interface PostTableSectionProps {
  posts: PostWithAuthor[]
  loading: boolean
}

export const PostTableSection = ({ posts, loading }: PostTableSectionProps) => {
  const setSelectedTag = useSetAtom(selectedTagAtom)

  // 태그 클릭 핸들러
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
  }

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
          <PostTableRow key={post.id} post={post} onTagClick={handleTagClick} />
        ))}
      </TableBody>
    </Table>
  )
}

