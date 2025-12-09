import { useAtom, useAtomValue } from "jotai"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib/utils"
import { CommentList } from "../../../entity/comment/ui"
import { Comment } from "../../../entity/comment"
import {
  searchQueryAtom,
  showPostDetailDialogAtom,
  selectedPostAtom,
  showAddCommentDialogAtom,
  showEditCommentDialogAtom,
  selectedCommentAtom,
  currentPostIdAtom,
} from "../../../app/store"
import { useCommentsQuery } from "../../../features/comment/model/useCommentQueries"
import { usePostManagerHandlers } from "../../../pages/PostsManagerPage/hooks/usePostManagerHandlers"
import { useLikeCommentMutation } from "../../../features/comment/model/useCommentMutations"

export const PostDetailDialog = () => {
  const [open, setOpen] = useAtom(showPostDetailDialogAtom)
  const [selectedPost] = useAtom(selectedPostAtom)
  const [currentPostId, setCurrentPostId] = useAtom(currentPostIdAtom)
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  const [, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)
  const searchQuery = useAtomValue(searchQueryAtom)

  // 댓글 쿼리
  const commentsQuery = useCommentsQuery({
    postId: selectedPost?.id || 0,
    enabled: !!selectedPost && open,
  })
  const comments = selectedPost ? commentsQuery.data || [] : []

  // 핸들러
  const { handleDeleteComment } = usePostManagerHandlers()
  const likeCommentMutation = useLikeCommentMutation()

  // 댓글 좋아요 핸들러
  const handleLike = async (id: number) => {
    if (!selectedPost) return
    const currentComment = comments.find((c) => c.id === id)
    if (!currentComment) return
    try {
      await likeCommentMutation.mutateAsync({
        id,
        currentLikes: currentComment.likes,
        postId: selectedPost.id,
      })
    } catch (error: unknown) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 댓글 추가 핸들러
  const handleAddComment = () => {
    if (selectedPost) {
      setCurrentPostId(selectedPost.id)
      setShowAddCommentDialog(true)
    }
  }

  // 댓글 수정 핸들러
  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  // 댓글 삭제 핸들러
  const handleDelete = (id: number) => {
    if (selectedPost) {
      handleDeleteComment(id, selectedPost.id)
    }
  }

  if (!selectedPost) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost.body || "", searchQuery)}</p>
          <CommentList
            comments={comments}
            searchQuery={searchQuery}
            onAddComment={handleAddComment}
            onLike={handleLike}
            onEdit={handleEditComment}
            onDelete={handleDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

