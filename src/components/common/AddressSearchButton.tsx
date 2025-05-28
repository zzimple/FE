"use client";

import { useEffect } from "react";

type Props = {
  onAddressSelected: (address: string) => void;
};

declare global {
  interface Window {
    daum: any;
  }
}

export default function AddressSearchButton({ onAddressSelected }: Props) {
  useEffect(() => {
    // 클라이언트 환경에서만 스크립트 로드
    if (typeof window !== "undefined" && !window.daum) {
      const script = document.createElement("script");
      script.src =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleClick = () => {
    if (typeof window !== "undefined" && window.daum) {
      new window.daum.Postcode({
        oncomplete: function (data: any) {
          const fullAddress = data.address;
          onAddressSelected(fullAddress);
        },
      }).open();
    } else {
      alert("주소 검색 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full px-4 py-3 rounded-xl border text-left text-gray-900 bg-gray-100"
    >
      주소 검색
    </button>
  );
}
