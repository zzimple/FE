// pages/login/page.tsx

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginId || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // withCredentials는 이미 publicApi에 설정되어 있습니다.
      const res = await authApi.post('/users/login', { loginId, password }); // 수정됨
      const { accessToken } = res.data.data;
      document.cookie = `accessToken=${accessToken}; path=/; samesite=strict`;
      router.push('/'); // 수정됨
    } catch (err: any) {
      const code = err.response?.data?.code;
      if (['LOGIN_ID_NOT_FOUND','USER_NOT_FOUND','INVALID_PASSWORD'].includes(code)) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.'); // 수정됨
      } else if (['STORE_NOT_FOUND','OWNER_NOT_FOUND'].includes(code)) {
        setError('매장 또는 사장님 정보를 찾을 수 없습니다.'); // 수정됨
      } else {
        setError(err.response?.data?.message || '로그인에 실패했습니다.'); // 수정됨
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md">
        {/* 타이틀 */}
        <h1 className="text-2xl font-bold mb-8 text-center">로그인</h1>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* 아이디 or 사업자 등록 번호 입력 */}
          <div className="space-y-2">
            <label htmlFor="loginId" className="block text-base font-medium">
              아이디 또는 사업자 등록 번호
            </label>
            <input
              id="loginId"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="아이디 입력"
              className="
                w-full
                border border-gray-300
                rounded-lg
                px-4 py-3
                text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition
              "
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-base font-medium">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="비밀번호 입력"
              className={`
                w-full
                border ${error ? 'border-red-500' : 'border-gray-300'}
                rounded-lg
                px-4 py-3
                text-sm
                focus:outline-none
                transition
                ${error
                  ? 'focus:ring-2 focus:ring-red-500'
                  : 'focus:ring-2 focus:ring-blue-500'
                }
              `}
            />
            {error && (
              <p className="flex items-center mt-2 text-sm text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-1v3a1 1 0 102 0v-3a1 1 0 10-2 0zm0-4a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full h-14
                rounded-lg
                text-base font-semibold text-white
                transition
                ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {loading ? '로그인 중...' : '로그인하기'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/signup/user-type')}
              className="
                w-full h-14
                bg-white
                border border-gray-300
                rounded-lg
                text-base font-semibold text-gray-800
                transition hover:bg-gray-100
              "
            >
              이메일로 가입하기
            </button>
          </div>
        </form>

        {/* 하단 추가 링크 */}
        <div className="flex justify-center mt-10 mb-10 space-x-8">
          <button
            type="button"
            onClick={() => router.push('/find-account')}
            className="text-gray-500 text-sm hover:text-gray-700 transition"
          >
            계정찾기
          </button>
          <button
            type="button"
            onClick={() => router.push('/find-password')}
            className="text-gray-500 text-sm hover:text-gray-700 transition"
          >
            비밀번호 찾기
          </button>
          <button
            type="button"
            onClick={() => router.push('/support')}
            className="text-gray-500 text-sm hover:text-gray-700 transition"
          >
            문의하기
          </button>
        </div>
      </div>
    </main>
  );
}
