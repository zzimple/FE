"use client";

import { useRouter } from "next/navigation";
import EstimateProgressHeader from "@/components/common/EstimateHeader";
import AddressDetailForm, {
  AddressDetailState,
} from "@/components/estimate/AddressDetailForm";
import {
  getFromAddressFromCookie,
  removeFromAddressCookie,
} from "@/utils/cookies";
import { authApi } from "@/lib/axios";

export default function ToDetailPage() {
  const router = useRouter();

  const handleNext = async (data: AddressDetailState) => {
    const draftId = localStorage.getItem("uuid");
    if (!draftId) {
      alert("견적서 ID가 없습니다.");
      return;
    }

    const fromAddress = getFromAddressFromCookie();
    if (!fromAddress) {
      alert("출발지 정보가 없습니다. 이전 단계로 돌아가 다시 입력해주세요.");
      router.push("/guest/estimate/step3/from-detail");
      return;
    }

    const toAddress = {
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
      await authApi.post(`/estimates/draft/address?draftId=${draftId}`, {
        fromAddress,
        toAddress,
      });

      // 전송 완료 후, 사용했던 임시 데이터들을 삭제합니다.
      removeFromAddressCookie();
      localStorage.removeItem("fromAddressDetail");
      localStorage.removeItem("toAddressDetail");

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
        <AddressDetailForm
          addressLabel="도착지 주소"
          storageKey="toAddressDetail"
          onNext={handleNext}
        />
      </div>
    </div>
  );
}