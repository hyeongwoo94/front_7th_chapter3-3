import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  error: Error | unknown
  title?: string
  onRetry?: () => void
  className?: string
}

/**
 * 에러 메시지를 표시하는 공통 컴포넌트
 * 
 * @param error - 에러 객체 (Error 또는 unknown)
 * @param title - 에러 제목 (기본값: "오류가 발생했습니다")
 * @param onRetry - 재시도 버튼 클릭 핸들러 (선택사항)
 * @param className - 추가 CSS 클래스
 */
export const ErrorMessage = ({ error, title, onRetry, className = "" }: ErrorMessageProps) => {
  // 에러 메시지 추출
  const errorMessage = error instanceof Error ? error.message : String(error) || "알 수 없는 오류가 발생했습니다"

  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-800 mb-1">
            {title || "오류가 발생했습니다"}
          </h3>
          <p className="text-sm text-red-700 break-words">{errorMessage}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 text-sm font-medium text-red-800 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

