import { Edit2, MessageSquare, Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"

interface PostActionsProps {
  onViewDetail: () => void
  onEdit: () => void
  onDelete: () => void
}

export const PostActions = ({ onViewDetail, onEdit, onDelete }: PostActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={onViewDetail}>
        <MessageSquare className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onDelete}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}

