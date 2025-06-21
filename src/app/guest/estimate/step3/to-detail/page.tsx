"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import EstimateProgressHeader from "@/components/common/EstimateHeader";
import Button from "@/components/common/Button";
import AddressSearchButton from "@/components/common/AddressSearchButton";
import { authApi } from "@/lib/axios";
import {
  getFromAddressFromCookie,
  removeFromAddressCookie,
} from "@/utils/cookies";

interface JusoCallbackType {
  roadFullAddr: string;
  roadAddrPart1: string;
  addrDetail: string;
  zipNo: string;
  entX: string;
  entY: string;
}

declare global {
  interface Window {
    onJusoCallback: (addr: JusoCallbackType) => void;
  }
}

export { };

export default function ToDetailPage() {
  const router = useRouter();

  const [roadFullAddr, setRoadFullAddr] = useState("");
  const [roadAddrPart1, setRoadAddrPart1] = useState("");
  const [addrDetail, setAddrDetail] = useState("");
  const [zipNo, setZipNo] = useState("");

  const [entX, setEntX] = useState<string>(""); // 초기값 ""로 설정
  const [entY, setEntY] = useState<string>("");

  const [buildingType, setBuildingType] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [floor, setFloor] = useState<string | null>(null);
  const [parking, setParking] = useState<"가능" | "불가능" | null>(null);
  const [stairs, setStairs] = useState<boolean | null>(null);
  const [elevator, setElevator] = useState<boolean | null>(null);

  // --- 추가된 부분 시작 ---
  const isInitialMount = useRef(true);
  const isDataLoaded = useRef(false);

  // 페이지 로드 시 localStorage에서 데이터 복원
  useEffect(() => {
    if (isDataLoaded.current) return; // 이미 데이터를 로드했다면 중복 실행 방지

    const savedData = localStorage.getItem("toAddressDetail");
    if (savedData) {
      const parsedData: ToAddressState = JSON.parse(savedData);
      setRoadFullAddr(parsedData.roadFullAddr || "");
      setRoadAddrPart1(parsedData.roadAddrPart1 || "");
      setAddrDetail(parsedData.addrDetail || "");
      setZipNo(parsedData.zipNo || "");
      setEntX(parsedData.entX || "");
      setEntY(parsedData.entY || "");
      setBuildingType(parsedData.buildingType || null);
      setRoomType(parsedData.roomType || null);
      setArea(parsedData.area || null);
      setFloor(parsedData.floor || null);
      setParking(parsedData.parking || null);
      setStairs(parsedData.stairs || null);
      setElevator(parsedData.elevator || null);
    }
  }, []);

  // 수정: 상태 변경 시 localStorage에 데이터 저장 로직 개선
  useEffect(() => {
    // 첫 렌더링 시에는 저장 로직을 건너뛰어, 복원된 데이터가 초기화되는 것을 방지합니다.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // 수정: 데이터가 실제로 로드된 후에만 저장 로직 실행
    if (!isDataLoaded.current) return;

    const dataToSave: FromAddressState = {
      roadFullAddr,
      roadAddrPart1,
      addrDetail,
      zipNo,
      entX,
      entY,
      buildingType,
      roomType,
      area,
      floor,
      parking,
      stairs,
      elevator,
    };

    // 수정: 저장 전에 현재 localStorage의 데이터와 비교하여 실제 변경사항이 있는지 확인
    try {
      const existingData = localStorage.getItem("fromAddressDetail");
      if (existingData) {
        const parsedExisting = JSON.parse(existingData);
        // 실제로 변경된 데이터가 있는지 확인
        const hasChanges = JSON.stringify(parsedExisting) !== JSON.stringify(dataToSave);
        if (!hasChanges) return; // 변경사항이 없으면 저장하지 않음
      }

      localStorage.setItem("fromAddressDetail", JSON.stringify(dataToSave));
    } catch (error) {
      console.error("데이터 저장 중 오류:", error);
    }
  }, [
    roadFullAddr,
    roadAddrPart1,
    addrDetail,
    zipNo,
    entX,
    entY,
    buildingType,
    roomType,
    area,
    floor,
    parking,
    stairs,
    elevator,
  ]);

  // 상태 변경 시 localStorage에 데이터 저장
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const dataToSave: ToAddressState = {
      roadFullAddr,
      roadAddrPart1,
      addrDetail,
      zipNo,
      entX,
      entY,
      buildingType,
      roomType,
      area,
      floor,
      parking,
      stairs,
      elevator,
    };
    localStorage.setItem("toAddressDetail", JSON.stringify(dataToSave));
  }, [
    roadFullAddr,
    roadAddrPart1,
    addrDetail,
    zipNo,
    entX,
    entY,
    buildingType,
    roomType,
    area,
    floor,
    parking,
    stairs,
    elevator,
  ]);
  // --- 추가된 부분 끝 ---

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

    const fromAddress = getFromAddressFromCookie();
    if (!fromAddress) return alert("출발지 정보가 없습니다.");

    const toAddress = {
      address: {
        roadFullAddr,
        roadAddrPart1,
        addrDetail,
        zipNo,
        entX,
        entY,
      },
      detailInfo: {
        buildingType,
        roomStructure: roomType,
        sizeOption: area,
        floor,
        hasStairs: stairs,
        hasParking: parking === "가능",
        elevator,
      },
    };

    try {
      await authApi.post(`/estimates/draft/address?draftId=${draftId}`, {
        fromAddress,
        toAddress,
      });
      removeFromAddressCookie();
      router.push("/guest/estimate/step4");
    } catch (e) {
      console.error("주소 저장 실패", e);
      alert("도착지 정보 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <EstimateProgressHeader step={3} title="도착지 상세" />
      <div className="mt-8" />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
            {/* 왼쪽 컬럼: 주소, 건물종류, 방구조, 평수 */}
            <div className="flex flex-col gap-6 md:gap-8 min-w-0 max-w-full">
              {/* 주소 카드 */}
              <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6 min-w-0 max-w-full">
                <label className="text-base md:text-lg font-semibold text-gray-700 mb-2 block">
                  도착지 주소
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
                {roadAddrPart1 && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="font-semibold text-gray-500 text-sm">
                        도로명 주소
                      </div>
                      <div className="text-gray-800 mt-1">{roadAddrPart1}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-500 text-sm">
                        상세주소
                      </div>
                      <div className="text-gray-800 mt-1">{addrDetail}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-500 text-sm">
                        우편번호
                      </div>
                      <div className="text-gray-800 mt-1">{zipNo}</div>
                    </div>
                  </div>
                )}
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
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${buildingType === value
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
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${roomType === value
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
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${area === label
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
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${floor === label
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
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${parking === option
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
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${elevator === val
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
                      className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${stairs === val
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
              className="mb-8 mt-8 w-full max-w-md h-16 rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition"
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
