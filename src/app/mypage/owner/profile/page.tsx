"use client";

import React, { useState, useEffect } from "react";
import { authApi } from "@/lib/axios";

import ExtraChargeSetting from "@/components/mypage/owner/ExtraChargeSetting";
import BasicItemPriceShortcut from "@/components/mypage/owner/BasicItemPriceShortcut";
import PasswordEditor from "@/components/mypage/PasswordEditor";
import EmailEditor from "@/components/mypage/EmailEditor";

export default function OwnerProfilePage() {
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

  const [profile, setProfile] = useState({
    name: "",
    login_id: "",
    email: "",
    address: {
      roadFullAddr: "",
      zipNo: "",
      addrDetail: ""
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.get("/owner/profile");
        if (res.data.success) {
          setProfile({
            name: res.data.data.name,
            login_id: res.data.data.login_id,
            email: res.data.data.email || "",
            address: {
              roadFullAddr: res.data.data.roadFullAddr || "",
              zipNo: res.data.data.zipNo || "",
              addrDetail: res.data.data.addrDetail || ""
            }
          });
        }
      } catch (e) {
        console.error("프로필 정보 조회 실패", e);
      }
    };

    fetchProfile();
  }, []);


  const handleChargeChange = (field: keyof typeof charges, value: string) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    setCharges((prev) => ({ ...prev, [field]: numericValue }));
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <div className="space-y-8">
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

          {/* 도로명 주소 */}
          <div>
            <label className="block text-sm font-medium mb-2">도로명 주소</label>
            <input
              type="text"
              value={profile.address.roadFullAddr}
              disabled
              className="w-full h-14 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none"
            />
          </div>

          {/* 상세 주소 */}
          <div>
            <label className="block text-sm font-medium mb-2">상세 주소</label>
            <input
              type="text"
              value={profile.address.addrDetail}
              disabled
              className="w-full h-14 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none"
            />
          </div>

          {/* 우편번호 */}
          <div>
            <label className="block text-sm font-medium mb-2">우편번호</label>
            <input
              type="text"
              value={profile.address.zipNo}
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
        </section>

        {/* 추가금 설정 */}
        <ExtraChargeSetting
          charges={charges}
          editing={editingCharges}
          onChange={handleChargeChange}
          onEditToggle={handleChargesEdit}
        />

        {/* 물품 기본금 설정 */}
        <BasicItemPriceShortcut />
      </div>
    </div>
  );
} 