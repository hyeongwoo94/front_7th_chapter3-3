import { PostWithAuthor } from "../model/types"
import { PostTitle } from "./PostTitle"
import { PostReactions } from "./PostReactions"
import { PostActions } from "./PostActions"
import { TagBadge } from "../../tag/ui/TagBadge"
import { UserAvatar } from "../../user/ui/UserAvatar"
import { TableCell, TableRow } from "../../../shared/ui"

interface PostTableRowProps {
  post: PostWithAuthor
  searchQuery?: string
  selectedTag?: string
  onTagClick: (tag: string) => void
  onViewDetail: () => void
  onEdit: () => void
  onDelete: () => void
  onUserClick: () => void
}

export const PostTableRow = ({
  post,
  searchQuery = "",
  selectedTag,
  onTagClick,
  onViewDetail,
  onEdit,
  onDelete,
  onUserClick,
}: PostTableRowProps) => {
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
        {post.author && <UserAvatar user={post.author} onClick={onUserClick} />}
      </TableCell>
      <TableCell>
        <PostReactions likes={post.reactions?.likes} dislikes={post.reactions?.dislikes} />
      </TableCell>
      <TableCell>
        <PostActions onViewDetail={onViewDetail} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  )
}

