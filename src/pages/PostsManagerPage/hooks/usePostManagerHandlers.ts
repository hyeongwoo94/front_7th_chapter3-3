import { useSetAtom, useAtom } from "jotai"
import { PostWithAuthor } from "../../../entity/post"
import { useDeletePostMutation } from "../../../features/post"
import { useDeleteCommentMutation } from "../../../features/comment"
import { Comment } from "../../../entity/comment"
import { fetchUser } from "../../../entity/user"
import {
  selectedPostAtom,
  selectedUserAtom,
  showUserModalAtom,
  localPostsAtom,
} from "../../../app/store"

/**
 * PostsManagerPage에서 사용하는 이벤트 핸들러들을 관리하는 훅
 */
export const usePostManagerHandlers = () => {
  const [localPosts, setLocalPosts] = useAtom(localPostsAtom)
  const setSelectedPost = useSetAtom(selectedPostAtom)
  const setSelectedUser = useSetAtom(selectedUserAtom)
  const setShowUserModal = useSetAtom(showUserModalAtom)

  // Features hooks
  const deletePostMutation = useDeletePostMutation()
  const deleteCommentMutation = useDeleteCommentMutation()

  // 게시물 삭제 핸들러 (TanstackQuery mutation 사용, 낙관적 업데이트 포함)
  const handleDelete = async (id: number) => {
    try {
      await deletePostMutation.mutateAsync(id)
      // 로컬 posts에서도 삭제된 게시물 제거
      setLocalPosts((prev) => prev.filter((post) => post.id !== id))
      // TanstackQuery의 낙관적 업데이트가 자동으로 리스트에서 제거
    } catch (error: unknown) {
      console.error("게시물 삭제 오류:", error)
      alert("게시물 삭제에 실패했습니다.")
      throw error
    }
  }

  // 게시물 상세 보기 핸들러
  const handleOpenPostDetail = async (post: PostWithAuthor) => {
    setSelectedPost(post)
  }

  // 사용자 모달 열기 핸들러
  const handleUserClick = async (userId: number) => {
    try {
      const user = await fetchUser(userId)
      setSelectedUser(user)
      setShowUserModal(true)
    } catch (error: unknown) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  // 댓글 삭제 핸들러 (TanstackQuery mutation 사용)
  const handleDeleteComment = async (id: number, postId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ id, postId })
      // TanstackQuery가 자동으로 쿼리 무효화하여 댓글 목록 업데이트
    } catch (error: unknown) {
      console.error("댓글 삭제 오류:", error)
      alert("댓글 삭제에 실패했습니다. 콘솔을 확인하세요.")
    }
  }


  // 댓글 생성 성공 핸들러 (CommentCreateForm에서 이미 mutation 호출함)
  const handleCommentCreateSuccess = (comment: Comment, postId: number) => {
    // TanstackQuery mutation이 이미 호출되어 자동으로 쿼리 무효화됨
    // 필요시 추가 처리만 수행
  }

  // 댓글 수정 성공 핸들러 (CommentEditForm에서 이미 mutation 호출함)
  const handleCommentEditSuccess = (updatedComment: Comment, postId: number) => {
    // TanstackQuery mutation이 이미 호출되어 자동으로 쿼리 무효화됨
    // 필요시 추가 처리만 수행
  }

  // 게시물 생성 성공 핸들러
  const handlePostCreateSuccess = (post: PostWithAuthor) => {
    // 추가된 게시물을 로컬 상태에 저장 (검색 시 포함되도록)
    setLocalPosts((prev) => [...prev, post])
    // TanstackQuery mutation이 자동으로 쿼리 무효화하여 리스트 업데이트
  }

  // 게시물 수정 성공 핸들러 (TanstackQuery mutation에서 처리)
  const handlePostEditSuccess = (updated: PostWithAuthor) => {
    // 로컬 posts 업데이트 (검색 시 포함되도록)
    setLocalPosts((prev) => prev.map((post) => (post.id === updated.id ? updated : post)))
    // TanstackQuery의 낙관적 업데이트가 자동으로 리스트 업데이트
  }

  return {
    localPosts,
    handleDelete,
    handleOpenPostDetail,
    handleDeleteComment,
    handleUserClick,
    handlePostCreateSuccess,
    handlePostEditSuccess,
    handleCommentCreateSuccess,
    handleCommentEditSuccess,
  }
}

