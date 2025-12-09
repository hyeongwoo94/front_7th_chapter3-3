import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { PostWithAuthor } from "../../../entity/post"
import { useUpdatePostMutation } from "../model/usePostMutations"
import { showEditDialogAtom, selectedPostForEditAtom } from "../../../app/store"
import { usePostManagerHandlers } from "../../../pages/PostsManagerPage/hooks/usePostManagerHandlers"

export const PostEditForm = () => {
  const [open, setOpen] = useAtom(showEditDialogAtom)
  const [selectedPostForEdit] = useAtom(selectedPostForEditAtom)
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | null>(null)
  const updatePostMutation = useUpdatePostMutation()
  const { handlePostEditSuccess } = usePostManagerHandlers()

  // selectedPostForEdit가 변경되면 selectedPost 업데이트
  useEffect(() => {
    if (selectedPostForEdit) {
      setSelectedPost(selectedPostForEdit)
    }
  }, [selectedPostForEdit])

  const handleSubmit = async () => {
    if (!selectedPost) return

    try {
      const updatedPost = await updatePostMutation.mutateAsync({
        id: selectedPost.id,
        post: selectedPost,
      })
      setOpen(false)
      // Post를 PostWithAuthor로 변환 (author 정보는 기존 것 유지)
      const updatedPostWithAuthor: PostWithAuthor = {
        ...updatedPost,
        author: selectedPost.author,
      }
      handlePostEditSuccess(updatedPostWithAuthor)
    } catch (error) {
      console.error("게시물 수정 실패:", error)
      alert("게시물 수정에 실패했습니다.")
    }
  }

  if (!selectedPost) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button onClick={handleSubmit} disabled={updatePostMutation.isPending}>
            {updatePostMutation.isPending ? "수정 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

