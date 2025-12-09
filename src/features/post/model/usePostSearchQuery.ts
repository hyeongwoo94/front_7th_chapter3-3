import { useQuery } from "@tanstack/react-query"
import { searchPosts, Post } from "../../../entity/post"
import { queryKeys } from "../../../app/store/queryKeys"

interface UsePostSearchQueryProps {
  query: string
  enabled?: boolean
}

export const usePostSearchQuery = ({ query, enabled = true }: UsePostSearchQueryProps) => {
  return useQuery({
    queryKey: queryKeys.posts.list({ search: query }),
    queryFn: () => searchPosts(query),
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 2, // 2분
  })
}

