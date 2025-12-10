import { useSetAtom } from "jotai"
import { PostWithAuthor } from "../../../entity/post"
import {
  selectedPostAtom,
  selectedPostForEditAtom,
  showEditDialogAtom,
  showUserModalAtom,
  selectedUserAtom,
} from "../../../app/store"
import { usePostManagerHandlers } from "../model/usePostManagerHandlers"
import { useDialogManager } from "../model/useDialogManager"
import { fetchUser } from "../../../entity/user"
import { PostButtons } from "../../../entity/post/ui/PostButtons"

interface PostTableRowActionsProps {
  post: PostWithAuthor
  onUserClick?: () => void
}

export const PostTableRowActions = ({ post, onUserClick }: PostTableRowActionsProps) => {
  const setSelectedPost = useSetAtom(selectedPostAtom)
  const setSelectedPostForEdit = useSetAtom(selectedPostForEditAtom)
  const setShowEditDialog = useSetAtom(showEditDialogAtom)
  const { handleDelete } = usePostManagerHandlers()
  const { openPostDetailDialog } = useDialogManager()

  // 게시물 상세 보기 핸들러
  const handleViewDetail = async () => {
    setSelectedPost(post)
    openPostDetailDialog()
  }

  // 게시물 수정 핸들러
  const handleEdit = () => {
    setSelectedPostForEdit(post)
    setShowEditDialog(true)
  }

  // 게시물 삭제 핸들러
  const handleDeleteClick = () => {
    handleDelete(post.id)
  }

  return (
    <PostButtons onViewDetail={handleViewDetail} onEdit={handleEdit} onDelete={handleDeleteClick} />
  )
}

