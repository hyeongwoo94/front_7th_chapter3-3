import { User } from "../../user/model/types"

export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user: User
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}

export interface CreateCommentRequest {
  body: string
  postId: number | null
  userId: number
}

export interface UpdateCommentRequest {
  body: string
}
