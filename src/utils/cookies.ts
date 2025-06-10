// utils/cookies.ts
import Cookies from "js-cookie";
import type { MoveCategory } from "@/types/moveItem";

type SelectedItem = {
  name: string;
  image: string;
};

type SelectedItems = {
  [key in MoveCategory]: SelectedItem[];
};

const COOKIE_KEY = "selectedItems";

export const getSelectedItemsFromCookie = (): SelectedItems | null => {
  const data = Cookies.get(COOKIE_KEY);
  try {
    return data ? (JSON.parse(data) as SelectedItems) : null;
  } catch (error) {
    console.error("쿠키 파싱 오류:", error);
    return null;
  }
};

export const saveSelectedItemsToCookie = (data: SelectedItems) => {
  Cookies.set(COOKIE_KEY, JSON.stringify(data), { path: "/" });
};
