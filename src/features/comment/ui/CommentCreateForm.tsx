import { useEffect, useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { addComment, CreateCommentRequest, Comment } from "../../../entity/comment"

interface CommentCreateFormProps {
  postId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (comment: Comment) => void
}

export const CommentCreateForm = ({ postId, open, onOpenChange, onSuccess }: CommentCreateFormProps) => {
  const [newComment, setNewComment] = useState<CreateCommentRequest>({ body: "", postId, userId: 1 })
  const [loading, setLoading] = useState(false)

  // 다이얼로그가 열릴 때마다 postId로 초기화
  useEffect(() => {
    if (open && postId) {
      setNewComment({ body: "", postId, userId: 1 })
    }
  }, [open, postId])

  const handleSubmit = async () => {
    if (!newComment.body.trim() || !postId) {
      console.error("댓글 추가 오류: 내용과 postId가 필요합니다")
      return
    }

    setLoading(true)
    try {
      const commentData = { body: newComment.body, postId, userId: newComment.userId }
      console.log("댓글 추가 시도:", commentData)
      const data = await addComment(commentData)
      console.log("댓글 추가 성공:", data)
      setNewComment({ body: "", postId, userId: 1 })
      onOpenChange(false)
      onSuccess?.(data)
      return data
    } catch (error: unknown) {
      console.error("댓글 추가 오류:", error)
      alert("댓글 추가에 실패했습니다. 콘솔을 확인하세요.")
    } finally {
      setLoading(false)
    }
  }

  if (!open || !postId) return null

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
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

