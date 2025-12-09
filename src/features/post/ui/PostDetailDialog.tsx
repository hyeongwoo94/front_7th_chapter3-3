import { useAtomValue } from "jotai"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib/utils"
import { PostWithAuthor } from "../../../entity/post"
import { CommentList } from "../../../entity/comment/ui"
import { Comment } from "../../../entity/comment"
import { searchQueryAtom } from "../../../app/store"

interface PostDetailDialogProps {
  post: PostWithAuthor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  comments: Comment[]
  onAddComment: () => void
  onLikeComment: (id: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (id: number) => void
}

export const PostDetailDialog = ({
  post,
  open,
  onOpenChange,
  comments,
  onAddComment,
  onLikeComment,
  onEditComment,
  onDeleteComment,
}: PostDetailDialogProps) => {
  const searchQuery = useAtomValue(searchQueryAtom)
  
  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body || "", searchQuery)}</p>
          <CommentList
            comments={comments}
            searchQuery={searchQuery}
            onAddComment={onAddComment}
            onLike={onLikeComment}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

