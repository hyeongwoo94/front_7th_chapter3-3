import { useAtom, useAtomValue } from "jotai"
import { Plus } from "lucide-react"
import { Button } from "../../../shared/ui"
import { CommentItem } from "./CommentItem"
import {
  searchQueryAtom,
  selectedPostAtom,
  currentPostIdAtom,
  showAddCommentDialogAtom,
  showPostDetailDialogAtom,
} from "../../../app/store"
import { useCommentsQuery } from "../../../features/comment/model/useCommentQueries"

export const CommentList = () => {
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
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={handleAddComment}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} searchQuery={searchQuery} />
        ))}
      </div>
    </div>
  )
}

