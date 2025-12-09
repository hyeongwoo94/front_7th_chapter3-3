import { atom } from "jotai"

// 필터 및 검색 상태
export const searchQueryAtom = atom<string>("")
export const selectedTagAtom = atom<string>("")
export const sortByAtom = atom<string>("")
export const sortOrderAtom = atom<"asc" | "desc">("asc")

// 페이지네이션 상태
export const skipAtom = atom<number>(0)
export const limitAtom = atom<number>(10)

// 정렬 설정을 하나의 atom으로 관리하는 derived atom
export const sortConfigAtom = atom(
  (get) => ({
    sortBy: get(sortByAtom),
    sortOrder: get(sortOrderAtom),
  }),
  (get, set, update: { sortBy?: string; sortOrder?: "asc" | "desc" }) => {
    if (update.sortBy !== undefined) {
      set(sortByAtom, update.sortBy)
    }
    if (update.sortOrder !== undefined) {
      set(sortOrderAtom, update.sortOrder)
    }
  }
)

// 필터 설정을 하나의 atom으로 관리하는 derived atom
export const filterConfigAtom = atom(
  (get) => ({
    searchQuery: get(searchQueryAtom),
    selectedTag: get(selectedTagAtom),
    skip: get(skipAtom),
    limit: get(limitAtom),
    sortBy: get(sortByAtom),
    sortOrder: get(sortOrderAtom),
  }),
  (get, set, update: {
    searchQuery?: string
    selectedTag?: string
    skip?: number
    limit?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }) => {
    if (update.searchQuery !== undefined) {
      set(searchQueryAtom, update.searchQuery)
    }
    if (update.selectedTag !== undefined) {
      set(selectedTagAtom, update.selectedTag)
    }
    if (update.skip !== undefined) {
      set(skipAtom, update.skip)
    }
    if (update.limit !== undefined) {
      set(limitAtom, update.limit)
    }
    if (update.sortBy !== undefined) {
      set(sortByAtom, update.sortBy)
    }
    if (update.sortOrder !== undefined) {
      set(sortOrderAtom, update.sortOrder)
    }
  }
)

