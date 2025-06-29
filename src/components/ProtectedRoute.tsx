import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  allowed: string[];
  children: React.ReactNode;
}

// 쿠키에서 accessToken을 읽는 함수 (axios.ts와 동일)
const getAccessTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null; // SSR 방지
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith('accessToken=')) {
      return trimmedCookie.substring('accessToken='.length);
    }
  }
  return null;
};

export default function ProtectedRoute({ allowed, children }: ProtectedRouteProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = getAccessTokenFromCookie();
        console.log("🔍 토큰 확인:", token ? "토큰 존재" : "토큰 없음");

        if (!token) {
          console.log("토큰이 없습니다. 로그인 페이지로 이동합니다.");
          router.replace("/login");
          return;
        }

        // JWT에서 roles 추출
        let roles: string[] = [];
        try {
          const payload: any = jwtDecode(token);
          console.log("🔐 JWT 페이로드:", payload);
          
          // roles 필드 확인
          if (payload.roles) {
            roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
          } else if (payload.role) {
            roles = Array.isArray(payload.role) ? payload.role : [payload.role];
          } else if (payload.authorities) {
            roles = Array.isArray(payload.authorities) ? payload.authorities : [payload.authorities];
          } else {
            console.log("⚠️ JWT에 역할 정보가 없습니다:", payload);
            setAccessDenied(true);
            setUserRoles([]);
            setChecking(false);
            return;
          }
          
          setUserRoles(roles);
          console.log("📋 추출된 역할:", roles);
          console.log("✅ 허용된 역할:", allowed);
        } catch (e) {
          console.error("❌ JWT 디코딩 오류:", e);
          setAccessDenied(true);
          setUserRoles([]);
          setChecking(false);
          return;
        }

        // 역할 매칭 체크 (대소문자 구분 없이)
        const hasRole = roles.some(role => 
          allowed.some(allowedRole => 
            role.toUpperCase() === allowedRole.toUpperCase()
          )
        );

        console.log("🔍 권한 체크 결과:", hasRole);

        if (!hasRole) {
          console.log("❌ 권한이 없습니다. 필요한 역할:", allowed);
          setAccessDenied(true);
        }

        setChecking(false);
      } catch (error) {
        console.error("❌ 권한 체크 중 오류:", error);
        setAccessDenied(true);
        setUserRoles([]);
        setChecking(false);
      }
    };

    checkAuth();
  }, [router, allowed]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">권한을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    // 역할을 한글로 변환하는 함수
    const getRoleDisplayName = (role: string) => {
      switch (role.toUpperCase()) {
        case 'OWNER': return '사장';
        case 'STAFF': return '직원';
        case 'GUEST': return '손님';
        default: return role;
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">접근 권한이 없습니다</h1>
            <p className="text-gray-600 mb-4">
              이 페이지에 접근할 수 있는 권한이 없습니다.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-6 border">
            <h3 className="font-semibold text-gray-800 mb-2">권한 정보</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">필요한 권한:</span> {allowed.map(getRoleDisplayName).join(", ")}</p>
              <p><span className="font-medium">현재 권한:</span> {userRoles.length > 0 ? userRoles.map(getRoleDisplayName).join(", ") : "없음"}</p>
            </div>
          </div>
          
          <button 
            onClick={() => router.push("/")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            메인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
