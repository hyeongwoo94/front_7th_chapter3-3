import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ReactNode } from "react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (이전 cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (error) => {
        // 전역 쿼리 에러 핸들링
        // 개발 환경에서만 콘솔에 출력 (프로덕션에서는 에러 로깅 서비스로 전송)
        if (import.meta.env.DEV) {
          console.error("Query Error:", error)
        }
      },
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        // 전역 mutation 에러 핸들링
        // 개발 환경에서만 콘솔에 출력 (프로덕션에서는 에러 로깅 서비스로 전송)
        if (import.meta.env.DEV) {
          console.error("Mutation Error:", error)
        }
      },
    },
  },
})

interface QueryProviderProps {
  children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export { queryClient }

