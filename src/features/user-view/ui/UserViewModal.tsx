import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { UserInfo } from "../../../entity/user/ui"
import { User } from "../../../entity/user"

interface UserViewModalProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UserViewModal = ({ user, open, onOpenChange }: UserViewModalProps) => {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <UserInfo user={user} />
      </DialogContent>
    </Dialog>
  )
}
