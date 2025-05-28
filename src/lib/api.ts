import axios from "axios";

const api = axios.create({
    baseURL: 'http://14.63.178.146:8080', // 백엔드 주소
    headers: { 'Content-Type': 'application/json' },
});

export default api;