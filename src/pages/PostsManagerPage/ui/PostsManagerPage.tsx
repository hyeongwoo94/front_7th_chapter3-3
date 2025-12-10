import { PostListWithFilters } from "../../../widgets/PostListWithFilters"
import { useURLSync } from "../hooks/useURLSync"
import { useDialogManager } from "../hooks/useDialogManager"
import { PostManagerHeader } from "./PostManagerHeader"
import { PostManagerDialogs } from "./PostManagerDialogs"
import { Layout, LayoutContent } from "./Layout"

const PostsManager = () => {
  // URL 동기화
  useURLSync()

  // 다이얼로그 관리
  const { openAddDialog } = useDialogManager()

  return (
    <Layout className="w-full max-w-6xl mx-auto">
      <PostManagerHeader onAddClick={openAddDialog} />
      <LayoutContent>
        <PostListWithFilters />
      </LayoutContent>

      <PostManagerDialogs />
    </Layout>
  )
}

export default PostsManager

