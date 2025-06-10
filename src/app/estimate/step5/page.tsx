"use client";

import { useEffect, useState } from "react";
import EstimateHeader from "@/components/common/EstimateHeader";
import SelectTab from "@/components/common/SelectTab";
import ItemCard from "@/components/move-items/common/ItemCard";
import ItemDeleteModal from "@/components/move-items/common/ItemDeleteModal";
import { MoveCategory } from "@/types/moveItem";
import { getSelectedItemsFromCookie } from "@/utils/cookies";

// 가구
import BedModal from "@/components/move-items/modals/item-detail-modals/furniture/BedModal";
import BookshelfModal from "@/components/move-items/modals/item-detail-modals/furniture/BookshelfModal";
import ChairModal from "@/components/move-items/modals/item-detail-modals/furniture/ChairModal";
import DeskModal from "@/components/move-items/modals/item-detail-modals/furniture/DeskModal";
import DiningTableModal from "@/components/move-items/modals/item-detail-modals/furniture/DiningTableModal";
import DisplayModal from "@/components/move-items/modals/item-detail-modals/furniture/DisplayModal";
import DrawerModal from "@/components/move-items/modals/item-detail-modals/furniture/DrawerModal";
import DressingTableModal from "@/components/move-items/modals/item-detail-modals/furniture/DressingTableModal";
import HangerModal from "@/components/move-items/modals/item-detail-modals/furniture/HangerModal";
import ShelfModal from "@/components/move-items/modals/item-detail-modals/furniture/ShelfModal";
import SofaModal from "@/components/move-items/modals/item-detail-modals/furniture/SofaModal"; 
import SystemHangerModal from "@/components/move-items/modals/item-detail-modals/furniture/SystemHangerModal";
import TvCabinetModal from "@/components/move-items/modals/item-detail-modals/furniture/TvCabinetModal";
import WardrobeCombinedModal from "@/components/move-items/modals/item-detail-modals/furniture/WardrobeCombinedModal";
import WardrobeSingModal from "@/components/move-items/modals/item-detail-modals/furniture/WardrobeSingModal";

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

type Item = { name: string; image: string };

type SelectedItems = {
  [key in MoveCategory]: Item[];
};

