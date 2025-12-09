import { Comment, CommentsResponse, CreateCommentRequest, UpdateCommentRequest } from "../model/types"
import { API_BASE_URL } from "../../../shared/lib/api"

export const fetchComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.status}`)
  }
  const data: CommentsResponse = await response.json()
  return data.comments
}

export const addComment = async (comment: CreateCommentRequest): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/comments/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  })
  if (!response.ok) {
    throw new Error(`Failed to add comment: ${response.status}`)
  }
  return await response.json()
}

export const updateComment = async (id: number, comment: UpdateCommentRequest): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  })
  if (!response.ok) {
    throw new Error(`Failed to update comment: ${response.status}`)
  }
  return await response.json()
}

export const deleteComment = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error(`Failed to delete comment: ${response.status}`)
  }
}

export const likeComment = async (id: number, currentLikes: number): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: currentLikes + 1 }),
  })
  if (!response.ok) {
    throw new Error(`Failed to like comment: ${response.status}`)
  }
  return await response.json()
}

