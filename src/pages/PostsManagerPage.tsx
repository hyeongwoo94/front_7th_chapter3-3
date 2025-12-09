import { useEffect, useState, useCallback } from "react"
import { useAtom, useAtomValue } from "jotai"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../shared/ui"
import { PostWithAuthor } from "../entity/post"
import { PostCreateForm, PostEditForm, usePostDelete, PostDetailDialog, usePostDetail } from "../features/post"
import { CommentCreateForm, CommentEditForm, useCommentManagement } from "../features/comment"
import { UserViewModal, useUserView } from "../features/user-view"
import { deleteComment } from "../entity/comment"
import { fetchUser } from "../entity/user"
import { PostListWithFilters } from "../widgets/PostListWithFilters"
import {
  searchQueryAtom,
  selectedTagAtom,
  sortByAtom,
  sortOrderAtom,
  skipAtom,
  limitAtom,
  showAddDialogAtom,
  showEditDialogAtom,
  showAddCommentDialogAtom,
  showEditCommentDialogAtom,
  showPostDetailDialogAtom,
  showUserModalAtom,
  selectedPostForEditAtom,
  selectedCommentAtom,
  currentPostIdAtom,
} from "../app/store"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Jotai atoms - 필터 및 페이지네이션 상태 (PostListWithFilters에서 직접 사용)
  // const [skip, setSkip] = useAtom(skipAtom)
  // const [limit, setLimit] = useAtom(limitAtom)
  // const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  // const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)
  // const [sortBy, setSortBy] = useAtom(sortByAtom)
  // const [sortOrder, setSortOrder] = useAtom(sortOrderAtom)

  // Jotai atoms - UI 상태
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom)
  const [selectedPostForEdit, setSelectedPostForEdit] = useAtom(selectedPostForEditAtom)
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom)
  const [currentPostId, setCurrentPostId] = useAtom(currentPostIdAtom)

  // 로컬 상태 (필요한 경우에만)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [localPosts, setLocalPosts] = useState<PostWithAuthor[]>([])

  // Features hooks
  const { handleDeletePost } = usePostDelete()
  const { handleLikeComment } = useCommentManagement()
  const { selectedPost, comments, openPostDetail, loadComments } = usePostDetail()
  const { selectedUser, openUserModal } = useUserView()

  // atoms에서 값 읽기 (URL 동기화용)
  const skip = useAtomValue(skipAtom)
  const limit = useAtomValue(limitAtom)
  const searchQuery = useAtomValue(searchQueryAtom)
  const selectedTag = useAtomValue(selectedTagAtom)
  const sortBy = useAtomValue(sortByAtom)
  const sortOrder = useAtomValue(sortOrderAtom)
  const setSkip = useAtom(skipAtom)[1]
  const setLimit = useAtom(limitAtom)[1]
  const setSearchQuery = useAtom(searchQueryAtom)[1]
  const setSelectedTag = useAtom(selectedTagAtom)[1]
  const setSortBy = useAtom(sortByAtom)[1]
  const setSortOrder = useAtom(sortOrderAtom)[1]

  // URL 업데이트 함수
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (selectedTag) params.set("tag", selectedTag)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    navigate(`?${params.toString()}`)
  }, [skip, limit, searchQuery, selectedTag, sortBy, sortOrder, navigate])

  // 게시물 삭제 핸들러
  const handleDelete = async (id: number) => {
    await handleDeletePost(id)
    setRefreshTrigger((prev) => prev + 1)
  }

  // 게시물 상세 보기 핸들러
  const handleOpenPostDetail = async (post: PostWithAuthor) => {
    await openPostDetail(post)
    setShowPostDetailDialog(true)
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


  useEffect(() => {
    updateURL()
  }, [updateURL])

  // URL 파라미터에서 초기값 읽기 및 atoms 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const skipParam = params.get("skip")
    const limitParam = params.get("limit")
    const searchParam = params.get("search")
    const tagParam = params.get("tag")
    const sortByParam = params.get("sortBy")
    const sortOrderParam = params.get("sortOrder")

    // URL 파라미터가 현재 atom 값과 다를 때만 업데이트 (무한 루프 방지)
    if (skipParam !== null) {
      const newSkip = parseInt(skipParam || "0")
      if (newSkip !== skip) setSkip(newSkip)
    }
    if (limitParam !== null) {
      const newLimit = parseInt(limitParam || "10")
      if (newLimit !== limit) setLimit(newLimit)
    }
    if (searchParam !== null && searchParam !== searchQuery) {
      setSearchQuery(searchParam)
    }
    if (tagParam !== null && tagParam !== selectedTag) {
      setSelectedTag(tagParam)
    }
    if (sortByParam !== null && sortByParam !== sortBy) {
      setSortBy(sortByParam)
    }
    if (sortOrderParam !== null && sortOrderParam !== sortOrder) {
      setSortOrder(sortOrderParam as "asc" | "desc")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PostListWithFilters
          onViewDetail={handleOpenPostDetail}
          onEdit={(post) => {
            setSelectedPostForEdit(post)
            setShowEditDialog(true)
          }}
          onDelete={handleDelete}
          onUserClick={async (userId) => {
            try {
              const user = await fetchUser(userId)
              await openUserModal(user)
              setShowUserModal(true)
            } catch (error: unknown) {
              console.error("사용자 정보 가져오기 오류:", error)
            }
          }}
          refreshTrigger={refreshTrigger}
          localPosts={localPosts}
        />
      </CardContent>

      {/* Features 컴포넌트들 */}
      <PostCreateForm
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={(post) => {
          // 추가된 게시물을 로컬 상태에 저장 (검색 시 포함되도록)
          setLocalPosts((prev) => [...prev, post])
          setRefreshTrigger((prev) => prev + 1)
        }}
      />

      <PostEditForm
        post={selectedPostForEdit}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={() => {
          setRefreshTrigger((prev) => prev + 1)
        }}
      />

      <PostDetailDialog
        post={selectedPost}
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        comments={selectedPost ? comments[selectedPost.id] || [] : []}
        onAddComment={() => {
          if (selectedPost) {
            setCurrentPostId(selectedPost.id)
            setShowAddCommentDialog(true)
          }
        }}
        onLikeComment={(id) => {
          if (selectedPost) {
            handleLike(id, selectedPost.id)
          }
        }}
        onEditComment={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
        onDeleteComment={(id) => {
          if (selectedPost) {
            handleDeleteComment(id, selectedPost.id)
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
    </Card>
  )
}

export default PostsManager
