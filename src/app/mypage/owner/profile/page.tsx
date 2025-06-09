"use client";

import React, { useState, useEffect } from "react";
import { authApi } from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function StaffProfilePage() {
  const router = useRouter();
  const [editingPassword, setEditingPassword] = useState(false);
  const [password, setPassword] = useState("********");
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState("kitty83@naver.com");
  const [centerCode, setCenterCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [editingCharges, setEditingCharges] = useState(false);
  const [charges, setCharges] = useState({
    perTruckCharge: 0,
    holidayCharge: 0,
    goodDayCharge: 0,
    weekendCharge: 0
  });

  // 페이지 로드 시 저장된 추가금 설정 가져오기
  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const response = await authApi.get("/owner/my/price-setting");
        if (response.data.success) {
          setCharges({
            perTruckCharge: response.data.data.perTruckCharge || 0,
            holidayCharge: response.data.data.holidayCharge || 0,
            goodDayCharge: response.data.data.goodDayCharge || 0,
            weekendCharge: response.data.data.weekendCharge || 0
          });
        }
      } catch (error) {
        console.error("추가금 설정 조회 실패:", error);
      }
    };

    fetchCharges();
  }, []);

  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 7) return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7, 11)}`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('ko-KR');
  };

  const handleChargeChange = (field: keyof typeof charges, value: string) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setCharges(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleChargesEdit = async () => {
    if (editingCharges) {
      try {
        const response = await authApi.post("/owner/my/price-setting", {
          perTruckCharge: charges.perTruckCharge,
          holidayCharge: charges.holidayCharge,
          goodDayCharge: charges.goodDayCharge,
          weekendCharge: charges.weekendCharge
        });

        if (response.data.success) {
          // alert(response.data.message || "추가금 설정이 저장되었습니다.");
          setEditingCharges(false);
        } else {
          throw new Error(response.data.message || "저장에 실패했습니다.");
        }
      } catch (error: any) {
        console.error("추가금 설정 저장 실패:", error);
        alert(error.response?.data?.message || "저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } else {
      setEditingCharges(true);
    }
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

      {/* 추가금 설정 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium">
            추가금 설정<span className="text-pink-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleChargesEdit}
            className="text-xs text-[#2948FF] hover:text-blue-700 transition-colors"
          >
            {editingCharges ? "저장" : "변경하기"}
          </button>
        </div>
        <div className="space-y-3">
          <div className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${editingCharges ? 'bg-white border border-[#2948FF]' : 'bg-gray-50'}`}>
            <span className="text-sm text-gray-600">트럭 1대당</span>
            <input
              type="text"
              value={formatNumber(charges.perTruckCharge) + "원"}
              onChange={(e) => handleChargeChange('perTruckCharge', e.target.value)}
              disabled={!editingCharges}
              className={`text-right text-sm w-24 outline-none ${editingCharges ? 'bg-white text-[#2948FF] font-medium' : 'bg-transparent text-gray-900'}`}
            />
          </div>
          <div className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${editingCharges ? 'bg-white border border-[#2948FF]' : 'bg-gray-50'}`}>
            <span className="text-sm text-gray-600">공휴일</span>
            <input
              type="text"
              value={formatNumber(charges.holidayCharge) + "원"}
              onChange={(e) => handleChargeChange('holidayCharge', e.target.value)}
              disabled={!editingCharges}
              className={`text-right text-sm w-24 outline-none ${editingCharges ? 'bg-white text-[#2948FF] font-medium' : 'bg-transparent text-gray-900'}`}
            />
          </div>
          <div className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${editingCharges ? 'bg-white border border-[#2948FF]' : 'bg-gray-50'}`}>
            <span className="text-sm text-gray-600">손 없는 날</span>
            <input
              type="text"
              value={formatNumber(charges.goodDayCharge) + "원"}
              onChange={(e) => handleChargeChange('goodDayCharge', e.target.value)}
              disabled={!editingCharges}
              className={`text-right text-sm w-24 outline-none ${editingCharges ? 'bg-white text-[#2948FF] font-medium' : 'bg-transparent text-gray-900'}`}
            />
          </div>
          <div className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${editingCharges ? 'bg-white border border-[#2948FF]' : 'bg-gray-50'}`}>
            <span className="text-sm text-gray-600">주말</span>
            <input
              type="text"
              value={formatNumber(charges.weekendCharge) + "원"}
              onChange={(e) => handleChargeChange('weekendCharge', e.target.value)}
              disabled={!editingCharges}
              className={`text-right text-sm w-24 outline-none ${editingCharges ? 'bg-white text-[#2948FF] font-medium' : 'bg-transparent text-gray-900'}`}
            />
          </div>
        </div>
      </div>

      {/* 물품 기본금 설정 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          물품 기본금 설정
        </label>
        <div 
          onClick={() => router.push("/mypage/owner/basicprice")}
          className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <span className="text-sm text-gray-600">기본금 설정하러 가기</span>
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
} 