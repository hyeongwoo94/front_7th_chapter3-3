import { useAtom, useAtomValue } from "jotai"
import { CommentList } from "../../../entity/comment/ui"
import { CommentItemWithActions } from "./CommentItemWithActions"
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

