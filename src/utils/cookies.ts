import Cookies from "js-cookie";
import type { MoveCategory } from "@/types/moveItem";

type SelectedItem = {
  name: string;
  image: string;
};

type SelectedItems = {
  [key in MoveCategory]: SelectedItem[];
};

const SELECTED_ITEMS_KEY = "selectedItems";
const FROM_ADDRESS_KEY = "fromAddress";

// 📌 selectedItems 관련
export const getSelectedItemsFromCookie = (): SelectedItems | null => {
  const data = Cookies.get(SELECTED_ITEMS_KEY);
  try {
    return data ? (JSON.parse(data) as SelectedItems) : null;
  } catch (error) {
    console.error("쿠키 파싱 오류:", error);
    return null;
  }
};

export const saveSelectedItemsToCookie = (data: SelectedItems) => {
  Cookies.set(SELECTED_ITEMS_KEY, JSON.stringify(data), { path: "/" });
};

// ✅ fromAddress 관련 추가
type FromAddress = {
  address: {
    roadFullAddr: string;
    roadAddrPart1: string;
    addrDetail: string;
    zipNo: string;
    entX: string;
    entY: string; 
  };
  detailInfo: {
    buildingType: string;
    roomStructure: string;
    sizeOption: string;
    floor: string;
    hasStairs: boolean;
    hasParking: boolean;
    elevator: boolean;
  };
};

export const saveFromAddressToCookie = (data: FromAddress) => {
  Cookies.set(FROM_ADDRESS_KEY, JSON.stringify(data), { path: "/" });
};

export const getFromAddressFromCookie = (): FromAddress | null => {
  const data = Cookies.get(FROM_ADDRESS_KEY);
  try {
    return data ? (JSON.parse(data) as FromAddress) : null;
  } catch (error) {
    console.error("fromAddress 쿠키 파싱 오류:", error);
    return null;
  }
};

export const removeFromAddressCookie = () => {
  Cookies.remove(FROM_ADDRESS_KEY);
};
