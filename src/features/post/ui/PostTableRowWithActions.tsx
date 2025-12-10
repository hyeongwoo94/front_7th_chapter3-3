import { useAtomValue, useSetAtom } from "jotai"
import { PostTableRow } from "../../../entity/post/ui/PostTableRow"
import { PostTableRowActions } from "./PostTableRowActions"
import { PostWithAuthor } from "../../../entity/post"
import { searchQueryAtom, selectedTagAtom, showUserModalAtom, selectedUserAtom } from "../../../app/store"
import { fetchUser } from "../../../entity/user"

interface PostTableRowWithActionsProps {
  post: PostWithAuthor
}

export const PostTableRowWithActions = ({ post }: PostTableRowWithActionsProps) => {
  const searchQuery = useAtomValue(searchQueryAtom)
  const selectedTag = useAtomValue(selectedTagAtom)
  const setSelectedTag = useSetAtom(selectedTagAtom)
  const setSelectedUser = useSetAtom(selectedUserAtom)
  const setShowUserModal = useSetAtom(showUserModalAtom)

  // 태그 클릭 핸들러 (비즈니스 로직)
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
  }

  // 사용자 클릭 핸들러
  const handleUserClick = async () => {
    if (post.author?.id) {
      try {
        const user = await fetchUser(post.author.id)
        setSelectedUser(user)
        setShowUserModal(true)
      } catch (error: unknown) {
        console.error("사용자 정보 가져오기 오류:", error)
      }
    }
  }

  return (
    <PostTableRow
      post={post}
      searchQuery={searchQuery}
      selectedTag={selectedTag}
      onTagClick={handleTagClick}
      onUserClick={handleUserClick}
      renderActions={(post) => <PostTableRowActions post={post} />}
    />
  )
}

