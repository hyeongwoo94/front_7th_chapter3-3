import { useEffect, useState, useCallback } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../shared/ui"
import { PostWithAuthor } from "../entity/post"
import { Comment } from "../entity/comment"
import { PostCreateForm, PostEditForm, usePostDelete, PostDetailDialog, usePostDetail } from "../features/post"
import { CommentCreateForm, CommentEditForm, useCommentManagement } from "../features/comment"
import { UserViewModal, useUserView } from "../features/user-view"
import { deleteComment } from "../entity/comment"
import { fetchUser } from "../entity/user"
import { PostListWithFilters } from "../widgets/PostListWithFilters"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 페이지네이션 상태
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")

  // Features hooks
  const { handleDeletePost } = usePostDelete()
  const { handleLikeComment } = useCommentManagement()
  const { selectedPost, comments, openPostDetail, loadComments } = usePostDetail()
  const { selectedUser, openUserModal } = useUserView()

  // 다이얼로그 상태
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedPostForEdit, setSelectedPostForEdit] = useState<PostWithAuthor | null>(null)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [currentPostId, setCurrentPostId] = useState<number | null>(null)

  // URL 업데이트 함수
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }, [skip, limit, searchQuery, selectedTag, navigate])

  // 게시물 삭제 핸들러
  const handleDelete = async (id: number) => {
    await handleDeletePost(id)
  }

  // 게시물 상세 보기 핸들러
  const handleOpenPostDetail = async (post: PostWithAuthor) => {
    await openPostDetail(post)
    setShowPostDetailDialog(true)
  }

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (id: number, postId: number) => {
    try {
      await deleteComment(id)
      // comments 상태 업데이트는 usePostDetail에서 관리
      await loadComments(postId)
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
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

  // 태그 필터 핸들러
  const handleTagFilter = () => {
    updateURL()
  }

  useEffect(() => {
    updateURL()
  }, [updateURL])

  // URL 파라미터에서 초기값 읽기
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const skipParam = params.get("skip")
    const limitParam = params.get("limit")
    const searchParam = params.get("search")
    const tagParam = params.get("tag")
    const sortByParam = params.get("sortBy")
    const sortOrderParam = params.get("sortOrder")

    // URL 파라미터가 현재 state와 다를 때만 업데이트 (무한 루프 방지)
    const newSkip = skipParam !== null ? parseInt(skipParam || "0") : skip
    const newLimit = limitParam !== null ? parseInt(limitParam || "10") : limit
    const newSearchQuery = searchParam !== null ? searchParam : searchQuery
    const newSelectedTag = tagParam !== null ? tagParam : selectedTag
    const newSortBy = sortByParam !== null ? sortByParam : sortBy
    const newSortOrder = sortOrderParam !== null ? sortOrderParam : sortOrder

    // 배치 업데이트로 여러 setState 호출 최소화
    if (
      newSkip !== skip ||
      newLimit !== limit ||
      newSearchQuery !== searchQuery ||
      newSelectedTag !== selectedTag ||
      newSortBy !== sortBy ||
      newSortOrder !== sortOrder
    ) {
      // React의 배치 업데이트를 활용하기 위해 각각 호출하되, 조건부로만 실행
      if (newSkip !== skip) setSkip(newSkip)
      if (newLimit !== limit) setLimit(newLimit)
      if (newSearchQuery !== searchQuery) setSearchQuery(newSearchQuery)
      if (newSelectedTag !== selectedTag) setSelectedTag(newSelectedTag)
      if (newSortBy !== sortBy) setSortBy(newSortBy)
      if (newSortOrder !== sortOrder) setSortOrder(newSortOrder)
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
          limit={limit}
          skip={skip}
          searchQuery={searchQuery}
          selectedTag={selectedTag}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onLimitChange={setLimit}
          onSkipChange={setSkip}
          onSearchQueryChange={setSearchQuery}
          onTagChange={handleTagFilter}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
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
            } catch (error) {
              console.error("사용자 정보 가져오기 오류:", error)
            }
          }}
        />
      </CardContent>

      {/* Features 컴포넌트들 */}
      <PostCreateForm
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          // 위젯이 자체적으로 reload를 관리함
        }}
      />

      <PostEditForm
        post={selectedPostForEdit}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={() => {
          // 위젯이 자체적으로 reload를 관리함
        }}
      />

      <PostDetailDialog
        post={selectedPost}
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        comments={selectedPost ? comments[selectedPost.id] || [] : []}
        searchQuery={searchQuery}
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

      {currentPostId && (
        <CommentCreateForm
          postId={currentPostId}
          open={showAddCommentDialog}
          onOpenChange={setShowAddCommentDialog}
          onSuccess={async () => {
            if (selectedPost) {
              await loadComments(selectedPost.id)
            }
          }}
        />
      )}

      <CommentEditForm
        comment={selectedComment}
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        onSuccess={async () => {
          if (selectedPost) {
            await loadComments(selectedPost.id)
          }
        }}
      />

      <UserViewModal user={selectedUser} open={showUserModal} onOpenChange={setShowUserModal} />
    </Card>
  )
}

export default PostsManager
