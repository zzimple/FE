"use client";

import { useEffect, useState } from "react";
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

export {};

export default function ToDetailPage() {
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
    "VILLA",
    "APARTMENT",
    "HOUSE",
    "OFFICETEL",
    "COMMERCIAL",
  ];
  const roomTypes = [
    "ONE_ROOM",
    "ONE_HALF_ROOM",
    "TWO_ROOM",
    "THREE_ROOM_OR_MORE",
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
      router.push("/estimate/step4");
    } catch (e) {
      console.error("주소 저장 실패", e);
      alert("도착지 정보 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
      <EstimateProgressHeader step={3} title="도착지 상세" />

      <main className="flex-1 px-4 py-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
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
        </div>

        <input
          type="text"
          value={roadAddrPart1}
          readOnly
          className="w-full px-4 py-2 rounded-xl bg-gray-100 text-sm"
          placeholder="도로명 주소"
        />
        <input
          type="text"
          value={addrDetail}
          readOnly
          className="w-full px-4 py-2 rounded-xl bg-gray-100 text-sm"
          placeholder="상세 주소 (동/호수 등)"
        />
        <input
          type="text"
          value={zipNo}
          readOnly
          className="w-full px-4 py-2 rounded-xl bg-gray-100 text-sm"
          placeholder="우편번호"
        />

        {/* 나머지 입력 필드 */}
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

        <section>
          <h4 className="text-sm font-medium mb-2 text-gray-700">
            엘리베이터 여부
          </h4>
          <div className="flex gap-2">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setElevator(val)}
                className={`flex-1 py-2 rounded-full border text-sm ${
                  elevator === val
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {val ? "있음" : "없음"}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-medium mb-2 text-gray-700">계단 여부</h4>
          <div className="flex gap-2">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setStairs(val)}
                className={`flex-1 py-2 rounded-full border text-sm ${
                  stairs === val
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {val ? "있음" : "없음"}
              </button>
            ))}
          </div>
        </section>
      </main>

      <div className="px-4 py-6">
        <Button
          onClick={handleNext}
          disabled={
            !roadFullAddr ||
            !buildingType ||
            !roomType ||
            !area ||
            !floor ||
            parking === null ||
            elevator === null ||
            stairs === null ||
            entX === "" ||
            entY === ""
          }
        >
          다음
        </Button>
      </div>
    </div>
  );
}