"use client";

import React, { useState, useEffect } from "react";
import { authApi } from "@/lib/axios";
import PasswordEditor from "@/components/mypage/PasswordEditor";
import EmailEditor from "@/components/mypage/EmailEditor";

export default function StaffProfilePage() {
  const [centerCode, setCenterCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 7) return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7, 11)}`;
  };

  const handleRequestCenterVerification = async () => {
    if (!centerCode.trim()) {
      alert("센터 코드(사장님 번호)를 입력해주세요.");
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationMessage(null);
      const res = await authApi.post("/staff/request", {
        ownerPhoneNumber: centerCode.trim(),
      });
      setVerificationMessage(res.data.message || "인증 요청이 성공적으로 전송되었습니다.");
    } catch (err: any) {
      console.error("센터 인증 요청 실패", err);
      const msg = err.response?.data?.message || "인증 요청 중 오류가 발생했습니다.";
      setVerificationMessage(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const [profile, setProfile] = useState({
    name: "",
    login_id: "",
    email: "",
    storeName: "",
    ownerPhoneNum: "",
    ownerName: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.get("/staff/profile");
        if (res.data.success) {
          setProfile({
            name: res.data.data.name,
            login_id: res.data.data.login_id,
            email: res.data.data.email || "",
            storeName: res.data.data.storeName || "",
            ownerPhoneNum: res.data.data.ownerPhoneNum || "",
            ownerName: res.data.data.ownerName || ""
          });
        }
      } catch (e) {
        console.error("프로필 정보 조회 실패", e);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* 기본 정보 섹션 */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold">기본 정보</h2>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              이름<span className="text-pink-500 ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={profile.name}
              disabled
              className="w-full h-14 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none"
            />
          </div>

          {/* 아이디 */}
          <div>
            <label className="block text-sm font-medium mb-2">아이디</label>
            <input
              type="text"
              value={profile.login_id}
              disabled
              className="w-full h-14 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none"
            />
          </div>

          {/* 비밀번호 변경 */}
          <PasswordEditor />

          {/* 이메일 변경 */}
          <EmailEditor
            email={profile.email}
            setEmail={(newEmail) =>
              setProfile((prev) => ({ ...prev, email: newEmail }))
            }
          />

          <div className="h-px bg-gray-200 my-6" />
          <h2 className="text-lg font-semibold">인증요청</h2>

          {/* 소속 센터 */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              소속 센터
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="소속 센터 사장님 번호 입력"
                value={centerCode}
                onChange={(e) => setCenterCode(formatPhoneNumber(e.target.value))}
                className="w-full h-14 px-4 pr-28 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2988FF]"
              />
              <button
                type="button"
                onClick={handleRequestCenterVerification}
                disabled={isVerifying}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-8 px-3 rounded-full bg-blue-50 text-[#2988FF] text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                {isVerifying ? "인증 중..." : "인증요청"}
              </button>
            </div>
            {verificationMessage && (
              <p className="mt-2 text-sm text-[#2988FF]">{verificationMessage}</p>
            )}
          </div>

          <div className="h-px bg-gray-200 my-6" />
          <h2 className="text-lg font-semibold">회사 정보</h2>

          <div>
            <label className="block text-sm font-medium mb-2">
              사장님 이름
            </label>
            <input
              type="text"
              value={profile.ownerName}
              disabled
              className="w-full h-14 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none"
            />
          </div>

          {/* 소속 매장명 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              소속 매장명
            </label>
            <input
              type="text"
              value={profile.storeName}
              disabled
              className="w-full h-14 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none"
            />
          </div>

          {/* 사장님 전화번호 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              사장님 전화번호
            </label>
            <input
              type="text"
              value={formatPhoneNumber(profile.ownerPhoneNum)}
              disabled
              className="w-full h-14 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none"
            />
          </div>

        </section>
      </div>
    </div>
  );
} 