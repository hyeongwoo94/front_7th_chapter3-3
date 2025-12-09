import { useAtom } from "jotai"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { UserInfo } from "../../../entity/user/ui"
import { showUserModalAtom, selectedUserAtom } from "../../../app/store"

export const UserViewModal = () => {
  const [open, setOpen] = useAtom(showUserModalAtom)
  const [user] = useAtom(selectedUserAtom)

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <UserInfo user={user} />
      </DialogContent>
    </Dialog>
  )
}
