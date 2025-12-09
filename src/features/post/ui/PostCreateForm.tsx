import { useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { useCreatePostMutation } from "../model/usePostMutations"
import { PostWithAuthor } from "../../../entity/post"
import { CreatePostRequest } from "../../../entity/post"

interface PostCreateFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (post: PostWithAuthor) => void
}

export const PostCreateForm = ({ open, onOpenChange, onSuccess }: PostCreateFormProps) => {
  const [newPost, setNewPost] = useState<CreatePostRequest>({ title: "", body: "", userId: 1 })
  const createPostMutation = useCreatePostMutation()

  const handleSubmit = async () => {
    try {
      const createdPost = await createPostMutation.mutateAsync(newPost)
      setNewPost({ title: "", body: "", userId: 1 })
      onOpenChange(false)
      // Post를 PostWithAuthor로 변환 (author 정보는 나중에 가져올 수 있음)
      onSuccess?.(createdPost as PostWithAuthor)
    } catch (error) {
      console.error("게시물 생성 실패:", error)
      alert("게시물 생성에 실패했습니다.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={handleSubmit} disabled={createPostMutation.isPending}>
            {createPostMutation.isPending ? "추가 중..." : "게시물 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
