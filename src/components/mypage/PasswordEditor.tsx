"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/axios";

export default function PasswordEditor() {
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = async () => {
    if (editing) {
      if (newPassword !== confirmPassword) {
        alert("새 비밀번호가 서로 일치하지 않습니다.");
        return;
      }
      try {
        await authApi.patch("/users/password", {
          currentPassword,
          newPassword,
        });
        alert("비밀번호가 변경되었습니다.");
        setEditing(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error: any) {
        alert(error.response?.data?.message || "비밀번호 변경에 실패했습니다.");
      }
    } else {
      setEditing(true);
    }
  };

  return (
    <div className="relative space-y-3">
      <label className="block text-sm font-medium mb-2">비밀번호 변경</label>
      {editing ? (
        <>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호"
              className="w-full h-14 px-4 pr-28 rounded-full border border-gray-200 bg-white text-sm"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-5 top-1/2 -translate-y-1/2"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호"
              className="w-full h-14 px-4 pr-28 rounded-full border border-gray-200 bg-white text-sm"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-5 top-1/2 -translate-y-1/2"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="새 비밀번호 확인"
              className="w-full h-14 px-4 pr-28 rounded-full border border-gray-200 bg-white text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-20 top-1/2 -translate-y-1/2"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button
              type="button"
              onClick={handleChange}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-8 px-3 rounded-full bg-blue-50 text-[#2988FF] text-sm font-medium hover:bg-blue-100"
            >
              변경
            </button>
          </div>
        </>
      ) : (
        <div className="relative">
          <input
            type="password"
            value="********"
            disabled
            className="w-full h-14 px-4 pr-28 rounded-full border border-gray-200 bg-gray-50 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 px-3 rounded-full bg-blue-50 text-[#2988FF] text-sm font-medium hover:bg-blue-100"
          >
            변경
          </button>
        </div>
      )}
    </div>
  );
}
