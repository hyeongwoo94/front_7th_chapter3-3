import { useQuery } from "@tanstack/react-query"
import { fetchPosts, PostWithAuthor } from "../../../entity/post"
import { queryKeys } from "../../../app/store/queryKeys"

interface UsePostListQueryProps {
  limit: number
  skip: number
  enabled?: boolean
}

export const usePostListQuery = ({ limit, skip, enabled = true }: UsePostListQueryProps) => {
  return useQuery({
    queryKey: queryKeys.posts.list({ limit, skip }),
    queryFn: () => fetchPosts(limit, skip),
    enabled,
    staleTime: 1000 * 60 * 2, // 2분
  })
}

