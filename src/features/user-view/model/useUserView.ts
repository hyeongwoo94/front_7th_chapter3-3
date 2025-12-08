import { useState } from "react"
import { fetchUser, User } from "../../../entity/user"

export const useUserView = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const openUserModal = async (user: User) => {
    setLoading(true)
    try {
      const userData = await fetchUser(user.id)
      setSelectedUser(userData)
      return userData
    } catch (error: unknown) {
      console.error("사용자 정보 가져오기 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    selectedUser,
    setSelectedUser,
    openUserModal,
    loading,
  }
}
