import { useQuery } from "@tanstack/react-query"
import { fetchComments } from "../../../entity/comment"
import { queryKeys } from "../../../app/store/queryKeys"

interface UseCommentsQueryProps {
  postId: number
  enabled?: boolean
}

export const useCommentsQuery = ({ postId, enabled = true }: UseCommentsQueryProps) => {
  return useQuery({
    queryKey: queryKeys.comments.list(postId),
    queryFn: () => fetchComments(postId),
    enabled: enabled && postId > 0,
    staleTime: 1000 * 60 * 2, // 2분
  })
}

