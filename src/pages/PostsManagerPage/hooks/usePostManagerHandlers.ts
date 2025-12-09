import { useState } from "react"
import { PostWithAuthor } from "../../../entity/post"
import { usePostDelete, usePostDetail } from "../../../features/post"
import { useCommentManagement } from "../../../features/comment"
import { useUserView } from "../../../features/user-view"
import { deleteComment, Comment } from "../../../entity/comment"
import { fetchUser } from "../../../entity/user"

/**
 * PostsManagerPage에서 사용하는 이벤트 핸들러들을 관리하는 훅
 */
export const usePostManagerHandlers = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [localPosts, setLocalPosts] = useState<PostWithAuthor[]>([])
  const [updatedPost, setUpdatedPost] = useState<PostWithAuthor | null>(null)
  const [deletedPostId, setDeletedPostId] = useState<number | null>(null)

  // Features hooks
  const { handleDeletePost } = usePostDelete()
  const {
    selectedPost,
    comments,
    openPostDetail,
    loadComments,
    addCommentToPost,
    updateCommentInPost,
    removeCommentFromPost,
  } = usePostDetail()
  const { handleLikeComment } = useCommentManagement()
  const { selectedUser, openUserModal: openUserModalHook } = useUserView()

  // 게시물 삭제 핸들러 (리스트 재렌더링 없이 로컬 상태만 업데이트)
  const handleDelete = async (id: number) => {
    try {
      await handleDeletePost(id)
      // 로컬 posts에서도 삭제된 게시물 제거
      setLocalPosts((prev) => prev.filter((post) => post.id !== id))
      // 삭제된 게시물 ID를 상태로 설정 (PostListWithFilters에서 리스트에서 제거용)
      setDeletedPostId(id)
      // refreshTrigger는 증가시키지 않음 (전체 리스트 재렌더링 방지)
    } catch (error: unknown) {
      console.error("게시물 삭제 오류:", error)
      alert("게시물 삭제에 실패했습니다.")
      throw error
    }
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

  // 댓글 삭제 핸들러 (리스트 재렌더링 없이 로컬 상태만 업데이트)
  const handleDeleteComment = async (id: number, postId: number) => {
    try {
      console.log("댓글 삭제 시도:", id)
      await deleteComment(id)
      console.log("댓글 삭제 성공")
      // 로컬 상태에서만 댓글 제거 (전체 리스트 재렌더링 방지)
      removeCommentFromPost(postId, id)
    } catch (error: unknown) {
      console.error("댓글 삭제 오류:", error)
      alert("댓글 삭제에 실패했습니다. 콘솔을 확인하세요.")
    }
  }

  // 댓글 좋아요 핸들러 (리스트 재렌더링 없이 로컬 상태만 업데이트)
  const handleLike = async (id: number, postId: number) => {
    const currentComment = comments[postId]?.find((c) => c.id === id)
    if (!currentComment) return
    try {
      const updatedComment = await handleLikeComment(id, currentComment.likes)
      // 로컬 상태에서만 댓글 업데이트 (전체 리스트 재렌더링 방지)
      if (updatedComment) {
        updateCommentInPost(postId, updatedComment)
      }
    } catch (error: unknown) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 댓글 생성 성공 핸들러 (리스트 재렌더링 없이 로컬 상태만 업데이트)
  const handleCommentCreateSuccess = (comment: Comment, postId: number) => {
    // 로컬 상태에만 댓글 추가 (전체 리스트 재렌더링 방지)
    addCommentToPost(postId, comment)
  }

  // 댓글 수정 성공 핸들러 (리스트 재렌더링 없이 로컬 상태만 업데이트)
  const handleCommentEditSuccess = (updatedComment: Comment, postId: number) => {
    // 로컬 상태에서만 댓글 업데이트 (전체 리스트 재렌더링 방지)
    updateCommentInPost(postId, updatedComment)
  }

  // 게시물 생성 성공 핸들러
  const handlePostCreateSuccess = (post: PostWithAuthor) => {
    // 추가된 게시물을 로컬 상태에 저장 (검색 시 포함되도록)
    setLocalPosts((prev) => [...prev, post])
    setRefreshTrigger((prev) => prev + 1)
  }

  // 게시물 수정 성공 핸들러 (리스트 재렌더링 없이 로컬 상태만 업데이트)
  const handlePostEditSuccess = (updated: PostWithAuthor) => {
    // 로컬 posts 업데이트 (검색 시 포함되도록)
    setLocalPosts((prev) => prev.map((post) => (post.id === updated.id ? updated : post)))
    // 수정된 게시물을 상태로 설정 (PostListWithFilters에서 리스트 업데이트용)
    setUpdatedPost(updated)
    // refreshTrigger는 증가시키지 않음 (전체 리스트 재렌더링 방지)
  }

  return {
    refreshTrigger,
    localPosts,
    updatedPost,
    deletedPostId,
    selectedPost,
    comments,
    selectedUser,
    handleDelete,
    handleOpenPostDetail,
    handleDeleteComment,
    handleLike,
    handleUserClick,
    handlePostCreateSuccess,
    handlePostEditSuccess,
    handleCommentCreateSuccess,
    handleCommentEditSuccess,
  }
}

