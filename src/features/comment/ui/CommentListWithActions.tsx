import { useAtom, useAtomValue } from "jotai"
import { CommentList } from "../../../entity/comment/ui"
import { CommentItemWithActions } from "./CommentItemWithActions"
import { ErrorMessage, Skeleton } from "../../../shared/ui"
import {
  searchQueryAtom,
  selectedPostAtom,
  currentPostIdAtom,
  showAddCommentDialogAtom,
  showPostDetailDialogAtom,
} from "../../../app/store"
import { useCommentsQuery } from "../model/useCommentQueries"

export const CommentListWithActions = () => {
  const searchQuery = useAtomValue(searchQueryAtom)
  const [selectedPost] = useAtom(selectedPostAtom)
  const [showPostDetailDialog] = useAtom(showPostDetailDialogAtom)
  const [currentPostId, setCurrentPostId] = useAtom(currentPostIdAtom)
  const [, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)

  // 댓글 쿼리
  const commentsQuery = useCommentsQuery({
    postId: selectedPost?.id || 0,
    enabled: !!selectedPost && showPostDetailDialog,
  })
  const comments = selectedPost ? commentsQuery.data || [] : []

  // 댓글 추가 핸들러
  const handleAddComment = () => {
    if (selectedPost) {
      setCurrentPostId(selectedPost.id)
      setShowAddCommentDialog(true)
    }
  }

  // 로딩 상태 처리
  if (commentsQuery.isLoading || commentsQuery.isFetching) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="h-10 w-10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  // 에러 상태 처리
  if (commentsQuery.isError && commentsQuery.error) {
    return (
      <ErrorMessage
        error={commentsQuery.error}
        title="댓글을 불러오는 중 오류가 발생했습니다"
        onRetry={() => commentsQuery.refetch()}
      />
    )
  }

  return (
    <CommentList
      comments={comments}
      searchQuery={searchQuery}
      onAddComment={handleAddComment}
      renderCommentItem={(comment) => (
        <CommentItemWithActions key={comment.id} comment={comment} searchQuery={searchQuery} />
      )}
    />
  )
}

