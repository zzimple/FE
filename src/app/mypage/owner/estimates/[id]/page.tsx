"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";

export default function Step7Review() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [truckCount, setTruckCount] = useState("");
  const [message, setMessage] = useState("");

  const reviewData = {
    serviceType: "가정이사",
    dateTime: "2025.05.31(토) 오후 12:00",
    from: {
      address: "서울특별시 성북구 서경로 124(정릉동) 북악관 211호",
      info: "빌라/연립 | 10평 이하 | 2층",
    },
    to: {
      address: "서울특별시 강남구 테헤란로 223 큰길타워빌딩 10층",
      info: "빌라/연립 | 5평 이상 | 10층",
    },
    boxCount: 5,
    itemCount: 2,
    memo: "차량 동승 가능 여부를 알고 싶어요.",
    notes: [
      "사전에 협의되지 않은 항목은 서비스 당일 추가금이 발생할 수 있습니다.",
      "견적 요청 후 24시간 동안 견적서를 받습니다.",
      "제출 후 내용을 수정할 수 없습니다.",
    ],
  };

  const pillClass =
    "flex items-center h-14 px-5 gap-2 rounded-full border border-gray-300 bg-white w-full";

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white">
      <main className="flex-1 px-4 py-6 space-y-5">
        <h2 className="text-center text-lg font-semibold text-gray-900 mb-6">
          <span className="text-blue-500">김채린님</span>의 견적서
        </h2>

        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900 pl-1">
            서비스 타입
          </div>
          <div className={pillClass}>
            <span className="text-sm">{reviewData.serviceType}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900 pl-1">
            예약 날짜 및 시간
          </div>
          <div className={pillClass}>
            <span className="text-sm">{reviewData.dateTime}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900 pl-1">출발지</div>
          <div className={pillClass}>
            <span className="text-sm">{reviewData.from.address}</span>
          </div>
          <p className="text-xs text-blue-500 pl-1">{reviewData.from.info}</p>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900 pl-1">도착지</div>
          <div className={pillClass}>
            <span className="text-sm">{reviewData.to.address}</span>
          </div>
          <p className="text-xs text-blue-500 pl-1">{reviewData.to.info}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={pillClass}>
            <span className="flex-1 text-sm text-gray-600">짐 박스</span>
            <span className="text-sm text-gray-900">{reviewData.boxCount}</span>
          </div>
          <div className={pillClass}>
            <span className="flex-1 text-sm text-gray-600">짐 목록</span>
            <span className="text-sm text-gray-900">
              {reviewData.itemCount}개
            </span>
          </div>
        </div>

        <div className={pillClass + " h-auto py-4"}>
          <span className="flex-1 text-sm text-gray-600">메모</span>
          <span className="text-sm text-gray-900">{reviewData.memo}</span>
        </div>

        {/* 지도 영역 */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            최적 경로 추천
          </p>
          <div className="w-full h-60 rounded-lg overflow-hidden border border-gray-300">
            <iframe
              // src="https://map.kakao.com/?..."
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* 트럭 개수 입력 */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">트럭 개수</label>
          <input
            type="number"
            placeholder="예상하는 트럭 개수를 입력해주세요."
            value={truckCount}
            onChange={(e) => setTruckCount(e.target.value)}
            className="w-full h-14 px-4 rounded-full border border-gray-300 text-sm"
          />
        </div>

        {/* 사장님 전달사항 */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            + 사장님 전달사항
          </label>
          <textarea
            placeholder="고객님께 전달할 말을 작성해주세요."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm resize-none"
          ></textarea>
        </div>
      </main>

      <div className="px-4 py-4">
        <Button
          className="w-full h-14"
          onClick={() => router.push("/estimate/complete")}
        >
          확인
        </Button>
      </div>
    </div>
  );
}
