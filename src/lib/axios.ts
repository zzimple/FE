// lib/axios.ts

import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

// _retry 플래그를 허용하기 위한 커스텀 타입 선언
interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean; 
}

// const BASE_URL = "http://14.63.178.146:8080";
// const BASE_URL = "https://api.zzimple.store";
// const BASE_URL = "http://localhost:8080";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getAccessTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith('accessToken=')) {
      return trimmedCookie.substring('accessToken='.length);
    }
  }
  return null;
};

// 쿠키에서 accessToken을 제거하는 함수
const removeAccessTokenFromCookie = (): void => {
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};


/**
 * 1) authApi: 모든 요청에 accessToken 헤더를 붙이고,
 *    401 응답 시 refresh-token 호출 → 재시도
 */
export const authApi = axios.create({
  baseURL: "/proxy",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,   // 수정됨: httpOnly 쿠키(=refreshToken) 자동 전송
});

authApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessTokenFromCookie();

  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`; // 수정됨
    console.log("🔐 authApi: Authorization 헤더 설정 완료", token);
  }
  return config;
});

authApi.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 수정됨

      try {
        // refreshToken은 쿠키에 담겨 전송됨
        const { data } = await publicApi.post("/users/refresh-token"); // 수정됨
        const newToken = data.accessToken;

        document.cookie = `accessToken=${newToken}; path=/; samesite=strict`;

        // localStorage.setItem("accessToken", newToken); // 수정됨
        originalRequest.headers!["Authorization"] = `Bearer ${newToken}`; // 수정됨
        console.log("🔁 accessToken 재발급 완료, 요청 재시도");

        return authApi(originalRequest); // 수정됨
      } catch (refreshError) {
        console.log("❌ refreshToken 만료, 로그인 페이지로 이동");
        // 쿠키에서 토큰 제거
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * 2) publicApi: 인증 없이 호출해야 하는 엔드포인트 전용
 */
export const publicApi = axios.create({
  baseURL: "/proxy",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,   // 수정됨: 사업자번호 인증 등 쿠키 필요 시 자동 전송
});

export const logout = async (): Promise<void> => {
  try {
    // 백엔드에 로그아웃 요청 (서버에서 쿠키 제거)
    await publicApi.post("/users/logout");
    console.log("✅ 로그아웃 완료");
  } catch (error) {
    console.error("로그아웃 요청 실패:", error);
  } finally {
    // 백엔드에서 쿠키를 제거하므로 로그인 페이지로 리다이렉트
    window.location.href = "/login";
  }
};