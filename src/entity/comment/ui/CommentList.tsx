import { Comment } from "../model/types"

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
          <button onClick={onAddComment} className="text-xs">
            댓글 추가
          </button>
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
