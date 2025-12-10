import { CommentItem } from "../../../entity/comment/ui"
import { CommentItemActions } from "./CommentItemActions"
import { Comment } from "../../../entity/comment"

interface CommentItemWithActionsProps {
  comment: Comment
  searchQuery?: string
}

export const CommentItemWithActions = ({ comment, searchQuery = "" }: CommentItemWithActionsProps) => {
  return (
    <CommentItem
      comment={comment}
      searchQuery={searchQuery}
      renderActions={(comment) => <CommentItemActions comment={comment} />}
    />
  )
}

