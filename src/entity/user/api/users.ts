import { User } from "../model/types"

export const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`)
  }
  return await response.json()
}

