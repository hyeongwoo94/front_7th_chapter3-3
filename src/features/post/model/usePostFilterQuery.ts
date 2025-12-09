import { useQuery } from "@tanstack/react-query"
import { fetchPostsByTag, PostWithAuthor } from "../../../entity/post"
import { queryKeys } from "../../../app/store/queryKeys"

interface UsePostFilterQueryProps {
  tag: string
  enabled?: boolean
}

export const usePostFilterQuery = ({ tag, enabled = true }: UsePostFilterQueryProps) => {
  return useQuery({
    queryKey: queryKeys.posts.list({ tag }),
    queryFn: () => fetchPostsByTag(tag),
    enabled: enabled && tag.length > 0 && tag !== "all",
    staleTime: 1000 * 60 * 2, // 2분
  })
}

