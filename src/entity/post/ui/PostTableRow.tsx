import { useAtom, useSetAtom } from "jotai"
import { PostWithAuthor } from "../model/types"
import { PostTitle } from "./PostTitle"
import { PostReactions } from "./PostReactions"
import { PostActions } from "./PostActions"
import { TagBadge } from "../../tag/ui/TagBadge"
import { UserAvatar } from "../../user/ui/UserAvatar"
import { TableCell, TableRow } from "../../../shared/ui"
import {
  searchQueryAtom,
  selectedTagAtom,
  selectedPostAtom,
  selectedPostForEditAtom,
  showEditDialogAtom,
  showUserModalAtom,
  selectedUserAtom,
} from "../../../app/store"
import { usePostManagerHandlers } from "../../../pages/PostsManagerPage/hooks/usePostManagerHandlers"
import { useDialogManager } from "../../../pages/PostsManagerPage/hooks/useDialogManager"
import { fetchUser } from "../../user/api/users"

interface PostTableRowProps {
  post: PostWithAuthor
  onTagClick: (tag: string) => void
}

export const PostTableRow = ({ post, onTagClick }: PostTableRowProps) => {
  const [searchQuery] = useAtom(searchQueryAtom)
  const [selectedTag] = useAtom(selectedTagAtom)
  const setSelectedPost = useSetAtom(selectedPostAtom)
  const setSelectedPostForEdit = useSetAtom(selectedPostForEditAtom)
  const setShowEditDialog = useSetAtom(showEditDialogAtom)
  const setShowUserModal = useSetAtom(showUserModalAtom)
  const setSelectedUser = useSetAtom(selectedUserAtom)
  const { handleDelete } = usePostManagerHandlers()
  const { openPostDetailDialog } = useDialogManager()

  // 게시물 상세 보기 핸들러
  const handleViewDetail = async () => {
    setSelectedPost(post)
    openPostDetailDialog()
  }

  // 게시물 수정 핸들러
  const handleEdit = () => {
    setSelectedPostForEdit(post)
    setShowEditDialog(true)
  }

  // 게시물 삭제 핸들러
  const handleDeleteClick = () => {
    handleDelete(post.id)
  }

  // 사용자 클릭 핸들러
  const handleUserClick = async () => {
    if (post.author?.id) {
      try {
        const user = await fetchUser(post.author.id)
        setSelectedUser(user)
        setShowUserModal(true)
      } catch (error: unknown) {
        console.error("사용자 정보 가져오기 오류:", error)
      }
    }
  }
  return (
    <TableRow>
      <TableCell>{post.id}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <PostTitle title={post.title} highlight={searchQuery} />
          <div className="flex flex-wrap gap-1">
            {post.tags?.map((tag) => (
              <TagBadge
                key={tag}
                tag={tag}
                isSelected={selectedTag === tag}
                onClick={() => onTagClick(tag)}
              />
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {post.author && <UserAvatar user={post.author} onClick={handleUserClick} />}
      </TableCell>
      <TableCell>
        <PostReactions likes={post.reactions?.likes} dislikes={post.reactions?.dislikes} />
      </TableCell>
      <TableCell>
        <PostActions onViewDetail={handleViewDetail} onEdit={handleEdit} onDelete={handleDeleteClick} />
      </TableCell>
    </TableRow>
  )
}

