import { atom } from "jotai"
import { PostWithAuthor } from "../../entity/post"
import { Comment } from "../../entity/comment"

// 다이얼로그 표시 상태
export const showAddDialogAtom = atom<boolean>(false)
export const showEditDialogAtom = atom<boolean>(false)
export const showAddCommentDialogAtom = atom<boolean>(false)
export const showEditCommentDialogAtom = atom<boolean>(false)
export const showPostDetailDialogAtom = atom<boolean>(false)
export const showUserModalAtom = atom<boolean>(false)

// 선택된 항목 상태
export const selectedPostForEditAtom = atom<PostWithAuthor | null>(null)
export const selectedCommentAtom = atom<Comment | null>(null)
export const currentPostIdAtom = atom<number | null>(null)

