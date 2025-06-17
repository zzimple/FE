"use client";

import { useEffect, useState, useRef } from "react";
import EstimateHeader from "@/components/common/EstimateHeader";
import SelectTab from "@/components/common/SelectTab";
import ItemCard from "@/components/move-items/common/ItemCard";
import ItemDeleteModal from "@/components/move-items/common/ItemDeleteModal";
import { MoveCategory, MoveItemDetail } from "@/types/moveItem";
import { getSelectedItemsFromCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import { authApi } from "@/lib/axios";

// 가구
import BedModal from "@/components/move-items/modals/item-detail-modals/furniture/BedModal";
import SofaModal from "@/components/move-items/modals/item-detail-modals/furniture/SofaModal";
import WardrobeSingModal from "@/components/move-items/modals/item-detail-modals/furniture/WardrobeSingModal";
import WardrobeCombinedModal from "@/components/move-items/modals/item-detail-modals/furniture/WardrobeCombinedModal";
import HangerModal from "@/components/move-items/modals/item-detail-modals/furniture/HangerModal";
import SystemHangerModal from "@/components/move-items/modals/item-detail-modals/furniture/SystemHangerModal";
import DressingTableModal from "@/components/move-items/modals/item-detail-modals/furniture/DressingTableModal";
import DrawerModal from "@/components/move-items/modals/item-detail-modals/furniture/DrawerModal";
import DisplayModal from "@/components/move-items/modals/item-detail-modals/furniture/DisplayModal";
import ShelfModal from "@/components/move-items/modals/item-detail-modals/furniture/ShelfModal";
import TvCabinetModal from "@/components/move-items/modals/item-detail-modals/furniture/TvCabinetModal";
import BookshelfModal from "@/components/move-items/modals/item-detail-modals/furniture/BookshelfModal";
import DeskModal from "@/components/move-items/modals/item-detail-modals/furniture/DeskModal";
import DiningTableModal from "@/components/move-items/modals/item-detail-modals/furniture/DiningTableModal";
import ChairModal from "@/components/move-items/modals/item-detail-modals/furniture/ChairModal";

// 가전
import AirconModal from "@/components/move-items/modals/item-detail-modals/appliance/AirconModal";
import AirPurifierModal from "@/components/move-items/modals/item-detail-modals/appliance/AirPurifierModal";
import ClothingCareModal from "@/components/move-items/modals/item-detail-modals/appliance/ClothingCareModal";
import DryerModal from "@/components/move-items/modals/item-detail-modals/appliance/DryerModal";
import FanModal from "@/components/move-items/modals/item-detail-modals/appliance/FanModal";
import GasStoveModal from "@/components/move-items/modals/item-detail-modals/appliance/GasStoveModal";
import MassageChairModal from "@/components/move-items/modals/item-detail-modals/appliance/MassageChairModal";
import MicrowaveModal from "@/components/move-items/modals/item-detail-modals/appliance/MicrowaveModal";
import MoniterModal from "@/components/move-items/modals/item-detail-modals/appliance/MoniterModal";
import PcModal from "@/components/move-items/modals/item-detail-modals/appliance/PcModal";
import RefrigeratorModal from "@/components/move-items/modals/item-detail-modals/appliance/RefrigeratorModal";
import TvModal from "@/components/move-items/modals/item-detail-modals/appliance/TvModal";
import VacuumCleanerModal from "@/components/move-items/modals/item-detail-modals/appliance/VacuumCleanerModal";
import WashingMachineModal from "@/components/move-items/modals/item-detail-modals/appliance/WashingMachineModal";
import WaterPurifierModal from "@/components/move-items/modals/item-detail-modals/appliance/WaterPurifierModal";

import BidetModal from "@/components/move-items/modals/item-detail-modals/other/BidetModal";
import PlantPotModal from "@/components/move-items/modals/item-detail-modals/other/PlantPotModal";
import MirrorModal from "@/components/move-items/modals/item-detail-modals/other/MirrorModal";
import CarrierModal from "@/components/move-items/modals/item-detail-modals/other/CarrierModal";
import BookModal from "@/components/move-items/modals/item-detail-modals/other/BookModal";
import FitnessModal from "@/components/move-items/modals/item-detail-modals/other/FitnessModal";
import CurtainModal from "@/components/move-items/modals/item-detail-modals/other/CurtainModal";
import LightModal from "@/components/move-items/modals/item-detail-modals/other/LightModal";
import DryingRackModal from "@/components/move-items/modals/item-detail-modals/other/DryingRackModal";

type EtcFields = {
  [key: string]: string | number | boolean | null | undefined;
};

function getFullEtcFields(
  etc: EtcFields
): Record<string, string | number | boolean | null> {
  const keys = [
    "width",
    "height",
    "type",
    "material",
    "size",
    "shape",
    "capacity",
    "doorCount",
    "unitCount",
    "frame",
    "hasGlass",
    "isFoldable",
    "hasWheels",
    "hasPrinter",
    "purifierType",
    "specialNote",
  ];

  return keys.reduce((acc, key) => {
    acc[key] = etc[key] ?? null;
    return acc;
  }, {} as Record<string, string | number | boolean | null>);
}

type Item = { name: string; image: string };

type SelectedItems = {
  [key in MoveCategory]: Item[];
};

export default function Step5Page() {
  const router = useRouter();

  const [uuid, setUuid] = useState<string | null>(null);

  const [items, setItems] = useState<MoveItemDetail[]>([]);
  const [boxCount, setBoxCount] = useState(0);
  const [leftoverBoxCount, setLeftoverBoxCount] = useState(0);
  const [requestNote, setRequestNote] = useState<string>("");

  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid");
    if (storedUuid) {
      setUuid(storedUuid);
    }
    else {
      alert('견적서 UUID가 없습니다. 처음부터 다시 작성해주세요.');
      router.push('/estimate/start');
    }
  }, [router]);

  const handleSave = async () => {
    if (!uuid) {
      alert('uuid가 없습니다.');
      return;
    }
    const formattedItems = items.map(({ itemTypeId, quantity, etc = {} }) => ({
      itemTypeId,
      quantity,
      ...getFullEtcFields(etc),
    }));
    
      const payload = {
        items: formattedItems,
        boxCount,
        leftoverBoxCount,
        requestNote,
      };

      try {
        const res = await authApi.put(
          `/estimates/draft/move-items?draftId=${uuid}`,
          payload
        );
        console.log("짐 정보 저장 성공", res.data);
        router.push("/estimate/step6");
      } catch (err) {
        console.error("짐 정보 저장 실패", err);
        alert("짐 정보 저장 중 문제가 발생했어요.");
      }
  };
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    가구: [],
    가전: [],
    기타: [],
  });

  // 가구
  const [openBedModal, setOpenBedModal] = useState(false);
  const [openSofaModal, setOpenSofaModal] = useState(false);
  const [openWardrobeSingModal, setOpenWardrobeSingModal] = useState(false);
  const [openWardrobeCombinedModal, setOpenWardrobeCombinedModal] = useState(false);
  const [openDeskModal, setOpenDeskModal] = useState(false);
  const [openDiningTableModal, setOpenDiningTableModal] = useState(false);
  const [openDisplayModal, setOpenDisplayModal] = useState(false);
  const [openDrawerModal, setOpenDrawerModal] = useState(false);
  const [openDressingTableModal, setOpenDressingTableModal] = useState(false);
  const [openHangerModal, setOpenHangerModal] = useState(false);
  const [openShelfModal, setOpenShelfModal] = useState(false);
  const [openSystemHangerModal, setOpenSystemHangerModal] = useState(false);
  const [openBookshelfModal, setOpenBookshelfModal] = useState(false);
  const [openTvCabinetModal, setOpenTvCabinetModal] = useState(false);
  const [openChairModal, setOpenChairModal] = useState(false);

  // 가전
  const [openAirconModal, setOpenAirconModal] = useState(false);
  const [openAirPurifierModal, setOpenAirPurifierModal] = useState(false);
  const [openClothingCareModal, setOpenClothingCareModal] = useState(false);
  const [openDryerModal, setOpenDryerModal] = useState(false);
  const [openFanModal, setOpenFanModal] = useState(false);
  const [openGasStoveModal, setOpenGasStoveModal] = useState(false);
  const [openMassageChairModal, setOpenMassageChairModal] = useState(false);
  const [openMicrowaveModal, setOpenMicrowaveModal] = useState(false);
  const [openMoniterModal, setOpenMoniterModal] = useState(false);
  const [openPcModal, setOpenPcModal] = useState(false);
  const [openRefrigeratorModal, setOpenRefrigeratorModal] = useState(false);
  const [openTvModal, setOpenTvModal] = useState(false);
  const [openVacuumCleanerModal, setOpenVacuumCleanerModal] = useState(false);
  const [openWashingMachineModal, setOpenWashingMachineModal] = useState(false);
  const [openWaterPurifierModal, setOpenWaterPurifierModal] = useState(false);

  // 기타
  const [openBidetModal, setOpenBidetModal] = useState(false);
  const [openPlantPotModal, setOpenPlantPotModal] = useState(false);
  const [openMirrorModal, setOpenMirrorModal] = useState(false);
  const [openCarrierModal, setOpenCarrierModal] = useState(false);
  const [openBookModal, setOpenBookModal] = useState(false);
  const [openFitnessModal, setOpenFitnessModal] = useState(false);
  const [openCurtainModal, setOpenCurtainModal] = useState(false);
  const [openLightModal, setOpenLightModal] = useState(false);
  const [openDryingRackModal, setOpenDryingRackModal] = useState(false);

  const [pendingItem, setPendingItem] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetItemToDelete, setTargetItemToDelete] = useState<{
    category: MoveCategory;
    itemName: string;
  } | null>(null);

  const furnitureRef = useRef<HTMLDivElement>(null);
  const applianceRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);

  // 잔짐 박스 불러오기
  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid");
    const storedBoxCount = localStorage.getItem("boxCount");
    const storedLeftoverBoxCount = localStorage.getItem("leftoverBoxCount");

    if (storedUuid) {
      setUuid(storedUuid);
    } else {
      alert("견적서 UUID가 없습니다. 처음부터 다시 작성해주세요.");
      router.push("/estimate/start");
    }

    if (storedBoxCount) setBoxCount(Number(storedBoxCount));
    if (storedLeftoverBoxCount)
      setLeftoverBoxCount(Number(storedLeftoverBoxCount));
  }, [router]);
  

  const handleCategoryScroll = (label: MoveCategory) => {
    if (label === "가구" && furnitureRef.current) {
      furnitureRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (label === "가전" && applianceRef.current) {
      applianceRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (label === "기타" && otherRef.current) {
      otherRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 쿠키에서 불러오기
  useEffect(() => {
    const data = getSelectedItemsFromCookie();
    if (data) setSelectedItems(data);
  }, []);

  const handleOpenModal = (itemName: string) => {
    setPendingItem(itemName);
    if (itemName === "쇼파") setOpenSofaModal(true);
    else if (itemName === "침대") setOpenBedModal(true);
    else if (itemName === "옷장-단품") setOpenWardrobeSingModal(true);
    else if (itemName === "옷장-연결장") setOpenWardrobeCombinedModal(true);
    else if (itemName === "행거") setOpenHangerModal(true);
    else if (itemName === "시스템행거") setOpenSystemHangerModal(true);
    else if (itemName === "화장대") setOpenDressingTableModal(true);
    else if (itemName === "수납장/서랍장") setOpenDrawerModal(true);
    else if (itemName === "진열장") setOpenDisplayModal(true);
    else if (itemName === "선반") setOpenShelfModal(true);
    else if (itemName === "거실장/TV장") setOpenTvCabinetModal(true);
    else if (itemName === "책장") setOpenBookshelfModal(true);
    else if (itemName === "책상") setOpenDeskModal(true);
    else if (itemName === "테이블/식탁") setOpenDiningTableModal(true);
    else if (itemName === "의자") setOpenChairModal(true);
    // 가전
    else if (itemName === "냉장고") setOpenRefrigeratorModal(true);
    else if (itemName === "세탁기") setOpenWashingMachineModal(true);
    else if (itemName === "전자레인지") setOpenMicrowaveModal(true);
    else if (itemName === "TV") setOpenTvModal(true);
    else if (itemName === "에어컨") setOpenAirconModal(true);
    else if (itemName === "청소기") setOpenVacuumCleanerModal(true);
    else if (itemName === "건조기") setOpenDryerModal(true);
    else if (itemName === "가스레인지") setOpenGasStoveModal(true);
    else if (itemName === "공기청정기") setOpenAirPurifierModal(true);
    else if (itemName === "정수기") setOpenWaterPurifierModal(true);
    else if (itemName === "안마의자") setOpenMassageChairModal(true);
    else if (itemName === "의류관리기") setOpenClothingCareModal(true);
    else if (itemName === "PC/데스크탑") setOpenPcModal(true);
    else if (itemName === "모니터") setOpenMoniterModal(true);
    else if (itemName === "선풍기") setOpenFanModal(true);
    // 기타
    else if (itemName === "비데") setOpenBidetModal(true);
    else if (itemName === "화분") setOpenPlantPotModal(true);
    else if (itemName === "거울") setOpenMirrorModal(true);
    else if (itemName === "캐리어") setOpenCarrierModal(true);
    else if (itemName === "책") setOpenBookModal(true);
    else if (itemName === "운동기구") setOpenFitnessModal(true);
    else if (itemName === "커튼") setOpenCurtainModal(true);
    else if (itemName === "조명") setOpenLightModal(true);
    else if (itemName === "빨래건조대") setOpenDryingRackModal(true);
  };

  const handleDeleteClick = (category: MoveCategory, itemName: string) => {
    setTargetItemToDelete({ category, itemName });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!targetItemToDelete) return;
    setSelectedItems((prev) => ({
      ...prev,
      [targetItemToDelete.category]: prev[targetItemToDelete.category].filter(
        (item) => item.name !== targetItemToDelete.itemName
      ),
    }));
    setShowDeleteModal(false);
    setTargetItemToDelete(null);
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      <EstimateHeader step={5} title="짐 상세 정보 입력" />

      <div className="px-4 pt-6 pb-20">
        <p className="text-center font-semibold mb-4">
          입력할 짐을 선택해주세요
        </p>

        {/* 탭 */}
        <div className="flex justify-center gap-2 mb-6 sticky top-0 bg-white z-10">
          {["가구", "가전", "기타"].map((label) => (
            <SelectTab
              key={label}
              label={label}
              selected={false}
              onClick={() => handleCategoryScroll(label as MoveCategory)}
            />
          ))}
        </div>

        {/* 전체 짐 목록 */}
        <div className="space-y-8">
          {/* 가구 */}
          <div ref={furnitureRef}>
            <div className="text-lg font-bold mb-2">가구</div>
            {selectedItems["가구"].map((item) => (
              <ItemCard
                key={item.name}
                icon={item.image}
                onEdit={() => handleOpenModal(item.name)}
                onDelete={() => handleDeleteClick("가구", item.name)}
              />
            ))}
          </div>
          {/* 가전 */}
          <div ref={applianceRef}>
            <div className="text-lg font-bold mb-2 mt-6">가전</div>
            {selectedItems["가전"].map((item) => (
              <ItemCard
                key={item.name}
                icon={item.image}
                onEdit={() => handleOpenModal(item.name)}
                onDelete={() => handleDeleteClick("가전", item.name)}
              />
            ))}
          </div>
          {/* 기타 */}
          <div ref={otherRef}>
            <div className="text-lg font-bold mb-2 mt-6">기타</div>
            {selectedItems["기타"].map((item) => (
              <ItemCard
                key={item.name}
                icon={item.image}
                onEdit={() => handleOpenModal(item.name)}
                onDelete={() => handleDeleteClick("기타", item.name)}
              />
            ))}
            {/* 짐 박스 입력 UI */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm w-full max-w-[400px] h-[90px] mx-auto mb-3">
              <img
                src="/images/leftoverBox.jpeg"
                alt="짐 박스"
                className="w-16 h-16 object-contain mr-3"
              />
              <span className="text-base font-semibold text-gray-800 mr-6">
                짐 박스
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  className="border border-gray-300 rounded px-2 py-1 text-lg font-bold bg-white hover:bg-gray-100"
                  onClick={() => setBoxCount((prev) => Math.max(0, prev - 1))}
                >
                  -
                </button>
                <span className="w-16 text-center font-bold text-gray-900 text-base">
                  {boxCount}개
                </span>
                <button
                  className="border border-gray-300 rounded px-2 py-1 text-lg font-bold bg-white hover:bg-gray-100"
                  onClick={() => setBoxCount((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 메모 입력란  */}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            사장님께 전달할 요청사항
          </label>
          <textarea
            value={requestNote}
            onChange={(e) => setRequestNote(e.target.value)}
            placeholder="예시) 추가 짐과 반려동물이 있어요. "
            className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none h-24"
          />
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && targetItemToDelete && (
        <ItemDeleteModal
          itemName={targetItemToDelete.itemName}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setTargetItemToDelete(null);
          }}
        />
      )}

      {/* 상세 입력 모달 */}
      {openBedModal && pendingItem === "침대" && (
        <BedModal
          itemTypeId={1001}
          onClose={() => setOpenBedModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("침대 data", data);
            setOpenBedModal(false);
          }}
        />
      )}

      {openSofaModal && pendingItem === "쇼파" && (
        <SofaModal
          itemTypeId={1002}
          onClose={() => setOpenSofaModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("쇼파 data", data);
            setOpenSofaModal(false);
          }}
        />
      )}

      {openWardrobeSingModal && pendingItem === "옷장-단품" && (
        <WardrobeSingModal
          itemTypeId={1003}
          onClose={() => setOpenWardrobeSingModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("옷장-단품 data", data);
            setOpenWardrobeSingModal(false);
          }}
        />
      )}

      {openWardrobeCombinedModal && pendingItem === "옷장-연결장" && (
        <WardrobeCombinedModal
          itemTypeId={1004}
          onClose={() => setOpenWardrobeCombinedModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("옷장-연결장 data", data);
            setOpenWardrobeCombinedModal(false);
          }}
        />
      )}
      {openHangerModal && pendingItem === "행거" && (
        <HangerModal
          itemTypeId={1005}
          onClose={() => setOpenHangerModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("행거 data", data);
            setOpenHangerModal(false);
          }}
        />
      )}

      {openSystemHangerModal && pendingItem === "시스템행거" && (
        <SystemHangerModal
          itemTypeId={1006}
          onClose={() => setOpenSystemHangerModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            setOpenSystemHangerModal(false);
          }}
        />
      )}

      {openDressingTableModal && pendingItem === "화장대" && (
        <DressingTableModal
          itemTypeId={1007}
          onClose={() => setOpenDressingTableModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("화장대 data", data);
            setOpenDressingTableModal(false);
          }}
        />
      )}

      {openDrawerModal && pendingItem === "수납장/서랍장" && (
        <DrawerModal
          itemTypeId={1008}
          onClose={() => setOpenDrawerModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("수납장/서랍장 data", data);
            setOpenDrawerModal(false);
          }}
        />
      )}

      {openDisplayModal && pendingItem === "진열장" && (
        <DisplayModal
          itemTypeId={1009}
          onClose={() => setOpenDisplayModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("장식장 data", data);
            setOpenDisplayModal(false);
          }}
        />
      )}

      {openShelfModal && pendingItem === "선반" && (
        <ShelfModal
          itemTypeId={1010}
          onClose={() => setOpenShelfModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("선반 data", data);
            setOpenShelfModal(false);
          }}
        />
      )}

      {openTvCabinetModal && pendingItem === "거실장/TV장" && (
        <TvCabinetModal
          itemTypeId={1011}
          onClose={() => setOpenTvCabinetModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("거실장/TV장 data", data);
            setOpenTvCabinetModal(false);
          }}
        />
      )}

      {openBookshelfModal && pendingItem === "책장" && (
        <BookshelfModal
          itemTypeId={1012}
          onClose={() => setOpenBookshelfModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("책장 data", data);
            setOpenBookshelfModal(false);
          }}
        />
      )}

      {openDeskModal && pendingItem === "책상" && (
        <DeskModal
          itemTypeId={1013}
          onClose={() => setOpenDeskModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("책상 data", data);
            setOpenDeskModal(false);
          }}
        />
      )}

      {openDiningTableModal && pendingItem === "테이블/식탁" && (
        <DiningTableModal
          itemTypeId={1014}
          onClose={() => setOpenDiningTableModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("식탁 data", data);
            setOpenDiningTableModal(false);
          }}
        />
      )}

      {openChairModal && pendingItem === "의자" && (
        <ChairModal
          itemTypeId={1015}
          onClose={() => setOpenChairModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("의자 data", data);
            setOpenChairModal(false);
          }}
        />
      )}

      {/** 가전 */}

      {openTvModal && pendingItem === "TV" && (
        <TvModal
          itemTypeId={2001}
          onClose={() => setOpenTvModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("TV data", data);
            setOpenTvModal(false);
          }}
        />
      )}

      {openMoniterModal && pendingItem === "모니터" && (
        <MoniterModal
          itemTypeId={2002}
          onClose={() => setOpenMoniterModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("모니터 data", data);
            setOpenMoniterModal(false);
          }}
        />
      )}

      {openPcModal && pendingItem === "PC/데스크탑" && (
        <PcModal
          itemTypeId={2003}
          onClose={() => setOpenPcModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("PC/데스크탑 data", data);
            setOpenPcModal(false);
          }}
        />
      )}

      {openWashingMachineModal && pendingItem === "세탁기" && (
        <WashingMachineModal
          itemTypeId={2004}
          onClose={() => setOpenWashingMachineModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("세탁기 data", data);
            setOpenWashingMachineModal(false);
          }}
        />
      )}

      {openDryerModal && pendingItem === "건조기" && (
        <DryerModal
          itemTypeId={2005}
          onClose={() => setOpenDryerModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("건조기 data", data);
            setOpenDryerModal(false);
          }}
        />
      )}

      {openVacuumCleanerModal && pendingItem === "청소기" && (
        <VacuumCleanerModal
          itemTypeId={2006}
          onClose={() => setOpenVacuumCleanerModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("청소기 data", data);
            setOpenVacuumCleanerModal(false);
          }}
        />
      )}

      {openClothingCareModal && pendingItem === "의류관리기" && (
        <ClothingCareModal
          itemTypeId={2007}
          onClose={() => setOpenClothingCareModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("의류관리기 data", data);
            setOpenClothingCareModal(false);
          }}
        />
      )}

      {openRefrigeratorModal && pendingItem === "냉장고" && (
        <RefrigeratorModal
          itemTypeId={2008}
          onClose={() => setOpenRefrigeratorModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("냉장고 data", data);
            setOpenRefrigeratorModal(false);
          }}
        />
      )}

      {openMicrowaveModal && pendingItem === "전자레인지" && (
        <MicrowaveModal
          itemTypeId={2009}
          onClose={() => setOpenMicrowaveModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("전자레인지 data", data);
            setOpenMicrowaveModal(false);
          }}
        />
      )}

      {openGasStoveModal && pendingItem === "가스레인지" && (
        <GasStoveModal
          itemTypeId={2010}
          onClose={() => setOpenGasStoveModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("가스레인지 data", data);
            setOpenGasStoveModal(false);
          }}
        />
      )}

      {openWaterPurifierModal && pendingItem === "정수기" && (
        <WaterPurifierModal
          itemTypeId={2011}
          onClose={() => setOpenWaterPurifierModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("정수기 data", data);
            setOpenWaterPurifierModal(false);
          }}
        />
      )}

      {openAirconModal && pendingItem === "에어컨" && (
        <AirconModal
          itemTypeId={2012}
          onClose={() => setOpenAirconModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("에어컨 data", data);
            setOpenAirconModal(false);
          }}
        />
      )}

      {openAirPurifierModal && pendingItem === "공기청정기" && (
        <AirPurifierModal
          itemTypeId={2013}
          onClose={() => setOpenAirPurifierModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("공기청정기 data", data);
            setOpenAirPurifierModal(false);
          }}
        />
      )}

      {openFanModal && pendingItem === "선풍기" && (
        <FanModal
          itemTypeId={2014}
          onClose={() => setOpenFanModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("선풍기 data", data);
            setOpenFanModal(false);
          }}
        />
      )}

      {openMassageChairModal && pendingItem === "안마의자" && (
        <MassageChairModal
          itemTypeId={2015}
          onClose={() => setOpenMassageChairModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("안마의자 data", data);
            setOpenMassageChairModal(false);
          }}
        />
      )}

      {/** 기타 */}

      {openMirrorModal && pendingItem === "거울" && (
        <MirrorModal
          itemTypeId={3001}
          onClose={() => setOpenMirrorModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("거울 data", data);
            setOpenMirrorModal(false);
          }}
        />
      )}

      {openCurtainModal && pendingItem === "커튼" && (
        <CurtainModal
          itemTypeId={3002}
          onClose={() => setOpenCurtainModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("커튼 data", data);
            setOpenCurtainModal(false);
          }}
        />
      )}

      {openDryingRackModal && pendingItem === "빨래건조대" && (
        <DryingRackModal
          itemTypeId={3003}
          onClose={() => setOpenDryingRackModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("빨래건조대 data", data);
            setOpenDryingRackModal(false);
          }}
        />
      )}

      {openCarrierModal && pendingItem === "캐리어" && (
        <CarrierModal
          itemTypeId={3004}
          onClose={() => setOpenCarrierModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("캐리어 data", data);
            setOpenCarrierModal(false);
          }}
        />
      )}

      {openFitnessModal && pendingItem === "운동기구" && (
        <FitnessModal
          itemTypeId={3005}
          onClose={() => setOpenFitnessModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("운동기구 data", data);
            setOpenFitnessModal(false);
          }}
        />
      )}

      {openBookModal && pendingItem === "책" && (
        <BookModal
          itemTypeId={3006}
          onClose={() => setOpenBookModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("책 data", data);
            setOpenBookModal(false);
          }}
        />
      )}

      {openPlantPotModal && pendingItem === "화분" && (
        <PlantPotModal
          itemTypeId={3007}
          onClose={() => setOpenPlantPotModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("화분 data", data);
            setOpenPlantPotModal(false);
          }}
        />
      )}

      {openBidetModal && pendingItem === "비데" && (
        <BidetModal
          itemTypeId={3008}
          onClose={() => setOpenBidetModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("비데 data", data);
            setOpenBidetModal(false);
          }}
        />
      )}

      {openLightModal && pendingItem === "조명" && (
        <LightModal
          itemTypeId={3009}
          onClose={() => setOpenLightModal(false)}
          onSave={(data) => {
            setItems((prev) => [...prev, data]);
            console.log("조명 data", data);
            setOpenLightModal(false);
          }}
        />
      )}

      {/* 하단 다음 버튼 */}
      <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto bg-white px-4 py-4 z-20">
        <Button onClick={handleSave}>다음</Button>
      </div>
    </div>
  );
}
