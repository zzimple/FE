"use client";

import React, { useState } from "react";

export default function StaffProfilePage() {
  const [editingPassword, setEditingPassword] = useState(false);
  const [password, setPassword] = useState("********");
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState("kitty83@naver.com");
  const [centerCode, setCenterCode] = useState("");

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

  return (
    <div className="p-4">
      <h1 className="text-center text-xl font-bold mb-6">마이페이지</h1>

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

      {/* 이메일 */}
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
          onClick={() => setEditingEmail(!editingEmail)}
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
          onChange={(e) => setCenterCode(e.target.value)}
          className="w-full h-14 px-4 pr-28 rounded-full border border-gray-300 bg-gray-50 text-sm"
        />
        <button
          type="button"
          className="absolute right-4 top-10 inline-flex h-[28px] px-[10px] justify-center items-center gap-1 rounded-full bg-blue-100 text-blue-600 text-xs"
        >
          인증요청
        </button>
      </div>
    </div>
  );
}
