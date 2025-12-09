import { useEffect, useCallback } from "react"
import { useAtom, useAtomValue } from "jotai"
import { useLocation, useNavigate } from "react-router-dom"
import {
  searchQueryAtom,
  selectedTagAtom,
  sortByAtom,
  sortOrderAtom,
  skipAtom,
  limitAtom,
} from "../../../app/store"

/**
 * URL 파라미터와 Jotai atoms를 동기화하는 훅
 */
export const useURLSync = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // atoms에서 값 읽기
  const skip = useAtomValue(skipAtom)
  const limit = useAtomValue(limitAtom)
  const searchQuery = useAtomValue(searchQueryAtom)
  const selectedTag = useAtomValue(selectedTagAtom)
  const sortBy = useAtomValue(sortByAtom)
  const sortOrder = useAtomValue(sortOrderAtom)

  // atoms setter 가져오기
  const [, setSkip] = useAtom(skipAtom)
  const [, setLimit] = useAtom(limitAtom)
  const [, setSearchQuery] = useAtom(searchQueryAtom)
  const [, setSelectedTag] = useAtom(selectedTagAtom)
  const [, setSortBy] = useAtom(sortByAtom)
  const [, setSortOrder] = useAtom(sortOrderAtom)

  // URL 업데이트 함수
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (selectedTag) params.set("tag", selectedTag)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    navigate(`?${params.toString()}`)
  }, [skip, limit, searchQuery, selectedTag, sortBy, sortOrder, navigate])

  // atoms 변경 시 URL 업데이트
  useEffect(() => {
    updateURL()
  }, [updateURL])

  // URL 파라미터에서 초기값 읽기 및 atoms 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const skipParam = params.get("skip")
    const limitParam = params.get("limit")
    const searchParam = params.get("search")
    const tagParam = params.get("tag")
    const sortByParam = params.get("sortBy")
    const sortOrderParam = params.get("sortOrder")

    // URL 파라미터가 현재 atom 값과 다를 때만 업데이트 (무한 루프 방지)
    if (skipParam !== null) {
      const newSkip = parseInt(skipParam || "0")
      if (newSkip !== skip) setSkip(newSkip)
    }
    if (limitParam !== null) {
      const newLimit = parseInt(limitParam || "10")
      if (newLimit !== limit) setLimit(newLimit)
    }
    if (searchParam !== null && searchParam !== searchQuery) {
      setSearchQuery(searchParam)
    }
    if (tagParam !== null && tagParam !== selectedTag) {
      setSelectedTag(tagParam)
    }
    if (sortByParam !== null && sortByParam !== sortBy) {
      setSortBy(sortByParam)
    }
    if (sortOrderParam !== null && sortOrderParam !== sortOrder) {
      setSortOrder(sortOrderParam as "asc" | "desc")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])
}

