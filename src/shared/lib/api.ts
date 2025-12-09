/**
 * API 베이스 URL 설정
 * 개발 환경: Vite proxy 사용 (/api)
 * 프로덕션 환경: 직접 API 호출 (https://dummyjson.com)
 */
const getApiBaseUrl = (): string => {
  // 개발 환경 체크 (localhost 또는 127.0.0.1)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    // 개발 서버인 경우
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes("localhost")) {
      return "/api"
    }
  }
  // 프로덕션 환경 (GitHub Pages 등) - 직접 API 호출
  return "https://dummyjson.com"
}

export const API_BASE_URL = getApiBaseUrl()

