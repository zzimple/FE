"use client";

import React, { useEffect, useState } from "react";
import { authApi } from '@/lib/axios';
import PasswordEditor from '@/components/mypage/PasswordEditor';
import EmailEditor from '@/components/mypage/EmailEditor';
import GuestHeader from '@/components/headers/GuestHeader';

interface UserProfile {
  id: number;
  userName: string;
  phoneNumber: string;
  email: string;
  loginId: string;
}

export default function GuestProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await authApi.get('/users/profile');
        setProfile(res.data);
      } catch (e: any) {
        setError('프로필 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">로딩 중...</div>;
  }
  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }
  if (!profile) {
    return <div className="text-center mt-20 text-gray-500">프로필 정보가 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuestHeader />
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
        {/* 기본 정보 섹션 */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold">기본 정보</h2>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              이름
            </label>
            <input
              type="text"
              value={profile.userName}
              disabled
              className="w-full h-14 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none"
            />
          </div>

          {/* 아이디 */}
          <div>
            <label className="block text-sm font-medium mb-2">아이디</label>
            <input
              type="text"
              value={profile.loginId}
              disabled
              className="w-full h-14 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none"
            />
          </div>

          {/* 비밀번호 변경 */}
          <PasswordEditor />

          {/* 이메일 변경 */}
          <EmailEditor
            email={profile.email ?? ""}
            setEmail={(newEmail) =>
              setProfile((prev) => prev ? { ...prev, email: newEmail } : prev)
            }
          />

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-medium mb-2">전화번호</label>
            <input
              type="text"
              value={profile.phoneNumber}
              disabled
              className="w-full h-14 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none"
            />
          </div>
        </section>
      </div>
    </div>
    </div>
  );
}
