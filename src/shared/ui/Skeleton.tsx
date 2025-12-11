interface SkeletonProps {
  className?: string
  variant?: "default" | "text" | "circular" | "rectangular"
}

/**
 * 로딩 상태를 시각적으로 표현하는 Skeleton 컴포넌트
 * 
 * @param className - 추가 CSS 클래스
 * @param variant - Skeleton 스타일 변형 (default, text, circular, rectangular)
 */
export const Skeleton = ({ className = "", variant = "default" }: SkeletonProps) => {
  const baseClasses = "animate-pulse bg-gray-200"
  
  const variantClasses = {
    default: "rounded",
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-none",
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
    />
  )
}

