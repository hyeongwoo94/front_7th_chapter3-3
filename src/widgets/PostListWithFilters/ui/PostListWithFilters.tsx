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
  refreshTrigger?: number
  localPosts?: PostWithAuthor[]
  updatedPost?: PostWithAuthor | null
  deletedPostId?: number | null
}

export const PostListWithFilters = ({
  onViewDetail,
  onEdit,
  onDelete,
  onUserClick,
  refreshTrigger,
  localPosts = [],
  updatedPost,
  deletedPostId,
}: PostListWithFiltersProps) => {
  const { posts, total, loading, handleSearchPosts, handleTagFilter, updatePostInList, removePostFromList } =
    usePostListWithFilters({
      refreshTrigger,
      localPosts,
    })

  // 수정된 게시물을 추적하기 위한 ref
  const previousUpdateRef = useRef<PostWithAuthor | null>(null)
  // 삭제된 게시물 ID를 추적하기 위한 ref
  const previousDeleteIdRef = useRef<number | null>(null)

  // updatedPost가 변경되면 리스트의 게시물을 업데이트
  useEffect(() => {
    if (updatedPost && updatedPost !== previousUpdateRef.current) {
      updatePostInList(updatedPost)
      previousUpdateRef.current = updatedPost
    }
  }, [updatedPost, updatePostInList])

  // deletedPostId가 변경되면 리스트에서 게시물 제거
  useEffect(() => {
    if (deletedPostId !== null && deletedPostId !== previousDeleteIdRef.current) {
      removePostFromList(deletedPostId)
      previousDeleteIdRef.current = deletedPostId
    }
  }, [deletedPostId, removePostFromList])

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
