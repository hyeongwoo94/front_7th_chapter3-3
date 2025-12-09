import { useAtom } from "jotai"
import {
  showAddDialogAtom,
  showEditDialogAtom,
  showAddCommentDialogAtom,
  showEditCommentDialogAtom,
  showPostDetailDialogAtom,
  showUserModalAtom,
  selectedPostForEditAtom,
  selectedCommentAtom,
  currentPostIdAtom,
} from "../../../app/store"
import { PostWithAuthor } from "../../../entity/post"
import { Comment } from "../../../entity/comment"

/**
 * PostsManagerPage의 모든 다이얼로그 상태를 관리하는 훅
 */
export const useDialogManager = () => {
  // 다이얼로그 표시 상태
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom)
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom)

  // 선택된 항목 상태
  const [selectedPostForEdit, setSelectedPostForEdit] = useAtom(selectedPostForEditAtom)
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  const [currentPostId, setCurrentPostId] = useAtom(currentPostIdAtom)

  // 게시물 추가 다이얼로그 열기
  const openAddDialog = () => {
    setShowAddDialog(true)
  }

  // 게시물 수정 다이얼로그 열기
  const openEditDialog = (post: PostWithAuthor) => {
    setSelectedPostForEdit(post)
    setShowEditDialog(true)
  }

  // 게시물 상세 다이얼로그 열기 (openPostDetail 호출 후 사용)
  const openPostDetailDialog = () => {
    setShowPostDetailDialog(true)
  }

  // 댓글 추가 다이얼로그 열기
  const openAddCommentDialog = (postId: number) => {
    setCurrentPostId(postId)
    setShowAddCommentDialog(true)
  }

  // 댓글 수정 다이얼로그 열기
  const openEditCommentDialog = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = () => {
    setShowUserModal(true)
  }

  return {
    // 다이얼로그 표시 상태
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    showAddCommentDialog,
    setShowAddCommentDialog,
    showEditCommentDialog,
    setShowEditCommentDialog,
    showPostDetailDialog,
    setShowPostDetailDialog,
    showUserModal,
    setShowUserModal,
    // 선택된 항목
    selectedPostForEdit,
    selectedComment,
    currentPostId,
    // 편의 함수들
    openAddDialog,
    openEditDialog,
    openPostDetailDialog,
    openAddCommentDialog,
    openEditCommentDialog,
    openUserModal,
  }
}

