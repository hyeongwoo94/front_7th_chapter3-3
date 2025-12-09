import { useAtom, useSetAtom } from "jotai"
import { Edit2, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { Comment } from "../model/types"
import { highlightText } from "../../../shared/lib/utils"
import {
  selectedPostAtom,
  selectedCommentAtom,
  showEditCommentDialogAtom,
} from "../../../app/store"
import { usePostManagerHandlers } from "../../../pages/PostsManagerPage/hooks/usePostManagerHandlers"
import { useLikeCommentMutation } from "../../../features/comment/model/useCommentMutations"

interface CommentItemProps {
  comment: Comment
  searchQuery?: string
}

export const CommentItem = ({ comment, searchQuery = "" }: CommentItemProps) => {
  const [selectedPost] = useAtom(selectedPostAtom)
  const setSelectedComment = useSetAtom(selectedCommentAtom)
  const setShowEditCommentDialog = useSetAtom(showEditCommentDialogAtom)
  const { handleDeleteComment } = usePostManagerHandlers()
  const likeCommentMutation = useLikeCommentMutation()

  // 댓글 좋아요 핸들러
  const handleLike = async () => {
    if (!selectedPost) return
    try {
      await likeCommentMutation.mutateAsync({
        id: comment.id,
        currentLikes: comment.likes,
        postId: selectedPost.id,
      })
    } catch (error: unknown) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 댓글 수정 핸들러
  const handleEdit = () => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  // 댓글 삭제 핸들러
  const handleDelete = () => {
    if (selectedPost) {
      handleDeleteComment(comment.id, selectedPost.id)
    }
  }

  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={handleLike}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleEdit}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
