import { PostWithAuthor } from "../../../entity/post"
import { PostSearchInput, PostFilter } from "../../../features/post"

interface PostControlsProps {
  onSearch: (posts: PostWithAuthor[], total: number) => void
}

export const PostControls = ({ onSearch }: PostControlsProps) => {
  return (
    <div className="flex gap-4">
      <PostSearchInput onSearch={onSearch} />
      <PostFilter />
    </div>
  )
}

