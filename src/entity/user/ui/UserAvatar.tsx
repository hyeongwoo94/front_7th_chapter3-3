import { User } from "../model/types"

interface UserAvatarProps {
  user: User
  onClick?: () => void
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
}

export const UserAvatar = ({ user, onClick, size = "md" }: UserAvatarProps) => {
  return (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={onClick}>
      <img
        src={user.image}
        alt={user.username}
        className={`${sizeClasses[size]} rounded-full`}
      />
      <span>{user.username}</span>
    </div>
  )
}

