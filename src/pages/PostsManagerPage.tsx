import { useEffect, useState, useCallback } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../shared/ui"
import { PostWithAuthor } from "../entity/post"
import { Comment } from "../entity/comment"
import { PostTableRow } from "../entity/post/ui"
import { PostCreateForm } from "../features/post-create"
import { PostEditForm } from "../features/post-edit"
import { usePostDelete } from "../features/post-delete"
import { usePostList } from "../features/post-list"
import { PostSearchInput } from "../features/post-search"
import { PostFilter, usePostFilter } from "../features/post-filter"
import { PostDetailDialog, usePostDetail } from "../features/post-detail"
import { CommentCreateForm } from "../features/comment-create"
import { CommentEditForm } from "../features/comment-edit"
import { useCommentLike } from "../features/comment-like"
import { UserViewModal, useUserView } from "../features/user-view"
import { deleteComment } from "../entity/comment"

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
  const { posts, setPosts, total, setTotal, loading, reload } = usePostList({ limit, skip })
  const { handleDeletePost } = usePostDelete()
  const { handleLikeComment } = useCommentLike()
  const { selectedPost, comments, openPostDetail, loadComments } = usePostDetail()
  const { selectedUser, openUserModal } = useUserView()
  const { handleFilterByTag } = usePostFilter()

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
    await handleDeletePost(id, () => {
      setPosts(posts.filter((post) => post.id !== id))
    })
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

  // 검색 핸들러
  const handleSearch = (searchedPosts: PostWithAuthor[], searchedTotal: number) => {
    setPosts(searchedPosts)
    setTotal(searchedTotal)
  }

  // 태그 필터 핸들러
  const handleTagFilter = (tag: string) => {
    handleFilterByTag(tag, (filteredPosts, filteredTotal) => {
      setPosts(filteredPosts)
      setTotal(filteredTotal)
    })
    updateURL()
  }

  // 초기 로드 및 limit/skip 변경 시 게시물 로드
  useEffect(() => {
    reload()
  }, [limit, skip, reload])

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

  // 게시물 테이블 렌더링
  const renderPostTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <PostTableRow
            key={post.id}
            post={post}
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            onTagClick={(tag) => {
              handleTagFilter(tag)
            }}
            onViewDetail={() => handleOpenPostDetail(post)}
            onEdit={() => {
              setSelectedPostForEdit(post)
              setShowEditDialog(true)
            }}
            onDelete={() => handleDelete(post.id)}
            onUserClick={() => openUserModal(post.author!).then(() => setShowUserModal(true))}
          />
        ))}
      </TableBody>
    </Table>
  )

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
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <PostSearchInput searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} onSearch={handleSearch} />
            <PostFilter
              selectedTag={selectedTag}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onTagChange={handleTagFilter}
              onSortByChange={setSortBy}
              onSortOrderChange={setSortOrder}
            />
          </div>

          {/* 게시물 테이블 */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
                이전
              </Button>
              <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Features 컴포넌트들 */}
      <PostCreateForm
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          reload()
        }}
      />

      <PostEditForm
        post={selectedPostForEdit}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={() => {
          reload()
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
