import { ThumbsUp, ThumbsDown } from "lucide-react"

interface PostReactionsProps {
  likes?: number
  dislikes?: number
}

export const PostReactions = ({ likes = 0, dislikes = 0 }: PostReactionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <ThumbsUp className="w-4 h-4" />
      <span>{likes}</span>
      <ThumbsDown className="w-4 h-4" />
      <span>{dislikes}</span>
    </div>
  )
}

