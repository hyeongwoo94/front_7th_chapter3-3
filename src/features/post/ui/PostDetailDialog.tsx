import { useAtom, useAtomValue } from "jotai"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib/utils"
import { CommentListWithActions } from "../../../features/comment/ui/CommentListWithActions"
import {
  searchQueryAtom,
  showPostDetailDialogAtom,
  selectedPostAtom,
} from "../../../app/store"

export const PostDetailDialog = () => {
  const [open, setOpen] = useAtom(showPostDetailDialogAtom)
  const [selectedPost] = useAtom(selectedPostAtom)
  const searchQuery = useAtomValue(searchQueryAtom)

  if (!selectedPost) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost.body || "", searchQuery)}</p>
          <CommentListWithActions />
        </div>
      </DialogContent>
    </Dialog>
  )
}

