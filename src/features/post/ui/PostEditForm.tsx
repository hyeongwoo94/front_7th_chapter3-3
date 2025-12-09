import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { PostWithAuthor } from "../../../entity/post"
import { usePostEdit } from "../model/usePostEdit"

interface PostEditFormProps {
  post: PostWithAuthor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (updatedPost: PostWithAuthor) => void
}

export const PostEditForm = ({ post, open, onOpenChange, onSuccess }: PostEditFormProps) => {
  const { selectedPost, setSelectedPost, handleUpdatePost, loading } = usePostEdit()

  // post가 변경되면 selectedPost 업데이트
  if (post && selectedPost?.id !== post.id) {
    setSelectedPost(post)
  }

  const handleSubmit = async () => {
    try {
      await handleUpdatePost((updatedPost) => {
        onOpenChange(false)
        onSuccess?.(updatedPost)
      })
    } catch (error) {
      console.error("게시물 수정 실패:", error)
      alert("게시물 수정에 실패했습니다.")
    }
  }

  if (!selectedPost) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost.title || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost.body || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "수정 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

