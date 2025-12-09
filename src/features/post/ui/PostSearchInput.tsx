import { useAtom } from "jotai"
import { Search } from "lucide-react"
import { Input } from "../../../shared/ui"
import { usePostSearch } from "../model/usePostSearch"
import { PostWithAuthor } from "../../../entity/post"
import { searchQueryAtom } from "../../../app/store"

interface PostSearchInputProps {
  onSearch?: (posts: PostWithAuthor[], total: number) => void
}

export const PostSearchInput = ({ onSearch }: PostSearchInputProps) => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const { handleSearch, loading } = usePostSearch()

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await handleSearch(searchQuery, onSearch)
    }
  }

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </div>
    </div>
  )
}

