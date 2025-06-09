"use client";

import React, { useState } from "react";
import { authApi } from "@/lib/axios";

export default function StaffProfilePage() {
  const [editingPassword, setEditingPassword] = useState(false);
  const [password, setPassword] = useState("********");
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState("kitty83@naver.com");
  const [centerCode, setCenterCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 7) return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7, 11)}`;
  };

  const handlePasswordChange = () => {
    if (editingPassword) {
      alert("비밀번호가 변경되었습니다.");
      setEditingPassword(false);
      setPassword("********");
    } else {
      setPassword("");
      setEditingPassword(true);
    }
  };

  const handleEmailChange = () => {
    if (editingEmail) {
      alert("이메일이 변경되었습니다.");
      setEditingEmail(false);
    } else {
      setEditingEmail(true);
    }
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

  return (
    <div className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto relative">
      {/* 이름 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          이름<span className="text-pink-500">*</span>
        </label>
        <input
          type="text"
          value="조연제"
          disabled
          className="w-full h-14 px-4 rounded-full border border-gray-300 bg-gray-50 text-sm"
        />
      </div>

      {/* 아이디 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">아이디</label>
        <input
          type="text"
          value="hellokitty83"
          disabled
          className="w-full h-14 px-4 rounded-full border border-gray-300 bg-gray-50 text-sm"
        />
      </div>

      {/* 비밀번호 */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium mb-1">
          비밀번호<span className="text-pink-500">*</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!editingPassword}
          className="w-full h-14 px-4 pr-28 rounded-full border border-gray-300 bg-white text-sm"
        />
        <button
          type="button"
          onClick={handlePasswordChange}
          className="absolute right-4 top-10 inline-flex h-[28px] px-[10px] justify-center items-center gap-1 rounded-full bg-blue-100 text-blue-600 text-xs"
        >
          {editingPassword ? "저장" : "변경하기"}
        </button>
      </div>

      {/* 이메일 주소 */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium mb-1">
          이메일 주소 (선택)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!editingEmail}
          className="w-full h-14 px-4 pr-28 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-400"
        />
        <button
          type="button"
          onClick={handleEmailChange}
          className="absolute right-4 top-10 inline-flex h-[28px] px-[10px] justify-center items-center gap-1 rounded-full bg-blue-100 text-blue-600 text-xs"
        >
          {editingEmail ? "저장" : "변경하기"}
        </button>
      </div>

      {/* 소속 센터 */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium mb-1">
          소속 센터<span className="text-pink-500">*</span>
        </label>
        <input
          type="text"
          placeholder="소속 센터 사장님 번호 입력"
          value={centerCode}
          onChange={(e) => setCenterCode(formatPhoneNumber(e.target.value))}
          className="w-full h-14 px-4 pr-28 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-400"
        />
        <button
          type="button"
          onClick={handleRequestCenterVerification}
          disabled={isVerifying}
          className="absolute right-4 top-10 inline-flex h-[28px] px-[10px] justify-center items-center gap-1 rounded-full bg-blue-100 text-blue-600 text-xs"
        >
          {isVerifying ? "인증 중…" : "인증요청"}
        </button>
        {verificationMessage && (
          <p className="text-sm text-blue-600 mt-2">{verificationMessage}</p>
        )}
      </div>
    </div>
  );
} 