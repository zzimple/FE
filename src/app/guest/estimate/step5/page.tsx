"use client";

import { useEffect, useState, useRef } from "react";
import EstimateHeader from "@/components/common/EstimateHeader";
import SelectTab from "@/components/common/SelectTab";
import ItemCard from "@/components/move-items/common/ItemCard";
import ItemDeleteModal from "@/components/move-items/common/ItemDeleteModal";
import { MoveCategory, MoveItemDetail } from "@/types/moveItem";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import { authApi } from "@/lib/axios";
import { furnitureItems } from "@/constants/items/furnitureItems";
import { applianceItems } from "@/constants/items/appliance";
import { otherItems } from "@/constants/items/otherItems";

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

type Item = { name: string; image: string; itemTypeId: number };

type SelectedItems = {
  [key in MoveCategory]: Item[];
};

export default function Step5Page() {
  const router = useRouter();

  const [uuid, setUuid] = useState<string | null>(null);

  const [items, setItems] = useState<(MoveItemDetail & { name: string })[]>([]);
  const [boxCount, setBoxCount] = useState(0);
  const [leftoverBoxCount, setLeftoverBoxCount] = useState(0);
  const [requestNote, setRequestNote] = useState<string>("");

  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid");
    if (storedUuid) {
      setUuid(storedUuid);
    } else {
      alert("견적서 UUID가 없습니다. 처음부터 다시 작성해주세요.");
      router.push("/estimate/start");
    }
  }, [router]);

  const handleSave = async () => {
    if (!uuid) {
      alert("uuid가 없습니다.");
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
      router.push("/guest/estimate/step6");
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
  const [openWardrobeCombinedModal, setOpenWardrobeCombinedModal] =
    useState(false);
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

  useEffect(() => {
    const savedItems = localStorage.getItem("selectedItems");
    if (savedItems) {
      try {
        setSelectedItems(JSON.parse(savedItems));
      } catch (err) {
        console.error("짐 목록 파싱 오류", err);
      }
    }
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

  const simpleItems = ["청소기", "가스레인지", "선풍기", "책", "조명기구"];
  const isSimpleItem = (item: { name: string }) =>
    simpleItems.includes(item.name);

  return (
    <div className="min-h-screen bg-white max-w-md md:max-w-2xl mx-auto">
      <EstimateHeader step={5} title="짐 상세 정보 입력" />
      <div className="px-4 pt-6 pb-20 flex flex-col gap-8">
        <div className="mb-4">
          <div className="text-lg font-bold flex items-end gap-1">
            <span className="text-blue-600">
              {selectedItems["가구"].length +
                selectedItems["가전"].length +
                selectedItems["기타"].length -
                items.length}
            </span>
            <span className="text-black">개 항목이 남았어요.</span>
          </div>
          <div className="text-gray-400 text-sm mt-1">
            추가금이 발생하지 않도록 정확한 정보를 입력해 주세요.
          </div>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-center mt-4 mb-2 text-gray-900">
          <span className="text-blue-600">입력할 짐</span>을 선택해 주세요.
        </h2>
        {/* 탭 */}
        <div className="flex justify-center gap-2 rounded-full py-2 mb-2 sticky top-0 bg-white z-10">
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
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-bold">가구</div>
              <div className="text-base font-semibold text-blue-600">
                {
                  items.filter((i) =>
                    selectedItems["가구"].some((s) => s.name === i.name)
                  ).length
                }
                /{selectedItems["가구"].length}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedItems["가구"].map((item) => {
                const detail = items.find((i) => i.name === item.name);
                return (
                  <div
                    key={`${"가구"}-${item.name}`}
                    className="w-full max-w-[420px] min-h-[120px] mx-auto bg-white rounded-xl shadow p-1 px-3 flex flex-col gap-1 mb-2"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteClick("가구", item.name)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-red-500 text-lg font-bold"
                      >
                        ×
                      </button>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-contain ml-0 mr-3"
                      />
                      {detail && (
                        <div className="flex gap-2 items-center ml-auto">
                          <button
                            onClick={() => handleOpenModal(item.name)}
                            className="px-4 py-2 rounded bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100"
                          >
                            옵션 변경
                          </button>
                          <div className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1">
                            <button
                              onClick={() =>
                                setItems((prev) =>
                                  prev.map((i) =>
                                    i.name === item.name
                                      ? {
                                          ...i,
                                          quantity: Math.max(1, i.quantity - 1),
                                        }
                                      : i
                                  )
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded bg-white border text-lg"
                            >
                              -
                            </button>
                            <span className="mx-2 w-7 text-center font-bold text-lg">
                              {detail.quantity}
                            </span>
                            <button
                              onClick={() =>
                                setItems((prev) =>
                                  prev.map((i) =>
                                    i.name === item.name
                                      ? { ...i, quantity: i.quantity + 1 }
                                      : i
                                  )
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded bg-white border text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                      {!detail && (
                        <button
                          onClick={() => handleOpenModal(item.name)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-lg font-bold ml-auto"
                        >
                          +
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1 min-h-[20px] mb-2">
                      {detail &&
                        Object.values(detail.etc || {}).filter(Boolean).length >
                          0 &&
                        Object.values(detail.etc || {})
                          .filter(Boolean)
                          .map((v, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-100 rounded px-2 py-1 text-gray-700 text-sm w-fit"
                            >
                              {v}
                            </div>
                          ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* 가전 */}
          <div ref={applianceRef}>
            <div className="flex items-center justify-between mb-2 mt-6">
              <div className="text-lg font-bold">가전</div>
              <div className="text-base font-semibold text-blue-600">
                {
                  items.filter((i) =>
                    selectedItems["가전"].some((s) => s.name === i.name)
                  ).length
                }
                /{selectedItems["가전"].length}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedItems["가전"].map((item) => {
                const detail = items.find((i) => i.name === item.name);
                return (
                  <div
                    key={`${"가전"}-${item.name}`}
                    className={`w-full max-w-[420px] min-h-[120px] mx-auto bg-white rounded-xl shadow p-1 px-3 flex flex-col gap-1 mb-2`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteClick("가전", item.name)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-red-500 text-lg font-bold"
                      >
                        ×
                      </button>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-contain ml-0 mr-3"
                      />
                      {detail && (
                        <div className="flex gap-2 items-center ml-auto">
                          <button
                            onClick={() => handleOpenModal(item.name)}
                            className="px-4 py-2 rounded bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100"
                          >
                            옵션 변경
                          </button>
                          <div className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1">
                            <button
                              onClick={() =>
                                setItems((prev) =>
                                  prev.map((i) =>
                                    i.name === item.name
                                      ? {
                                          ...i,
                                          quantity: Math.max(1, i.quantity - 1),
                                        }
                                      : i
                                  )
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded bg-white border text-lg"
                            >
                              -
                            </button>
                            <span className="mx-2 w-7 text-center font-bold text-lg">
                              {detail.quantity}
                            </span>
                            <button
                              onClick={() =>
                                setItems((prev) =>
                                  prev.map((i) =>
                                    i.name === item.name
                                      ? { ...i, quantity: i.quantity + 1 }
                                      : i
                                  )
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded bg-white border text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                      {!detail && (
                        <button
                          onClick={() => handleOpenModal(item.name)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-lg font-bold ml-auto"
                        >
                          +
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1 min-h-[20px] mb-2">
                      {detail &&
                        Object.values(detail.etc || {}).filter(Boolean).length >
                          0 &&
                        Object.values(detail.etc || {})
                          .filter(Boolean)
                          .map((v, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-100 rounded px-2 py-1 text-gray-700 text-sm w-fit"
                            >
                              {v}
                            </div>
                          ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* 기타 */}
          <div ref={otherRef}>
            <div className="flex items-center justify-between mb-2 mt-6">
              <div className="text-lg font-bold">기타</div>
              <div className="text-base font-semibold text-blue-600">
                {
                  items.filter((i) =>
                    selectedItems["기타"].some((s) => s.name === i.name)
                  ).length
                }
                /{selectedItems["기타"].length}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedItems["기타"].map((item) => {
                const detail = items.find((i) => i.name === item.name);
                return (
                  <div
                    key={`${"기타"}-${item.name}`}
                    className={`w-full max-w-[420px] min-h-[120px] mx-auto bg-white rounded-xl shadow p-1 px-3 flex flex-col gap-1 mb-2`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteClick("기타", item.name)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-red-500 text-lg font-bold"
                      >
                        ×
                      </button>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-contain ml-0 mr-3"
                      />
                      {detail && (
                        <div className="flex gap-2 items-center ml-auto">
                          <button
                            onClick={() => handleOpenModal(item.name)}
                            className="px-4 py-2 rounded bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100"
                          >
                            옵션 변경
                          </button>
                          <div className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1">
                            <button
                              onClick={() =>
                                setItems((prev) =>
                                  prev.map((i) =>
                                    i.name === item.name
                                      ? {
                                          ...i,
                                          quantity: Math.max(1, i.quantity - 1),
                                        }
                                      : i
                                  )
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded bg-white border text-lg"
                            >
                              -
                            </button>
                            <span className="mx-2 w-7 text-center font-bold text-lg">
                              {detail.quantity}
                            </span>
                            <button
                              onClick={() =>
                                setItems((prev) =>
                                  prev.map((i) =>
                                    i.name === item.name
                                      ? { ...i, quantity: i.quantity + 1 }
                                      : i
                                  )
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded bg-white border text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                      {!detail && (
                        <button
                          onClick={() => handleOpenModal(item.name)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-lg font-bold ml-auto"
                        >
                          +
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1 min-h-[20px] mb-2">
                      {detail &&
                        Object.values(detail.etc || {}).filter(Boolean).length >
                          0 &&
                        Object.values(detail.etc || {})
                          .filter(Boolean)
                          .map((v, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-100 rounded px-2 py-1 text-gray-700 text-sm w-fit"
                            >
                              {v}
                            </div>
                          ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* 짐 박스 입력 UI */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm w-full max-w-[400px] h-[90px] mx-auto mb-3 mt-4">
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
                  className="border border-gray-300 rounded-xl px-2 py-1 text-lg font-bold bg-white hover:bg-gray-100"
                  onClick={() => setBoxCount((prev) => Math.max(0, prev - 1))}
                >
                  -
                </button>
                <span className="w-16 text-center font-bold text-gray-900 text-base">
                  {boxCount}개
                </span>
                <button
                  className="border border-gray-300 rounded-xl px-2 py-1 text-lg font-bold bg-white hover:bg-gray-100"
                  onClick={() => setBoxCount((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
            {/* 메모 입력란 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사장님께 전달할 요청사항
              </label>
              <textarea
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                placeholder="예시) 추가 짐과 반려동물이 있어요. "
                className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none h-24"
                maxLength={200}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {requestNote.length}/200
              </div>
            </div>
            <Button
              onClick={() => {
                const allFilled = ["가구", "가전", "기타"].every((cat) =>
                  selectedItems[cat as MoveCategory].every((item) =>
                    items.find((i) => i.name === item.name)
                  )
                );
                if (!allFilled) {
                  // 토스트 안내
                  alert("세부 옵션을 입력해 주세요.");
                  return;
                }
                handleSave();
              }}
              disabled={
                !["가구", "가전", "기타"].every((cat) =>
                  selectedItems[cat as MoveCategory].every((item) =>
                    items.find((i) => i.name === item.name)
                  )
                )
              }
              className="w-full h-14 rounded-xl text-lg font-bold mt-2"
            >
              다음
            </Button>
          </div>
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "침대"),
              { ...data, name: "침대" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "쇼파"),
              { ...data, name: "쇼파" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "옷장-단품"),
              { ...data, name: "옷장-단품" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "옷장-연결장"),
              { ...data, name: "옷장-연결장" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "행거"),
              { ...data, name: "행거" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "시스템행거"),
              { ...data, name: "시스템행거" },
            ]);
            setOpenSystemHangerModal(false);
          }}
        />
      )}

      {openDressingTableModal && pendingItem === "화장대" && (
        <DressingTableModal
          itemTypeId={1007}
          onClose={() => setOpenDressingTableModal(false)}
          onSave={(data) => {
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "화장대"),
              { ...data, name: "화장대" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "수납장/서랍장"),
              { ...data, name: "수납장/서랍장" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "진열장"),
              { ...data, name: "진열장" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "선반"),
              { ...data, name: "선반" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "거실장/TV장"),
              { ...data, name: "거실장/TV장" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "책장"),
              { ...data, name: "책장" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "책상"),
              { ...data, name: "책상" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "테이블/식탁"),
              { ...data, name: "테이블/식탁" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "의자"),
              { ...data, name: "의자" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "TV"),
              { ...data, name: "TV" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "모니터"),
              { ...data, name: "모니터" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "PC/데스크탑"),
              { ...data, name: "PC/데스크탑" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "세탁기"),
              { ...data, name: "세탁기" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "건조기"),
              { ...data, name: "건조기" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "청소기"),
              { ...data, name: "청소기" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "의류관리기"),
              { ...data, name: "의류관리기" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "냉장고"),
              { ...data, name: "냉장고" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "전자레인지"),
              { ...data, name: "전자레인지" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "가스레인지"),
              { ...data, name: "가스레인지" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "정수기"),
              { ...data, name: "정수기" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "에어컨"),
              { ...data, name: "에어컨" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "공기청정기"),
              { ...data, name: "공기청정기" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "선풍기"),
              { ...data, name: "선풍기" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "안마의자"),
              { ...data, name: "안마의자" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "거울"),
              { ...data, name: "거울" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "커튼"),
              { ...data, name: "커튼" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "빨래건조대"),
              { ...data, name: "빨래건조대" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "캐리어"),
              { ...data, name: "캐리어" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "운동기구"),
              { ...data, name: "운동기구" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "책"),
              { ...data, name: "책" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "화분"),
              { ...data, name: "화분" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "비데"),
              { ...data, name: "비데" },
            ]);
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
            setItems((prev) => [
              ...prev.filter((i) => i.name !== "조명"),
              { ...data, name: "조명" },
            ]);
            console.log("조명 data", data);
            setOpenLightModal(false);
          }}
        />
      )}
    </div>
  );
}
