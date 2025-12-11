import { Skeleton } from "../../../shared/ui"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/ui"

/**
 * 게시물 테이블 로딩 상태를 표시하는 Skeleton 컴포넌트
 */
export const PostTableSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <td className="px-4 py-3">
              <Skeleton className="h-4 w-8" />
            </td>
            <td className="px-4 py-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Skeleton variant="circular" className="h-8 w-8" />
                <Skeleton className="h-4 w-20" />
              </div>
            </td>
            <td className="px-4 py-3">
              <Skeleton className="h-4 w-16" />
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

