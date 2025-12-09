import { Post, PostWithAuthor, PostsResponse, CreatePostRequest } from "../model/types"
import { User } from "../../user/model/types"
import { API_BASE_URL } from "../../../shared/lib/api"

export const fetchPosts = async (limit: number, skip: number): Promise<{ posts: PostWithAuthor[]; total: number }> => {
  const postsResponse = await fetch(`${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`)
  if (!postsResponse.ok) {
    throw new Error(`Failed to fetch posts: ${postsResponse.status}`)
  }
  const postsData: PostsResponse = await postsResponse.json()

  const usersResponse = await fetch(`${API_BASE_URL}/users?limit=0&select=username,image`)
  if (!usersResponse.ok) {
    throw new Error(`Failed to fetch users: ${usersResponse.status}`)
  }
  const usersData = await usersResponse.json()

  const postsWithUsers: PostWithAuthor[] = postsData.posts.map((post) => ({
    ...post,
    author: usersData.users.find((user: User) => user.id === post.userId),
  }))

  return {
    posts: postsWithUsers,
    total: postsData.total,
  }
}

export const searchPosts = async (query: string): Promise<{ posts: Post[]; total: number }> => {
  const response = await fetch(`${API_BASE_URL}/posts/search?q=${query}`)
  if (!response.ok) {
    throw new Error(`Failed to search posts: ${response.status}`)
  }
  const data: PostsResponse = await response.json()
  return {
    posts: data.posts,
    total: data.total,
  }
}

export const fetchPostsByTag = async (tag: string): Promise<{ posts: PostWithAuthor[]; total: number }> => {
  const [postsResponse, usersResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/posts/tag/${tag}`),
    fetch(`${API_BASE_URL}/users?limit=0&select=username,image`),
  ])

  if (!postsResponse.ok) {
    throw new Error(`Failed to fetch posts by tag: ${postsResponse.status}`)
  }
  if (!usersResponse.ok) {
    throw new Error(`Failed to fetch users: ${usersResponse.status}`)
  }

  const postsData: PostsResponse = await postsResponse.json()
  const usersData = await usersResponse.json()

  const postsWithUsers: PostWithAuthor[] = postsData.posts.map((post) => ({
    ...post,
    author: usersData.users.find((user: User) => user.id === post.userId),
  }))

  return {
    posts: postsWithUsers,
    total: postsData.total,
  }
}

export const addPost = async (post: CreatePostRequest): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  if (!response.ok) {
    throw new Error(`Failed to add post: ${response.status}`)
  }
  return await response.json()
}

export const updatePost = async (id: number, post: Partial<Post>): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  if (!response.ok) {
    throw new Error(`Failed to update post: ${response.status}`)
  }
  return await response.json()
}

export const deletePost = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error(`Failed to delete post: ${response.status}`)
  }
}

