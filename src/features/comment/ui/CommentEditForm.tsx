import { useEffect, useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { Comment } from "../../../entity/comment"
import { updateComment } from "../../../entity/comment"

interface CommentEditFormProps {
  comment: Comment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const CommentEditForm = ({ comment, open, onOpenChange, onSuccess }: CommentEditFormProps) => {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [loading, setLoading] = useState(false)

  // comment가 변경되면 selectedComment 업데이트
  useEffect(() => {
    if (comment) {
      setSelectedComment(comment)
    } else {
      setSelectedComment(null)
    }
  }, [comment])

  // 다이얼로그가 열릴 때마다 comment로 초기화
  useEffect(() => {
    if (open && comment) {
      setSelectedComment(comment)
    }
  }, [open, comment])

  const handleSubmit = async () => {
    if (!selectedComment || !selectedComment.body?.trim()) {
      console.error("댓글 수정 오류: 내용이 필요합니다")
      return
    }

    setLoading(true)
    try {
      console.log("댓글 수정 시도:", selectedComment.id, { body: selectedComment.body })
      const data = await updateComment(selectedComment.id, { body: selectedComment.body })
      console.log("댓글 수정 성공:", data)
      onOpenChange(false)
      onSuccess?.()
    } catch (error: unknown) {
      console.error("댓글 업데이트 오류:", error)
      alert("댓글 수정에 실패했습니다. 콘솔을 확인하세요.")
    } finally {
      setLoading(false)
    }
  }

  if (!open || !selectedComment) return null

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
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "수정 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

