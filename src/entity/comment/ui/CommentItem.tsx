import { Comment } from "../model/types"
import { highlightText } from "../../../shared/lib/utils"

interface CommentItemProps {
  comment: Comment
  searchQuery?: string
  onLike?: () => void
  onEdit?: () => void
  onDelete?: () => void
  renderActions?: (comment: Comment) => React.ReactNode
}

export const CommentItem = ({ comment, searchQuery = "", onLike, onEdit, onDelete, renderActions }: CommentItemProps) => {
  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>
      {renderActions ? (
        renderActions(comment)
      ) : (
        <div className="flex items-center space-x-1">
          {onLike && (
            <button onClick={onLike} className="text-xs">
              좋아요 {comment.likes}
            </button>
          )}
          {onEdit && (
            <button onClick={onEdit} className="text-xs">
              수정
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="text-xs">
              삭제
            </button>
          )}
        </div>
      )}
    </div>
  )
}
