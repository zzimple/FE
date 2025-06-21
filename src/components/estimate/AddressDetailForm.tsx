"use client";

import { useEffect, useState, useRef } from "react";
import Button from "@/components/common/Button";
import AddressSearchButton from "@/components/common/AddressSearchButton";

type JusoCallbackType = {
    roadFullAddr: string;
    roadAddrPart1: string;
    addrDetail: string;
    zipNo: string;
    entX: string;
    entY: string;
};

// State 타입을 정의합니다.
export type AddressDetailState = {
    roadFullAddr: string;
    roadAddrPart1: string;
    addrDetail: string;
    zipNo: string;
    entX: string;
    entY: string;
    buildingType: string | null;
    roomType: string | null;
    area: string | null;
    floor: string | null;
    parking: "가능" | "불가능" | null;
    stairs: boolean | null;
    elevator: boolean | null;
};

// Props 타입을 정의합니다.
interface AddressDetailFormProps {
    addressLabel: string;
    storageKey: string;
    onNext: (data: AddressDetailState) => void;
}

declare global {
    interface Window {
        onJusoCallback: (data: JusoCallbackType) => void;
    }
}

const initialAddressState: AddressDetailState = {
    roadFullAddr: "",
    roadAddrPart1: "",
    addrDetail: "",
    zipNo: "",
    entX: "",
    entY: "",
    buildingType: null,
    roomType: null,
    area: null,
    floor: null,
    parking: null,
    stairs: null,
    elevator: null,
};

export default function AddressDetailForm({
    addressLabel,
    storageKey,
    onNext,
}: AddressDetailFormProps) {
    const [state, setState] = useState<AddressDetailState>(() => {
        // 서버 사이드 렌더링(SSR) 중에는 window 객체가 존재하지 않으므로, 브라우저 환경인지 먼저 확인합니다.
        if (typeof window === "undefined") {
            return initialAddressState;
        }
        try {
            const savedData = localStorage.getItem(storageKey);
            // 저장된 데이터가 있으면 JSON으로 파싱해서 반환하고, 없으면 초기 상태를 반환합니다.
            return savedData ? JSON.parse(savedData) : initialAddressState;
        } catch (error) {
            console.error("데이터 복원 중 오류 발생:", error);
            return initialAddressState;
        }
    });

    // state가 변경될 때마다(사용자가 옵션을 선택할 때마다) localStorage에 자동으로 데이터를 저장합니다.
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
            console.error("데이터 저장 중 오류 발생:", error);
        }
    }, [state, storageKey]);


    // 주소 검색 콜백 설정
    useEffect(() => {
        window.onJusoCallback = ({
            roadFullAddr,
            roadAddrPart1,
            addrDetail,
            zipNo,
            entX,
            entY,
        }: JusoCallbackType) => {
            setState((prevState) => ({
                ...prevState,
                roadFullAddr,
                roadAddrPart1,
                addrDetail,
                zipNo,
                entX,
                entY,
            }));
        };
    }, []);

    const handleStateChange = (field: keyof AddressDetailState, value: any) => {
        setState((prevState) => ({ ...prevState, [field]: value }));
    };

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

    return (
        <div className="w-full max-w-4xl flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
                {/* 왼쪽 컬럼 */}
                <div className="flex flex-col gap-6 md:gap-8 min-w-0 max-w-full">
                    {/* 주소 카드 */}
                    <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6">
                        <label className="text-base md:text-lg font-semibold text-gray-700 mb-2 block">
                            {addressLabel}
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
                                setState((prevState) => ({
                                    ...prevState,
                                    roadFullAddr,
                                    roadAddrPart1,
                                    addrDetail,
                                    zipNo,
                                    entX,
                                    entY,
                                }));
                            }}
                        />
                        {state.roadAddrPart1 && (
                            <div className="mt-4 space-y-4">
                                <div>
                                    <div className="font-semibold text-gray-500 text-sm">
                                        도로명 주소
                                    </div>
                                    <div className="text-gray-800 mt-1">{state.roadAddrPart1}</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-500 text-sm">
                                        상세주소
                                    </div>
                                    <div className="text-gray-800 mt-1">{state.addrDetail}</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-500 text-sm">
                                        우편번호
                                    </div>
                                    <div className="text-gray-800 mt-1">{state.zipNo}</div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* 건물유형 카드 */}
                    <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6">
                        <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                            건물 종류
                        </h4>
                        <div className="grid grid-cols-2 gap-2 md:gap-4">
                            {buildingTypes.map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => handleStateChange("buildingType", value)}
                                    className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${state.buildingType === value
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
                    <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6">
                        <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                            방 구조
                        </h4>
                        <div className="grid grid-cols-2 gap-2 md:gap-4">
                            {roomTypes.map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => handleStateChange("roomType", value)}
                                    className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${state.roomType === value
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
                    <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6">
                        <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                            평수
                        </h4>
                        <div className="grid grid-cols-2 gap-2 md:gap-4">
                            {areaOptions.map((label) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => handleStateChange("area", label)}
                                    className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${state.area === label
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
                {/* 오른쪽 컬럼 */}
                <div className="flex flex-col gap-6 md:gap-8 min-w-0 max-w-full">
                    {/* 층수 카드 */}
                    <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6">
                        <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                            층수
                        </h4>
                        <div className="grid grid-cols-2 gap-2 md:gap-4">
                            {floorOptions.map((label) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => handleStateChange("floor", label)}
                                    className={`w-full px-3 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${state.floor === label
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* 주차가능여부 카드 */}
                    <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6">
                        <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                            주차 가능 여부
                        </h4>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => handleStateChange("parking", "가능")}
                                className={`flex-1 px-4 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${state.parking === "가능"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                                    }`}
                            >
                                가능
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStateChange("parking", "불가능")}
                                className={`flex-1 px-4 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${state.parking === "불가능"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                                    }`}
                            >
                                불가능
                            </button>
                        </div>
                    </div>
                    {/* 계단 이용 여부 */}
                    <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6">
                        <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                            계단 이용 여부
                        </h4>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => handleStateChange("stairs", true)}
                                className={`flex-1 px-4 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${state.stairs === true
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                                    }`}
                            >
                                예
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStateChange("stairs", false)}
                                className={`flex-1 px-4 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${state.stairs === false
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                                    }`}
                            >
                                아니오
                            </button>
                        </div>
                    </div>
                    {/* 엘리베이터 유무 */}
                    <div className="bg-white border border-blue-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col gap-4 md:gap-6">
                        <h4 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                            엘리베이터 유무
                        </h4>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => handleStateChange("elevator", true)}
                                className={`flex-1 px-4 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${state.elevator === true
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                                    }`}
                            >
                                있음
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStateChange("elevator", false)}
                                className={`flex-1 px-4 py-3 text-base rounded-xl border font-medium transition-all duration-200 ${state.elevator === false
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                                    }`}
                            >
                                없음
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-md mt-12 mb-12">
                <Button
                    onClick={() => onNext(state)}
                    className="h-14"
                    disabled={
                        !state.roadFullAddr || !state.buildingType || !state.floor
                    }
                >
                    다음
                </Button>
            </div>
        </div>
    );
}