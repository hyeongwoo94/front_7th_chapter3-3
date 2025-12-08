import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { useCommentCreate } from "../model/useCommentCreate"

interface CommentCreateFormProps {
  postId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const CommentCreateForm = ({ postId, open, onOpenChange, onSuccess }: CommentCreateFormProps) => {
  const { newComment, setNewComment, handleAddComment, loading } = useCommentCreate()

  const handleSubmit = async () => {
    await handleAddComment(() => {
      onOpenChange(false)
      onSuccess?.()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value, postId })}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

