// import axios from "axios";

// const api = axios.create({
//     baseURL: 'http://14.63.178.146:8080', // 백엔드 주소
//     headers: { 'Content-Type': 'application/json' },
// });

// // 요청 시마다 토큰 자동 설정 모든 요청에 자동으로 Authorization 헤더가 붙음
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//         console.log("토큰 저장 완료", localStorage.getItem('accessToken'));
//     }
//     return config;
// });

// export default api;

// ─── lib/axios.ts ────────────────────────────────────────────────────────────────

import axios from "axios";

/**
 * 1) authApi: 매 요청마다 accessToken을 자동으로 헤더에 붙여줍니다.
 */
export const authApi = axios.create({
  baseURL: "http://14.63.178.146:8080",
  headers: { "Content-Type": "application/json" },
});

// 인터셉터를 통해 localStorage에서 꺼낸 accessToken을 Authorization 헤더에 세팅
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
    console.log("🔐 authApi: Authorization 헤더 설정 완료", token);
  }
  return config;
});

/**
 * 2) publicApi: 인터셉터를 아예 등록하지 않아서, Authorization 헤더가 전혀 붙지 않습니다.
 *    → 사업자번호 인증, 회원가입, 토큰 재발급 등 “인증 없이 호출해야 하는” 엔드포인트에 사용.
 */
export const publicApi = axios.create({
  baseURL: "http://14.63.178.146:8080",
  headers: { "Content-Type": "application/json" },
});

// ────────────────────────────────────────────────────────────────────────────────

// 👉 401 에러시 refreshToken으로 재발급 + 재요청 (응답 인터셉터)
authApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 등으로 401 응답이 왔고, 아직 재시도 안 한 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그

      try {
        const res = await publicApi.post(
          "/users/refresh-token",
          null,
          { withCredentials: true }
        );
        
        const newAccessToken = res.data.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        console.log("🔁 accessToken 재발급 후 재요청");
        return authApi(originalRequest); // 재요청
      } catch (refreshError) {
        console.log("❌ refreshToken 만료, 로그인 페이지로 이동");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
