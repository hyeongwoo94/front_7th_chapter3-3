import { useState } from "react"
import { useAtom } from "jotai"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { useCreatePostMutation } from "../model/usePostMutations"
import { CreatePostRequest, PostWithAuthor } from "../../../entity/post"
import { showAddDialogAtom } from "../../../app/store"
import { usePostManagerHandlers } from "../../../pages/PostsManagerPage/hooks/usePostManagerHandlers"

export const PostCreateForm = () => {
  const [open, setOpen] = useAtom(showAddDialogAtom)
  const [newPost, setNewPost] = useState<CreatePostRequest>({ title: "", body: "", userId: 1 })
  const createPostMutation = useCreatePostMutation()
  const { handlePostCreateSuccess } = usePostManagerHandlers()

  const handleSubmit = async () => {
    try {
      const createdPost = await createPostMutation.mutateAsync(newPost)
      setNewPost({ title: "", body: "", userId: 1 })
      setOpen(false)
      // Post를 PostWithAuthor로 변환 (author 정보는 나중에 가져올 수 있음)
      handlePostCreateSuccess(createdPost as PostWithAuthor)
    } catch (error) {
      console.error("게시물 생성 실패:", error)
      alert("게시물 생성에 실패했습니다.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
