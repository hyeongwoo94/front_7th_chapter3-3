import { useAtom } from "jotai"
import { Search } from "lucide-react"
import { Input } from "../../../shared/ui"
import { searchQueryAtom } from "../../../app/store"
import { usePostSearchQuery } from "../model/usePostSearchQuery"

export const PostSearchInput = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const { isLoading } = usePostSearchQuery({
    query: searchQuery,
    enabled: searchQuery.length > 0,
  })

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

