import { User } from "../model/types"
import { API_BASE_URL } from "../../../shared/lib/api"

export const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`)
  }
  return await response.json()
}

