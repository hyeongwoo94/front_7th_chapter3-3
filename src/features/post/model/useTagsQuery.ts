import { useQuery } from "@tanstack/react-query"
import { fetchTags } from "../../../entity/tag"
import { queryKeys } from "../../../app/store/queryKeys"

export const useTagsQuery = () => {
  return useQuery({
    queryKey: queryKeys.tags.list(),
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 10, // 10분 (태그는 자주 변경되지 않음)
  })
}

