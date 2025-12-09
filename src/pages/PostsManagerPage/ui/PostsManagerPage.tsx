import { Card, CardContent } from "../../../shared/ui"
import { PostListWithFilters } from "../../../widgets/PostListWithFilters"
import { useURLSync } from "../hooks/useURLSync"
import { useDialogManager } from "../hooks/useDialogManager"
import { PostManagerHeader } from "./PostManagerHeader"
import { PostManagerDialogs } from "./PostManagerDialogs"

const PostsManager = () => {
  // URL 동기화
  useURLSync()

  // 다이얼로그 관리
  const { openAddDialog } = useDialogManager()

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostManagerHeader onAddClick={openAddDialog} />
      <CardContent>
        <PostListWithFilters />
      </CardContent>

      <PostManagerDialogs />
    </Card>
  )
}

export default PostsManager

