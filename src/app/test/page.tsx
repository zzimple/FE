"use client";

import { useState } from "react";

export default function TestPage() {
  const [selected, setSelected] = useState<"small" | "family" | null>(null);

  return (
    <div className="min-h-screen p-6 space-y-4 bg-white">
      <h1 className="text-xl font-bold">테스트 페이지</h1>

      <div className="flex gap-2">
        <button
          onClick={() => {
            console.log("소형 클릭");
            setSelected("small");
          }}
          className={`flex-1 py-3 rounded-full border ${
            selected === "small"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-800 border-gray-300"
          }`}
        >
          소형이사
        </button>

        <button
          onClick={() => {
            console.log("가정 클릭");
            setSelected("family");
          }}
          className={`flex-1 py-3 rounded-full border ${
            selected === "family"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-800 border-gray-300"
          }`}
        >
          가정이사
        </button>
      </div>

      <div className="text-sm text-gray-600">
        선택된 값: <strong>{selected}</strong>
      </div>
    </div>
  );
}
