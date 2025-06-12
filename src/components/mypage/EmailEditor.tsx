"use client";

import { useState } from "react";
import { authApi } from "@/lib/axios";

interface EmailEditorProps {
  email: string;                
  setEmail: (email: string) => void;
}

export default function EmailEditor({ email, setEmail }: EmailEditorProps) { // ✅ 변경
  const [editing, setEditing] = useState(false);


  const isValidEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

 const handleEmailChange = async () => {
  if (editing) {
    if (!isValidEmailFormat(email)) {
      alert("올바른 이메일 형식을 입력해 주세요.");
      return;
    }

    try {
      const response = await authApi.patch("/users/email", { email });

      // ✅ 서버에서 success: true인 경우에만 성공 처리
      if (response.data?.success) {
        alert("이메일이 변경되었습니다.");
        setEditing(false);
      } else {
        // ✅ 서버에서 success: false 내려온 경우
        const serverMessage = response.data?.message || "이메일 변경에 실패했습니다.";
        alert(serverMessage);
      }
    } catch (error: any) {
      // ✅ 서버가 CustomException을 던질 경우 message만 추출하여 alert
      const errorMessage =
        error?.response?.data?.message || "이메일 변경에 실패했습니다.";
      alert(errorMessage);
    }
  } else {
    setEditing(true); // ✅ 편집 모드로 전환
  }
};


  return (
    <>
      <label className="block text-sm font-medium mb-2">이메일 주소</label>
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!editing}
          className="w-full h-14 px-4 pr-28 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2988FF]"
        />
        <button
          type="button"
          onClick={handleEmailChange}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-8 px-3 rounded-full bg-blue-50 text-[#2988FF] text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          {editing ? "저장" : "변경"}
        </button>
      </div>
    </>
  );
}
