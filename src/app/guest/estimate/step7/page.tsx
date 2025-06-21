"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/axios";
import EstimateHeader from "@/components/common/EstimateHeader";
import Button from "@/components/common/Button";
import {
  Calendar,
  MapPin,
  Package,
  Truck,
  Building,
  ParkingCircle,
  Hash,
} from "lucide-react";

// 1. API 응답에 맞춘 타입 정의
interface Address {
  roadFullAddr: string;
  roadAddrPart1: string;
  addrDetail: string;
  zipNo: string;
  entX: string;
  entY: string;
}

interface DetailInfo {
  buildingType: string;
  roomStructure: string;
  sizeOption: string;
  floor: string;
  hasStairs: boolean;
  hasParking: boolean;
  elevator: boolean;
}

interface AddressInfo {
  address: Address;
  detailInfo: DetailInfo;
}

interface HolidayInfo {
  movedate: string;
  moveTime: string;
  dateName: string;
  goodDay: boolean;
  holiday: boolean;
  weekend: boolean;
}

interface MoveItem {
  itemTypeId: number;
  itemTypeName: string;
  category: string;
  quantity: number;
  [key: string]: any; // 기타 옵션들
}

interface MoveItemsInfo {
  boxCount: number;
  leftoverBoxCount: number;
  requestNote: string;
  items: MoveItem[];
}

interface FullEstimateData {
  address: {
    fromAddress: AddressInfo;
    toAddress: AddressInfo;
  };
  holiday: HolidayInfo;
  moveType: {
    moveType: string;
  };
  moveItems: MoveItemsInfo;
  moveOption: {
    optionType: string;
  };
}

// 2. ENUM 값을 한글로 변환하기 위한 헬퍼 객체
const translationMap = {
  HOME_MOVE: "가정 이사",
  SMALL_MOVE: "소형 이사",
  APARTMENT: "아파트",
  VILLA: "빌라/연립",
  HOUSE: "주택",
  OFFICETEL: "오피스텔",
  COMMERCIAL: "상가/사무실",
  BASIC: "일반이사",
  SEMI_PACKAGING: "반포장이사",
  PACKAGING: "포장이사",
  APPLIANCE: "가전",
  FURNITURE: "가구",
  OTHER: "기타",
  ONE_ROOM: "원룸",
  ONE_HALF_ROOM: "1.5룸",
  TWO_ROOM: "2룸",
  THREE_ROOM_OR_MORE: "3룸 이상",
};

const translate = (key: string) =>
  translationMap[key as keyof typeof translationMap] || key;

