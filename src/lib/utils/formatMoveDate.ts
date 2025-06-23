// lib/utils/formatMoveDate.ts

export const formatMoveDate = (dateString: string): string => {
  if (!/^\d{8}$/.test(dateString)) return "날짜 없음";

  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);

  return `${year}년 ${month}월 ${day}일`;
};