export default function Step5Page() {
  const [category, setCategory] = useState<MoveCategory>("가구");
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    가구: [],
    가전: [],
    기타: [],
  });

  // 가구
  const [openSofaModal, setOpenSofaModal] = useState(false);
  const [openBedModal, setOpenBedModal] = useState(false);
  const [openBookshelfModal, setOpenBookshelfModal] = useState(false);
  const [openChairModal, setOpenChairModal] = useState(false);
  const [openDeskModal, setOpenDeskModal] = useState(false);
  const [openDiningTableModal, setOpenDiningTableModal] = useState(false);
  const [openDisplayModal, setOpenDisplayModal] = useState(false);
  const [openDrawerModal, setOpenDrawerModal] = useState(false);
  const [openDressingTableModal, setOpenDressingTableModal] = useState(false);
  const [openHangerModal, setOpenHangerModal] = useState(false);
  const [openShelfModal, setOpenShelfModal] = useState(false);
  const [openSystemHangerModal, setOpenSystemHangerModal] = useState(false);
  const [openTvCabinetModal, setOpenTvCabinetModal] = useState(false);
  const [openWardrobeCombinedModal, setOpenWardrobeCombinedModal] =
    useState(false);
  const [openWardrobeSingModal, setOpenWardrobeSingModal] = useState(false);

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
  const [targetItemToDelete, setTargetItemToDelete] = useState<string | null>(
    null
  );

  // 쿠키에서 불러오기
  useEffect(() => {
    const data = getSelectedItemsFromCookie();
    if (data) setSelectedItems(data);
  }, []);

  const handleOpenModal = (itemName: string) => {
    setPendingItem(itemName);
    if (itemName === "쇼파") setOpenSofaModal(true);
    else if (itemName === "침대") setOpenBedModal(true);
    else if (itemName === "책장") setOpenBookshelfModal(true);
    else if (itemName === "의자") setOpenChairModal(true);
    else if (itemName === "책상") setOpenDeskModal(true);
    else if (itemName === "테이블/식탁") setOpenDiningTableModal(true);
    else if (itemName === "진열장") setOpenDisplayModal(true);
    else if (itemName === "수납장/서랍장") setOpenDrawerModal(true);
    else if (itemName === "화장대") setOpenDressingTableModal(true);
    else if (itemName === "행거") setOpenHangerModal(true);
    else if (itemName === "선반") setOpenShelfModal(true);
    else if (itemName === "시스템행거") setOpenSystemHangerModal(true);
    else if (itemName === "거실장/TV장") setOpenTvCabinetModal(true);
    else if (itemName === "옷장-연결장") setOpenWardrobeCombinedModal(true);
    else if (itemName === "옷장-단품") setOpenWardrobeSingModal(true);
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

  

  const handleDeleteClick = (itemName: string) => {
    setTargetItemToDelete(itemName);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!targetItemToDelete) return;
    setSelectedItems((prev) => ({
      ...prev,
      [category]: prev[category].filter(
        (item) => item.name !== targetItemToDelete
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
        <div className="flex justify-center gap-2 mb-6">
          {["가구", "가전", "기타"].map((label) => (
            <SelectTab
              key={label}
              label={label}
              selected={category === label}
              onClick={() => setCategory(label as MoveCategory)}
            />
          ))}
        </div>

        {/* 항목 목록 */}
        {selectedItems[category].map((item) => (
          <ItemCard
            key={item.name}
            icon={item.image}
            onEdit={() => handleOpenModal(item.name)}
            onDelete={() => handleDeleteClick(item.name)}
          />
        ))}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && targetItemToDelete && (
        <ItemDeleteModal
          itemName={targetItemToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setTargetItemToDelete(null);
          }}
        />
      )}

      {/* 상세 입력 모달 */}
      {openSofaModal && pendingItem === "쇼파" && (
        <SofaModal
          onClose={() => setOpenSofaModal(false)}
          onSave={(data) => {
            console.log("쇼파 data", data);
            setOpenSofaModal(false);
          }}
        />
      )}

      {openBedModal && pendingItem === "침대" && (
        <BedModal
          onClose={() => setOpenBedModal(false)}
          onSave={(data) => {
            console.log("침대 data", data);
            setOpenBedModal(false);
          }}
        />
      )}

      {openBookshelfModal && pendingItem === "책장" && (
        <BookshelfModal
          onClose={() => setOpenBookshelfModal(false)}
          onSave={(data) => {
            console.log("책장 data", data);
            setOpenBookshelfModal(false);
          }}
        />
      )}
      {openChairModal && pendingItem === "의자" && (
        <ChairModal
          onClose={() => setOpenChairModal(false)}
          onSave={(data) => {
            console.log("의자 data", data);
            setOpenChairModal(false);
          }}
        />
      )}

      {openDeskModal && pendingItem === "책상" && (
        <DeskModal
          onClose={() => setOpenDeskModal(false)}
          onSave={(data) => {
            console.log("책상 data", data);
            setOpenDeskModal(false);
          }}
        />
      )}

      {openDiningTableModal && pendingItem === "테이블/식탁" && (
        <DiningTableModal
          onClose={() => setOpenDiningTableModal(false)}
          onSave={(data) => {
            console.log("식탁 data", data);
            setOpenDiningTableModal(false);
          }}
        />
      )}

      {openDisplayModal && pendingItem === "진열장" && (
        <DisplayModal
          onClose={() => setOpenDisplayModal(false)}
          onSave={(data) => {
            console.log("장식장 data", data);
            setOpenDisplayModal(false);
          }}
        />
      )}

      {openDrawerModal && pendingItem === "수납장/서랍장" && (
        <DrawerModal
          onClose={() => setOpenDrawerModal(false)}
          onSave={(data) => {
            console.log("수납장/서랍장 data", data);
            setOpenDrawerModal(false);
          }}
        />
      )}

      {openDressingTableModal && pendingItem === "화장대" && (
        <DressingTableModal
          onClose={() => setOpenDressingTableModal(false)}
          onSave={(data) => {
            console.log("화장대 data", data);
            setOpenDressingTableModal(false);
          }}
        />
      )}

      {openHangerModal && pendingItem === "행거" && (
        <HangerModal
          onClose={() => setOpenHangerModal(false)}
          onSave={(data) => {
            console.log("행거 data", data);
            setOpenHangerModal(false);
          }}
        />
      )}

      {openShelfModal && pendingItem === "선반" && (
        <ShelfModal
          onClose={() => setOpenShelfModal(false)}
          onSave={(data) => {
            console.log("선반 data", data);
            setOpenShelfModal(false);
          }}
        />
      )}

      {openSystemHangerModal && pendingItem === "시스템행거" && (
        <SystemHangerModal
          onClose={() => setOpenSystemHangerModal(false)}
          onSave={(data) => {
            console.log("시스템행거 data", data);
            setOpenSystemHangerModal(false);
          }}
        />
      )}

      {openTvCabinetModal && pendingItem === "거실장/TV장" && (
        <TvCabinetModal
          onClose={() => setOpenTvCabinetModal(false)}
          onSave={(data) => {
            console.log("거실장/TV장 data", data);
            setOpenTvCabinetModal(false);
          }}
        />
      )}

      {openWardrobeCombinedModal && pendingItem === "옷장-연결장" && (
        <WardrobeCombinedModal
          onClose={() => setOpenWardrobeCombinedModal(false)}
          onSave={(data) => {
            console.log("옷장-연결장 data", data);
            setOpenWardrobeCombinedModal(false);
          }}
        />
      )}

      {openWardrobeSingModal && pendingItem === "옷장-단품" && (
        <WardrobeSingModal
          onClose={() => setOpenWardrobeSingModal(false)}
          onSave={(data) => {
            console.log("옷장-단품 data", data);
            setOpenWardrobeSingModal(false);
          }}
        />
      )}

      {openRefrigeratorModal && pendingItem === "냉장고" && (
        <RefrigeratorModal
          onClose={() => setOpenRefrigeratorModal(false)}
          onSave={(data) => {
            console.log("냉장고 data", data);
            setOpenRefrigeratorModal(false);
          }}
        />
      )}

      {openWashingMachineModal && pendingItem === "세탁기" && (
        <WashingMachineModal
          onClose={() => setOpenWashingMachineModal(false)}
          onSave={(data) => {
            console.log("세탁기 data", data);
            setOpenWashingMachineModal(false);
          }}
        />
      )}

      {openMicrowaveModal && pendingItem === "전자레인지" && (
        <MicrowaveModal
          onClose={() => setOpenMicrowaveModal(false)}
          onSave={(data) => {
            console.log("전자레인지 data", data);
            setOpenMicrowaveModal(false);
          }}
        />
      )}

      {openTvModal && pendingItem === "TV" && (
        <TvModal
          onClose={() => setOpenTvModal(false)}
          onSave={(data) => {
            console.log("TV data", data);
            setOpenTvModal(false);
          }}
        />
      )}

      {openAirconModal && pendingItem === "에어컨" && (
        <AirconModal
          onClose={() => setOpenAirconModal(false)}
          onSave={(data) => {
            console.log("에어컨 data", data);
            setOpenAirconModal(false);
          }}
        />
      )}

      {openVacuumCleanerModal && pendingItem === "청소기" && (
        <VacuumCleanerModal
          onClose={() => setOpenVacuumCleanerModal(false)}
          onSave={(data) => {
            console.log("청소기 data", data);
            setOpenVacuumCleanerModal(false);
          }}
        />
      )}

      {openDryerModal && pendingItem === "건조기" && (
        <DryerModal
          onClose={() => setOpenDryerModal(false)}
          onSave={(data) => {
            console.log("건조기 data", data);
            setOpenDryerModal(false);
          }}
        />
      )}

      {openGasStoveModal && pendingItem === "가스레인지" && (
        <GasStoveModal
          onClose={() => setOpenGasStoveModal(false)}
          onSave={(data) => {
            console.log("가스레인지 data", data);
            setOpenGasStoveModal(false);
          }}
        />
      )}

      {openAirPurifierModal && pendingItem === "공기청정기" && (
        <AirPurifierModal
          onClose={() => setOpenAirPurifierModal(false)}
          onSave={(data) => {
            console.log("공기청정기 data", data);
            setOpenAirPurifierModal(false);
          }}
        />
      )}

      {openWaterPurifierModal && pendingItem === "정수기" && (
        <WaterPurifierModal
          onClose={() => setOpenWaterPurifierModal(false)}
          onSave={(data) => {
            console.log("정수기 data", data);
            setOpenWaterPurifierModal(false);
          }}
        />
      )}

      {openMassageChairModal && pendingItem === "안마의자" && (
        <MassageChairModal
          onClose={() => setOpenMassageChairModal(false)}
          onSave={(data) => {
            console.log("안마의자 data", data);
            setOpenMassageChairModal(false);
          }}
        />
      )}

      {openClothingCareModal && pendingItem === "의류관리기" && (
        <ClothingCareModal
          onClose={() => setOpenClothingCareModal(false)}
          onSave={(data) => {
            console.log("의류관리기 data", data);
            setOpenClothingCareModal(false);
          }}
        />
      )}

      {openPcModal && pendingItem === "PC/데스크탑" && (
        <PcModal
          onClose={() => setOpenPcModal(false)}
          onSave={(data) => {
            console.log("PC/데스크탑 data", data);
            setOpenPcModal(false);
          }}
        />
      )}

      {openMoniterModal && pendingItem === "모니터" && (
        <MoniterModal
          onClose={() => setOpenMoniterModal(false)}
          onSave={(data) => {
            console.log("모니터 data", data);
            setOpenMoniterModal(false);
          }}
        />
      )}

      {openFanModal && pendingItem === "선풍기" && (
        <FanModal
          onClose={() => setOpenFanModal(false)}
          onSave={(data) => {
            console.log("선풍기 data", data);
            setOpenFanModal(false);
          }}
        />
      )}

{openBidetModal && pendingItem === "비데" && (
  <BidetModal onClose={() => setOpenBidetModal(false)} onSave={(data) => setOpenBidetModal(false)} />
)}

{openPlantPotModal && pendingItem === "화분" && (
  <PlantPotModal onClose={() => setOpenPlantPotModal(false)} onSave={(data) => setOpenPlantPotModal(false)} />
)}

{openMirrorModal && pendingItem === "거울" && (
  <MirrorModal onClose={() => setOpenMirrorModal(false)} onSave={(data) => setOpenMirrorModal(false)} />
)}

{openCarrierModal && pendingItem === "캐리어" && (
  <CarrierModal onClose={() => setOpenCarrierModal(false)} onSave={(data) => setOpenCarrierModal(false)} />
)}

{openBookModal && pendingItem === "책" && (
  <BookModal onClose={() => setOpenBookModal(false)} onSave={(data) => setOpenBookModal(false)} />
)}

{openFitnessModal && pendingItem === "운동기구" && (
  <FitnessModal onClose={() => setOpenFitnessModal(false)} onSave={(data) => setOpenFitnessModal(false)} />
)}

{openCurtainModal && pendingItem === "커튼" && (
  <CurtainModal onClose={() => setOpenCurtainModal(false)} onSave={(data) => setOpenCurtainModal(false)} />
)}

{openLightModal && pendingItem === "조명" && (
  <LightModal onClose={() => setOpenLightModal(false)} onSave={(data) => setOpenLightModal(false)} />
)}

{openDryingRackModal && pendingItem === "빨래건조대" && (
  <DryingRackModal onClose={() => setOpenDryingRackModal(false)} onSave={(data) => setOpenDryingRackModal(false)} />
)}

    </div>
  );
}
