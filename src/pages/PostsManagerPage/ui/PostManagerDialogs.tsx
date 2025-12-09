import { PostCreateForm, PostEditForm, PostDetailDialog } from "../../../features/post"
import { CommentCreateForm, CommentEditForm } from "../../../features/comment"
import { UserViewModal } from "../../../features/user-view"

export const PostManagerDialogs = () => {
  // 모든 다이얼로그 컴포넌트가 Jotai atoms를 직접 사용하므로 props 전달 불필요
  return (
    <>
      <PostCreateForm />
      <PostEditForm />
      <PostDetailDialog />
      <CommentCreateForm />
      <CommentEditForm />
      <UserViewModal />
    </>
  )
}

