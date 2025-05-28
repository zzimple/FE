"use client";

import { useState, useEffect } from "react";
import AddressSearchButton from "@/components/common/AddressSearchButton";

export default function AddressPage() {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const result = localStorage.getItem("address_result");
    console.log("📦 저장된 주소 데이터:", result);
    if (result) {
      const data = JSON.parse(result);
      setAddress(data.roadFullAddr);
      localStorage.removeItem("address_result");
    }
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">주소 입력 페이지</h1>
      <AddressSearchButton onAddressSelected={(addr) => setAddress(addr)} />
      <p className="mt-4 text-gray-700">{address || "주소를 선택해주세요."}</p>
    </div>
  );
}
