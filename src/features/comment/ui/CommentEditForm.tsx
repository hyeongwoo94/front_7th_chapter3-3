import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { Comment } from "../../../entity/comment"
import { useCommentManagement } from "../model/useCommentManagement"

interface CommentEditFormProps {
  comment: Comment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const CommentEditForm = ({ comment, open, onOpenChange, onSuccess }: CommentEditFormProps) => {
  const { selectedComment, setSelectedComment, handleUpdateComment, editLoading } = useCommentManagement()

  // comment가 변경되면 selectedComment 업데이트
  if (comment && selectedComment?.id !== comment.id) {
    setSelectedComment(comment)
  }

  const handleSubmit = async () => {
    await handleUpdateComment(() => {
      onOpenChange(false)
      onSuccess?.()
    })
  }

  if (!selectedComment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment.body || ""}
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={handleSubmit} disabled={editLoading}>
            {editLoading ? "수정 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

