"use client";

import Button from "@/components/common/Button";
import api from "@/lib/axios";
import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleNext = async () => {
    try {
      // ✅ UUID 및 토큰 발급 요청
      const res = await api.post("/estimates/draft/start");
      console.log("견적서 초안 응답:", res.data);

      const newUuid = res.data.data.draftId;
      console.log(newUuid)
      localStorage.setItem("uuid", newUuid); // uuid 저장

      if (res.data.token) {
        localStorage.setItem("accessToken", res.data.token); // 토큰 저장
        console.log("토큰 저장 완료");
      }

      // ✅ step1 페이지로 이동
      router.push("/estimate/step1");
    } catch (err) {
      console.error("초안 생성 실패:", err);
    }
  };

  return (
    <div>
      <div className="px-4 py-6">
        <Button onClick={handleNext} className="w-full">
          견적서 작성하러가기
        </Button>
      </div>
    </div>
  );
}
