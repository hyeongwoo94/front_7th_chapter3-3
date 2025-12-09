import { useEffect, useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { Comment } from "../../../entity/comment"
import { useUpdateCommentMutation } from "../model/useCommentMutations"

interface CommentEditFormProps {
  comment: Comment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (updatedComment: Comment) => void
}

export const CommentEditForm = ({ comment, open, onOpenChange, onSuccess }: CommentEditFormProps) => {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const updateCommentMutation = useUpdateCommentMutation()

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

    try {
      const data = await updateCommentMutation.mutateAsync({
        id: selectedComment.id,
        body: selectedComment.body,
      })
      onOpenChange(false)
      onSuccess?.(data)
    } catch (error: unknown) {
      console.error("댓글 업데이트 오류:", error)
      alert("댓글 수정에 실패했습니다. 콘솔을 확인하세요.")
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
          <Button onClick={handleSubmit} disabled={updateCommentMutation.isPending}>
            {updateCommentMutation.isPending ? "수정 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

