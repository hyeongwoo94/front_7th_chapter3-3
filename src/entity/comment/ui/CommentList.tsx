import { Plus } from "lucide-react"
import { Button } from "../../../shared/ui"
import { Comment } from "../../comment/model/types"
import { CommentItem } from "./CommentItem"

interface CommentListProps {
  comments: Comment[]
  searchQuery?: string
  onAddComment: () => void
  onLike: (id: number) => void
  onEdit: (comment: Comment) => void
  onDelete: (id: number) => void
}

export const CommentList = ({
  comments,
  searchQuery = "",
  onAddComment,
  onLike,
  onEdit,
  onDelete,
}: CommentListProps) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={onAddComment}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            searchQuery={searchQuery}
            onLike={() => onLike(comment.id)}
            onEdit={() => onEdit(comment)}
            onDelete={() => onDelete(comment.id)}
          />
        ))}
      </div>
    </div>
  )
}

