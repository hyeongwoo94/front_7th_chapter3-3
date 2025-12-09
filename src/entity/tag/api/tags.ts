import { Tag } from "../model/types"
import { API_BASE_URL } from "../../../shared/lib/api"

export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch(`${API_BASE_URL}/posts/tags`)
  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.status}`)
  }
  return await response.json()
}

