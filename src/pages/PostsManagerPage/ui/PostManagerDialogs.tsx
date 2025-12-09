import { PostWithAuthor } from "../../../entity/post"
import { Comment } from "../../../entity/comment"
import { User } from "../../../entity/user"
import { PostCreateForm, PostEditForm, PostDetailDialog } from "../../../features/post"
import { CommentCreateForm, CommentEditForm } from "../../../features/comment"
import { UserViewModal } from "../../../features/user-view"

interface PostManagerDialogsProps {
  // 다이얼로그 표시 상태
  showAddDialog: boolean
  setShowAddDialog: (open: boolean) => void
  showEditDialog: boolean
  setShowEditDialog: (open: boolean) => void
  showAddCommentDialog: boolean
  setShowAddCommentDialog: (open: boolean) => void
  showEditCommentDialog: boolean
  setShowEditCommentDialog: (open: boolean) => void
  showPostDetailDialog: boolean
  setShowPostDetailDialog: (open: boolean) => void
  showUserModal: boolean
  setShowUserModal: (open: boolean) => void
  // 선택된 항목
  selectedPostForEdit: PostWithAuthor | null
  selectedComment: Comment | null
  currentPostId: number | null
  // 핸들러
  onPostCreateSuccess: (post: PostWithAuthor) => void
  onPostEditSuccess: () => void
  onDeleteComment: (id: number, postId: number) => void
  onLikeComment: (id: number, postId: number) => void
  onAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
  selectedPost: PostWithAuthor | null
  comments: Record<number, Comment[]>
  loadComments: (postId: number, force?: boolean) => Promise<void>
  selectedUser: User | null
}

export const PostManagerDialogs = ({
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
  selectedPostForEdit,
  selectedComment,
  currentPostId,
  onPostCreateSuccess,
  onPostEditSuccess,
  onDeleteComment,
  onLikeComment,
  onAddComment,
  onEditComment,
  selectedPost,
  comments,
  loadComments,
  selectedUser,
}: PostManagerDialogsProps) => {
  return (
    <>
      <PostCreateForm
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={onPostCreateSuccess}
      />

      <PostEditForm
        post={selectedPostForEdit}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onPostEditSuccess}
      />

      <PostDetailDialog
        post={selectedPost}
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        comments={selectedPost ? comments[selectedPost.id] || [] : []}
        onAddComment={() => {
          if (selectedPost) {
            onAddComment(selectedPost.id)
          }
        }}
        onLikeComment={(id) => {
          if (selectedPost) {
            onLikeComment(id, selectedPost.id)
          }
        }}
        onEditComment={onEditComment}
        onDeleteComment={(id) => {
          if (selectedPost) {
            onDeleteComment(id, selectedPost.id)
          }
        }}
      />

      <CommentCreateForm
        postId={currentPostId || 0}
        open={showAddCommentDialog && !!currentPostId}
        onOpenChange={setShowAddCommentDialog}
        onSuccess={async () => {
          if (selectedPost) {
            await loadComments(selectedPost.id, true)
          }
        }}
      />

      <CommentEditForm
        comment={selectedComment}
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        onSuccess={async () => {
          if (selectedPost) {
            await loadComments(selectedPost.id, true)
          }
        }}
      />

      <UserViewModal user={selectedUser} open={showUserModal} onOpenChange={setShowUserModal} />
    </>
  )
}

