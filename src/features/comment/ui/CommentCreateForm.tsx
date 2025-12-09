import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { CreateCommentRequest } from "../../../entity/comment"
import { useCreateCommentMutation } from "../model/useCommentMutations"
import { showAddCommentDialogAtom, currentPostIdAtom, selectedPostAtom } from "../../../app/store"
import { usePostManagerHandlers } from "../../../pages/PostsManagerPage/hooks/usePostManagerHandlers"

export const CommentCreateForm = () => {
  const [open, setOpen] = useAtom(showAddCommentDialogAtom)
  const [currentPostId] = useAtom(currentPostIdAtom)
  const [selectedPost] = useAtom(selectedPostAtom)
  const [newComment, setNewComment] = useState<CreateCommentRequest>({ body: "", postId: 0, userId: 1 })
  const createCommentMutation = useCreateCommentMutation()
  const { handleCommentCreateSuccess } = usePostManagerHandlers()

  // 다이얼로그가 열릴 때마다 postId로 초기화
  useEffect(() => {
    if (open && currentPostId) {
      setNewComment({ body: "", postId: currentPostId, userId: 1 })
    }
  }, [open, currentPostId])

  const handleSubmit = async () => {
    if (!newComment.body.trim() || !currentPostId) {
      console.error("댓글 추가 오류: 내용과 postId가 필요합니다")
      return
    }

    try {
      const commentData = { body: newComment.body, postId: currentPostId, userId: newComment.userId }
      const data = await createCommentMutation.mutateAsync(commentData)
      setNewComment({ body: "", postId: currentPostId, userId: 1 })
      setOpen(false)
      if (selectedPost) {
        handleCommentCreateSuccess(data, selectedPost.id)
      }
    } catch (error: unknown) {
      console.error("댓글 추가 오류:", error)
      alert("댓글 추가에 실패했습니다. 콘솔을 확인하세요.")
    }
  }

  if (!open || !currentPostId) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button onClick={handleSubmit} disabled={createCommentMutation.isPending}>
            {createCommentMutation.isPending ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

