import { useState } from "react"
import { PostWithAuthor } from "../../../entity/post"
import { usePostDelete, usePostDetail } from "../../../features/post"
import { useCommentManagement } from "../../../features/comment"
import { useUserView } from "../../../features/user-view"
import { deleteComment } from "../../../entity/comment"
import { fetchUser } from "../../../entity/user"

/**
 * PostsManagerPage에서 사용하는 이벤트 핸들러들을 관리하는 훅
 */
export const usePostManagerHandlers = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [localPosts, setLocalPosts] = useState<PostWithAuthor[]>([])

  // Features hooks
  const { handleDeletePost } = usePostDelete()
  const { selectedPost, comments, openPostDetail, loadComments } = usePostDetail()
  const { handleLikeComment } = useCommentManagement()
  const { selectedUser, openUserModal: openUserModalHook } = useUserView()

  // 게시물 삭제 핸들러
  const handleDelete = async (id: number) => {
    await handleDeletePost(id)
    setRefreshTrigger((prev) => prev + 1)
  }

  // 게시물 상세 보기 핸들러
  const handleOpenPostDetail = async (post: PostWithAuthor) => {
    await openPostDetail(post)
  }

  // 사용자 모달 열기 핸들러
  const handleUserClick = async (userId: number) => {
    try {
      const user = await fetchUser(userId)
      await openUserModalHook(user)
    } catch (error: unknown) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (id: number, postId: number) => {
    try {
      console.log("댓글 삭제 시도:", id)
      await deleteComment(id)
      console.log("댓글 삭제 성공")
      // comments 상태 업데이트는 usePostDetail에서 관리 (강제로 다시 불러오기)
      await loadComments(postId, true)
    } catch (error: unknown) {
      console.error("댓글 삭제 오류:", error)
      alert("댓글 삭제에 실패했습니다. 콘솔을 확인하세요.")
    }
  }

  // 댓글 좋아요 핸들러
  const handleLike = async (id: number, postId: number) => {
    const currentComment = comments[postId]?.find((c) => c.id === id)
    if (!currentComment) return
    await handleLikeComment(id, currentComment.likes, async () => {
      await loadComments(postId)
    })
  }

  // 게시물 생성 성공 핸들러
  const handlePostCreateSuccess = (post: PostWithAuthor) => {
    // 추가된 게시물을 로컬 상태에 저장 (검색 시 포함되도록)
    setLocalPosts((prev) => [...prev, post])
    setRefreshTrigger((prev) => prev + 1)
  }

  // 게시물 수정 성공 핸들러
  const handlePostEditSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return {
    refreshTrigger,
    localPosts,
    selectedPost,
    comments,
    selectedUser,
    loadComments,
    handleDelete,
    handleOpenPostDetail,
    handleDeleteComment,
    handleLike,
    handleUserClick,
    handlePostCreateSuccess,
    handlePostEditSuccess,
  }
}

