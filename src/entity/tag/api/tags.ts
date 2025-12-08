import { Tag } from "../model/types"

export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch("/api/posts/tags")
  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.status}`)
  }
  return await response.json()
}

