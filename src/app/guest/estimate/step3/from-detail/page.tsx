"use client";

import { useRouter } from "next/navigation";
import EstimateProgressHeader from "@/components/common/EstimateHeader";
import AddressDetailForm, {
  AddressDetailState,
} from "@/components/estimate/AddressDetailForm";
import { saveFromAddressToCookie } from "@/utils/cookies";
import { authApi } from "@/lib/axios";

export default function FromDetailPage() {
  const router = useRouter();

  const handleNext = async (data: AddressDetailState) => {
    const fromAddress = {
      address: {
        roadFullAddr: data.roadFullAddr,
        roadAddrPart1: data.roadAddrPart1,
        addrDetail: data.addrDetail,
        zipNo: data.zipNo,
        entX: data.entX,
        entY: data.entY,
      },
      detailInfo: {
        buildingType: data.buildingType,
        roomStructure: data.roomType,
        sizeOption: data.area,
        floor: data.floor,
        hasStairs: data.stairs,
        hasParking: data.parking === "가능",
        elevator: data.elevator,
      },
    };

    try {
      // 다음 단계에서 사용하기 위해 출발지 정보를 쿠키에 임시 저장합니다.
      saveFromAddressToCookie(fromAddress);
      router.push("/guest/estimate/step3/to-detail");
    } catch (error) {
      console.error("출발지 정보 처리 중 오류:", error);
      alert("출발지 정보를 처리하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <EstimateProgressHeader step={3} title="출발지 상세" />
      <div className="mt-8" />
      <div className="flex-1 flex flex-col items-center justify-center">
        <AddressDetailForm
          addressLabel="출발지 주소"
          storageKey="fromAddressDetail"
          onNext={handleNext}
        />
      </div>
    </div>
  );
}