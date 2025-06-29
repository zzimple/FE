import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  allowed: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowed, children }: ProtectedRouteProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const token = getCookie("accessToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    // JWT에서 roles 추출
    let roles: string[] = [];
    try {
      const payload: any = jwtDecode(token as string);
      roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
    } catch (e) {
      setAccessDenied(true);
      setChecking(false);
      return;
    }

    // 대문자 체크
    const hasRole = roles.some(role => allowed.includes(role));
    if (!hasRole) {
      setAccessDenied(true);
    }

    setChecking(false);
  }, []);

  if (checking) return null;

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500 font-semibold">권한이 없습니다.</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div>권한이 없습니다.</div>
    );
  }
  return <>{children}</>;
}
