import { Card, CardContent } from "../../../shared/ui"
import { PostWithAuthor } from "../../../entity/post"
import { PostListWithFilters } from "../../../widgets/PostListWithFilters"
import { useURLSync } from "../hooks/useURLSync"
import { usePostManagerHandlers } from "../hooks/usePostManagerHandlers"
import { useDialogManager } from "../hooks/useDialogManager"
import { PostManagerHeader } from "./PostManagerHeader"
import { PostManagerDialogs } from "./PostManagerDialogs"

const PostsManager = () => {
  // URL 동기화
  useURLSync()

  // 이벤트 핸들러 및 상태 관리
  const {
    localPosts,
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
  } = usePostManagerHandlers()

  // 다이얼로그 관리
  const {
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
    openAddDialog,
    openEditDialog,
    openPostDetailDialog,
    openAddCommentDialog,
    openEditCommentDialog,
  } = useDialogManager()

  // 게시물 상세 보기 핸들러 (다이얼로그도 함께 열기)
  const handleViewDetail = async (post: PostWithAuthor) => {
    await handleOpenPostDetail(post)
    openPostDetailDialog()
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostManagerHeader onAddClick={openAddDialog} />
      <CardContent>
        <PostListWithFilters
          onViewDetail={handleViewDetail}
          onEdit={openEditDialog}
          onDelete={handleDelete}
          onUserClick={handleUserClick}
          localPosts={localPosts}
        />
      </CardContent>

      <PostManagerDialogs
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        showAddCommentDialog={showAddCommentDialog}
        setShowAddCommentDialog={setShowAddCommentDialog}
        showEditCommentDialog={showEditCommentDialog}
        setShowEditCommentDialog={setShowEditCommentDialog}
        showPostDetailDialog={showPostDetailDialog}
        setShowPostDetailDialog={setShowPostDetailDialog}
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        selectedPostForEdit={selectedPostForEdit}
        selectedComment={selectedComment}
        currentPostId={currentPostId}
        onPostCreateSuccess={handlePostCreateSuccess}
        onPostEditSuccess={handlePostEditSuccess}
        onDeleteComment={handleDeleteComment}
        onLikeComment={handleLike}
        onAddComment={openAddCommentDialog}
        onEditComment={openEditCommentDialog}
        onCommentCreateSuccess={handleCommentCreateSuccess}
        onCommentEditSuccess={handleCommentEditSuccess}
        selectedPost={selectedPost}
        comments={comments}
        selectedUser={selectedUser}
      />
    </Card>
  )
}

export default PostsManager

