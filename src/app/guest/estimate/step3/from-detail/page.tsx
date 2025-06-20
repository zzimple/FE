"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EstimateProgressHeader from "@/components/common/EstimateHeader";
import Button from "@/components/common/Button";
import AddressSearchButton from "@/components/common/AddressSearchButton";
import { authApi } from "@/lib/axios";
import { saveFromAddressToCookie } from "@/utils/cookies";

type JusoCallbackType = {
  roadFullAddr: string;
  roadAddrPart1: string;
  addrDetail: string;
  zipNo: string;
  entX: string;
  entY: string;
};

declare global {
  interface Window {
    onJusoCallback: (data: JusoCallbackType) => void;
  }
}

export {};

export default function FromDetailPage() {
  const router = useRouter();

  const [roadFullAddr, setRoadFullAddr] = useState("");
  const [roadAddrPart1, setRoadAddrPart1] = useState("");
  const [addrDetail, setAddrDetail] = useState("");
  const [zipNo, setZipNo] = useState("");
  // const [entX, setEntX] = useState<string | null>(null);
  // const [entY, setEntY] = useState<string | null>(null);
  const [entX, setEntX] = useState<string>(""); // 초기값 ""로 설정
  const [entY, setEntY] = useState<string>("");

  const [buildingType, setBuildingType] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [floor, setFloor] = useState<string | null>(null);
  const [parking, setParking] = useState<"가능" | "불가능" | null>(null);
  const [stairs, setStairs] = useState<boolean | null>(null);
  const [elevator, setElevator] = useState<boolean | null>(null);

  const buildingTypes = [
    { value: "VILLA", label: "빌라/연립" },
    { value: "APARTMENT", label: "아파트" },
    { value: "HOUSE", label: "주택" },
    { value: "OFFICETEL", label: "오피스텔" },
    { value: "COMMERCIAL", label: "상가/사무실" },
  ];
  const roomTypes = [
    { value: "ONE_ROOM", label: "원룸" },
    { value: "ONE_HALF_ROOM", label: "1.5룸" },
    { value: "TWO_ROOM", label: "2룸" },
    { value: "THREE_ROOM_OR_MORE", label: "3룸 이상" },
  ];
  const areaOptions = [
    "10평 이하",
    "10-15평",
    "15-20평",
    "20-25평",
    "25-30평",
    "50평 이상",
  ];
  const floorOptions = ["1층", "2~3층", "4~5층", "5층 이상", "반지하"];

  useEffect(() => {
    window.onJusoCallback = ({
      roadFullAddr,
      roadAddrPart1,
      addrDetail,
      zipNo,
      entX,
      entY,
    }: JusoCallbackType) => {
      console.log("주소 좌표: ", { entX, entY });
      setRoadFullAddr(roadFullAddr);
      setRoadAddrPart1(roadAddrPart1);
      setAddrDetail(addrDetail);
      setZipNo(zipNo);
      setEntX(entX);
      setEntY(entY);
    };
  }, []);

  const handleNext = async () => {
    const draftId = localStorage.getItem("uuid");
    if (!draftId) return alert("견적서 ID가 없습니다.");

    const fromAddress = {
      address: {
        roadFullAddr,
        roadAddrPart1,
        addrDetail,
        zipNo,
        entX: entX ?? "",
        entY: entY ?? "",
      },
      detailInfo: {
        buildingType: buildingType ?? "",
        roomStructure: roomType ?? "",
        sizeOption: area ?? "",
        floor: floor ?? "",
        hasStairs: stairs ?? false,
        hasParking: parking === "가능",
        elevator: elevator ?? false,
      },
    };

    try {
      saveFromAddressToCookie(fromAddress);

      const response = await authApi.post(
        `/estimates/draft/address?draftId=${draftId}`,
        { fromAddress }
      );

      if (response.data?.message) {
        router.push("/guest/estimate/step3/to-detail");
      } else {
        alert("주소 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("주소 저장 중 에러:", error);
      alert("주소 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <EstimateProgressHeader step={3} title="출발지 상세" />
      <div className="mt-16" />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
            {/* 왼쪽 컬럼: 주소, 건물종류, 방구조, 평수 */}
            <div className="flex flex-col gap-6 md:gap-8 min-w-0 max-w-full">
              {/* 주소 카드 */}
              <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6 min-w-0 max-w-full">
                <label className="text-base md:text-lg font-semibold text-gray-700 mb-2 block">
                  출발지 주소
                </label>
                <AddressSearchButton
                  onAddressSelect={({
                    roadFullAddr,
                    roadAddrPart1,
                    addrDetail,
                    zipNo,
                    entX,
                    entY,
                  }) => {
                    setRoadFullAddr(roadFullAddr);
                    setRoadAddrPart1(roadAddrPart1);
                    setAddrDetail(addrDetail);
                    setZipNo(zipNo);
                    setEntX(entX);
                    setEntY(entY);
                  }}
                />
                <input
                  type="text"
                  value={roadAddrPart1}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl bg-white text-base"
                  placeholder="도로명 주소"
                />
                <input
                  type="text"
                  value={addrDetail}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl bg-white text-base"
                  placeholder="상세 주소 (동/호수 등)"
                />
                <input
                  type="text"
                  value={zipNo}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl bg-white text-base"
                  placeholder="우편번호"
                />
              </div>
              {/* 건물유형 카드 */}
              <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6 min-w-0 max-w-full">
                <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                  건물 종류
                </h4>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {buildingTypes.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setBuildingType(value)}
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${
                        buildingType === value
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* 방구조 카드 */}
              <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6 min-w-0 max-w-full">
                <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                  방 구조
                </h4>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {roomTypes.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRoomType(value)}
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${
                        roomType === value
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* 평수 카드 */}
              <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6 min-w-0 max-w-full">
                <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                  평수
                </h4>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {areaOptions.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setArea(label)}
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${
                        area === label
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* 오른쪽 컬럼: 층수, 주차, 엘리베이터, 계단 */}
            <div className="flex flex-col gap-6 md:gap-8 min-w-0 max-w-full">
              {/* 층수 카드 */}
              <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6 min-w-0 max-w-full">
                <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                  층수
                </h4>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {floorOptions.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setFloor(label)}
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${
                        floor === label
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* 주차 카드 */}
              <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6 min-w-0 max-w-full">
                <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                  주차 가능 여부
                </h4>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {["가능", "불가능"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setParking(option as "가능" | "불가능")}
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${
                        parking === option
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              {/* 엘리베이터 카드 */}
              <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6 min-w-0 max-w-full">
                <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                  엘리베이터 여부
                </h4>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => setElevator(val)}
                      className={`w-full px-3 py-3 tDext-base rounded-xl border font-medium transition-all duration-200 ${
                        elevator === val
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                      }`}
                    >
                      {val ? "있음" : "없음"}
                    </button>
                  ))}
                </div>
              </div>
              {/* 계단 카드 */}
              <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6 min-w-0 max-w-full">
                <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                  계단 여부
                </h4>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => setStairs(val)}
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${
                        stairs === val
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                      }`}
                    >
                      {val ? "있음" : "없음"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full mt-12">
            <Button
              onClick={handleNext}
              disabled={false}
              className="w-full max-w-md h-16 rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition"
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
