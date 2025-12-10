import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { Search } from "lucide-react"
import { Input } from "../../../shared/ui"
import { searchQueryAtom } from "../../../app/store"
import { usePostSearchQuery } from "../model/usePostSearchQuery"
import { useDebounce } from "../../../shared/lib/hooks/useDebounce"

export const PostSearchInput = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [inputValue, setInputValue] = useState(searchQuery)
  const debouncedInputValue = useDebounce(inputValue, 800)
  const { isLoading } = usePostSearchQuery({
    query: searchQuery,
    enabled: searchQuery.length > 0,
  })

  // debounced된 값이 변경되면 searchQuery 업데이트
  useEffect(() => {
    setSearchQuery(debouncedInputValue)
  }, [debouncedInputValue, setSearchQuery])

  // searchQuery가 외부에서 변경되면 inputValue도 동기화
  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

