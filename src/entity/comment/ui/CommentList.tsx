import { Comment } from "../model/types"
import { Button } from "../../../shared/ui"
import { Plus } from "lucide-react"

interface CommentListProps {
  comments: Comment[]
  searchQuery?: string
  onAddComment?: () => void
  renderCommentItem?: (comment: Comment) => React.ReactNode
}

export const CommentList = ({ comments, searchQuery = "", onAddComment, renderCommentItem }: CommentListProps) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        {onAddComment && (
          <Button onClick={onAddComment} className="text-xs px-2 py-2">
            <Plus className="w-4 h-4 mr-2" />
            댓글 추가
          </Button>
        )}
      </div>
      <div className="space-y-1">
        {comments.map((comment) =>
          renderCommentItem ? (
            renderCommentItem(comment)
          ) : (
            <div key={comment.id} className="text-sm border-b pb-1">
              {comment.user.username}: {comment.body}
            </div>
          )
        )}
      </div>
    </div>
  )
}
