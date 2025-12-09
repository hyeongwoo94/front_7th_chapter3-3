import { PostSearchInput, PostFilter } from "../../../features/post"

interface PostControlsProps {
  onSearch?: () => void
}

export const PostControls = ({ onSearch }: PostControlsProps) => {
  return (
    <div className="flex gap-4">
      <PostSearchInput onSearch={onSearch} />
      <PostFilter />
    </div>
  )
}

