"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EstimateProgressHeader from "@/components/common/EstimateHeader";
import Button from "@/components/common/Button";
import AddressSearchButton from "@/components/common/AddressSearchButton";

export default function FromDetailPage() {
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [buildingType, setBuildingType] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [floor, setFloor] = useState<string | null>(null);
  const [parking, setParking] = useState<"가능" | "불가능" | null>(null);

  const buildingTypes = ["빌라/연립", "아파트", "주택", "오피스텔", "상가"];
  const roomTypes = ["원룸", "1.5룸", "2룸", "3룸 이상"];
  const areaOptions = [
    "10평 이하",
    "10-15평",
    "15-20평",
    "20-25평",
    "25-30평",
    "50평 이상",
  ];
  const floorOptions = ["1층", "2~3층", "4~5층", "5층 이상", "반지하"];

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
      <EstimateProgressHeader step={3} title="출발지 상세" />

      <main className="flex-1 px-4 py-6 space-y-6">
        {/* 출발지 기본 주소 */}
        <div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              출발지 주소
            </label>
            <AddressSearchButton
              onAddressSelected={(addr) => setAddress(addr)}
            />
            {address && <p className="mt-2 text-sm text-gray-700">{address}</p>}
          </div>
        </div>

        {/* 상세주소 입력 */}
        <input
          type="text"
          placeholder="상세 주소 입력 (동/호수 등)"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] text-sm text-left text-gray-500"
        />

        {/* 건물 유형 선택 */}
        <section>
          <h4 className="text-sm font-medium mb-2 text-gray-700">건물 종류</h4>
          <div className="grid grid-cols-3 gap-2">
            {buildingTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setBuildingType(type)}
                className={`px-3 py-2 text-sm rounded-full border ${
                  buildingType === type
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* 방 구조 선택 */}
        <section>
          <h4 className="text-sm font-medium mb-2 text-gray-700">방 구조</h4>
          <div className="grid grid-cols-3 gap-2">
            {roomTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setRoomType(type)}
                className={`px-3 py-2 text-sm rounded-full border ${
                  roomType === type
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* 평수 선택 */}
        <section>
          <h4 className="text-sm font-medium mb-2 text-gray-700">평수</h4>
          <select
            value={area || ""}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm bg-white"
          >
            <option value="" disabled>
              평수를 선택하세요
            </option>
            {areaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>

        {/* 층수 선택 */}
        <section>
          <h4 className="text-sm font-medium mb-2 text-gray-700">층수</h4>
          <select
            value={floor || ""}
            onChange={(e) => setFloor(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm bg-white"
          >
            <option value="" disabled>
              층수를 선택하세요
            </option>
            {floorOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>

        {/* 주차 가능 여부 */}
        <section>
          <h4 className="text-sm font-medium mb-2 text-gray-700">
            주차 가능 여부
          </h4>
          <div className="flex gap-2">
            {["가능", "불가능"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setParking(option as "가능" | "불가능")}
                className={`flex-1 py-2 rounded-full border text-sm ${
                  parking === option
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      </main>

      <div className="px-4 py-6">
        <Button
          onClick={() => {
            router.push("/estimate/step4");
          }}
          disabled={
            !detailAddress ||
            !buildingType ||
            !roomType ||
            !area ||
            !floor ||
            !parking
          }
        >
          다음
        </Button>
      </div>
    </div>
  );
}
