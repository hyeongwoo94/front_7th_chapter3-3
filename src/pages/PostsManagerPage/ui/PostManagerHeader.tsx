import { Plus } from "lucide-react"
import { Button, CardHeader, CardTitle } from "../../../shared/ui"

interface PostManagerHeaderProps {
  onAddClick: () => void
}

export const PostManagerHeader = ({ onAddClick }: PostManagerHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>게시물 관리자</span>
        <Button onClick={onAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          게시물 추가
        </Button>
      </CardTitle>
    </CardHeader>
  )
}