export default function Step7Page() {
  const router = useRouter();
  const [estimateData, setEstimateData] = useState<FullEstimateData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstimateData = async () => {
      const uuid = localStorage.getItem("uuid");
      if (!uuid) {
        setError("견적 정보를 찾을 수 없습니다. 다시 시도해주세요.");
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.get(`/estimates/draft/load/${uuid}`);
        if (response.data.success) {
          setEstimateData(response.data.data);
        } else {
          setError(
            response.data.message || "견적 정보를 불러오는 데 실패했습니다."
          );
        }
      } catch (err) {
        setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstimateData();
  }, []);

  const handleNext = () => {
    router.push("/guest/estimate/step8");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        견적 정보를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!estimateData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        견적 데이터를 표시할 수 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <EstimateHeader step={7} title="견적 내용 최종 확인" totalStep={8} />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
          입력하신 내용을 최종 확인해주세요.
        </h2>

        <div className="space-y-6">

          {/* 서비스 종류 */}
          <InfoCard title="서비스 종류" icon={<Truck className="w-5 h-5" />}>
            <InfoRow
              label="선택한 서비스"
              value={translate(estimateData.moveOption.optionType)}
            />
          </InfoCard>

          {/* 이사 기본 정보 */}
          <InfoCard title="이사 정보" icon={<Calendar className="w-5 h-5" />}>
            <InfoRow
              label="이사 종류"
              value={translate(estimateData.moveType.moveType)}
            />
            <InfoRow
              label="이사 날짜"
              value={`${estimateData.holiday.movedate} (${estimateData.holiday.dateName || "평일"
                })`}
            />
            <InfoRow label="이사 시간" value={estimateData.holiday.moveTime} />
            <InfoRow
              label="손 없는 날"
              value={estimateData.holiday.goodDay ? "O" : "X"}
            />
          </InfoCard>

          {/* 출발지 & 도착지 정보 */}
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard
              title="출발지 정보"
              icon={<MapPin className="w-5 h-5" />}
            >
              <InfoRow
                label="주소"
                value={estimateData.address.fromAddress.address.roadFullAddr}
              />
              <InfoRow
                label="건물"
                value={translate(
                  estimateData.address.fromAddress.detailInfo.buildingType
                )}
              />
              {/* --- 추가된 부분 --- */}
              <InfoRow
                label="방 구조"
                value={translate(
                  estimateData.address.fromAddress.detailInfo.roomStructure
                )}
              />
              <InfoRow
                label="평수"
                value={estimateData.address.fromAddress.detailInfo.sizeOption}
              />
              {/* --- 추가 끝 --- */}
              <InfoRow
                label="층수"
                value={estimateData.address.fromAddress.detailInfo.floor}
              />
              <InfoRow
                label="주차"
                value={
                  estimateData.address.fromAddress.detailInfo.hasParking
                    ? "가능"
                    : "불가능"
                }
              />
              {/* --- 추가된 부분 --- */}
              <InfoRow
                label="계단 이용"
                value={
                  estimateData.address.fromAddress.detailInfo.hasStairs
                    ? "있음"
                    : "없음"
                }
              />
              {/* --- 추가 끝 --- */}
              <InfoRow
                label="엘리베이터"
                value={
                  estimateData.address.fromAddress.detailInfo.elevator
                    ? "있음"
                    : "없음"
                }
              />
            </InfoCard>
            <InfoCard
              title="도착지 정보"
              icon={<MapPin className="w-5 h-5 text-green-500" />}
            >
              <InfoRow
                label="주소"
                value={estimateData.address.toAddress.address.roadFullAddr}
              />
              <InfoRow
                label="건물"
                value={translate(
                  estimateData.address.toAddress.detailInfo.buildingType
                )}
              />
              {/* --- 추가된 부분 --- */}
              <InfoRow
                label="방 구조"
                value={translate(
                  estimateData.address.toAddress.detailInfo.roomStructure
                )}
              />
              <InfoRow
                label="평수"
                value={estimateData.address.toAddress.detailInfo.sizeOption}
              />
              {/* --- 추가 끝 --- */}
              <InfoRow
                label="층수"
                value={estimateData.address.toAddress.detailInfo.floor}
              />
              <InfoRow
                label="주차"
                value={
                  estimateData.address.toAddress.detailInfo.hasParking
                    ? "가능"
                    : "불가능"
                }
              />
              {/* --- 추가된 부분 --- */}
              <InfoRow
                label="계단 이용"
                value={
                  estimateData.address.toAddress.detailInfo.hasStairs
                    ? "있음"
                    : "없음"
                }
              />
              {/* --- 추가 끝 --- */}
              <InfoRow
                label="엘리베이터"
                value={
                  estimateData.address.toAddress.detailInfo.elevator
                    ? "있음"
                    : "없음"
                }
              />
            </InfoCard>
          </div>

          {/* 이사 짐 정보 */}
          <InfoCard title="이사 짐" icon={<Package className="w-5 h-5" />}>
            <div className="font-semibold text-gray-700 mb-2">주요 짐 목록</div>

            <div className="space-y-2">
              {estimateData.moveItems.items.map((item) => (
                <InfoRow
                  key={item.itemTypeId}
                  label={item.itemTypeName}
                  value={`x${item.quantity}`}
                />
              ))}
            </div>

            <div className="border-t my-4"></div>
            <InfoRow
              label="짐 박스"
              value={`${estimateData.moveItems.boxCount}개`}
            />
            <InfoRow
              label="잔짐 박스"
              value={`${estimateData.moveItems.leftoverBoxCount}개`}
            />
            <InfoRow
              label="요청 사항"
              value={estimateData.moveItems.requestNote || "없음"}
            />
          </InfoCard>

        </div>

        <div className="mt-12 flex justify-center">
          <Button
            onClick={handleNext}
            className="w-full max-w-md h-14 text-lg font-bold"
          >
            견적 제출하기
          </Button>
        </div>
      </main>
    </div>
  );
}

// 재사용 가능한 컴포넌트들
const InfoCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-blue-500">{icon}</span>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-start text-sm gap-4">
    <span className="text-gray-500 font-medium whitespace-nowrap">
      {label}
    </span>
    <span className="text-gray-800 text-right break-words">{value}</span>
  </div>
);