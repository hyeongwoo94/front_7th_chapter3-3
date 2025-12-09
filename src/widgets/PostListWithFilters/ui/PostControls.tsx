import { PostSearchInput, PostFilter } from "../../../features/post"

export const PostControls = () => {
  return (
    <div className="flex gap-4">
      <PostSearchInput />
      <PostFilter />
    </div>
  )
}

