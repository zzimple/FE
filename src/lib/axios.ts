import axios from "axios";

const api = axios.create({
    baseURL: 'http://14.63.178.146:8080', // 백엔드 주소
    headers: { 'Content-Type': 'application/json' },
});

// 요청 시마다 토큰 자동 설정 모든 요청에 자동으로 Authorization 헤더가 붙음
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("토큰 저장 완료", localStorage.getItem('accessToken'));
    }
    return config;
});

export default api;