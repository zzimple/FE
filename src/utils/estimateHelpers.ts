import type { Item, DetailInfo } from '@/types/estimate';

/**
 * 카테고리별 아이템 개수 계산
 */
export function getCategoryCounts(items: Item[]): Record<'가구' | '가전' | '기타', number> {
  return items.reduce((acc, item) => {
    const key =
      item.category === 'APPLIANCE' ? '가전' :
      item.category === 'FURNITURE' ? '가구' :
      '기타';
    acc[key] = (acc[key] || 0) + item.quantity;
    return acc;
  }, { 가구: 0, 가전: 0, 기타: 0 });
}

/**
 * 아이템 세부사항을 문자열 배열로 변환
 */
export function getItemDetailsNoFrame(item: Item): string[] {
  const details: string[] = [];
  if (item.type) details.push(`타입: ${item.type}`);
  if (item.width && item.height && item.depth) {
    details.push(`크기: ${item.width} x ${item.height} x ${item.depth}`);
  }
  if (item.material) details.push(`재질: ${item.material}`);
  if (item.size) details.push(`사이즈: ${item.size}`);
  if (item.frame) details.push(`프레임: ${item.frame}`);
  if (item.requestNote) details.push(`요청사항: ${item.requestNote}`);
  if (item.shape) details.push(`형태: ${item.shape}`);
  if (item.capacity) details.push(`용량: ${item.capacity}`);
  if (item.doorCount) details.push(`문 개수: ${item.doorCount}`);
  if (item.unitCount) details.push(`수납장 개수: ${item.unitCount}`);
  if (item.hasGlass) details.push('유리 포함');
  if (item.foldable) details.push('접이식');
  if (item.hasWheels) details.push('바퀴 있음');
  if (item.hasPrinter) details.push('프린터 포함');
  if (item.purifierType) details.push(`정수기 타입: ${item.purifierType}`);
  if (item.specialNote) details.push(`특이사항: ${item.specialNote}`);
  return details;
}

/**
 * 예약 관련 상수
 */
export const NOTES: string[] = [
  "사전에 협의되지 않은 항목은 서비스 당일 추가금이 발생할 수 있습니다.",
  "견적 요청 후 24시간 동안 견적서를 받습니다.",
  "제출 후 내용을 수정할 수 없습니다.",
];

/**
 * 날짜/시간 포맷팅 (YYYYMMDD, ISO → "YYYY.MM.DD 오전/오후 H:MM")
 */
export function formatMoveDateTime(
  moveDate?: string,
  moveTime?: string
): string {
  if (!moveDate || !moveTime) return "";

  // 날짜 포맷 (YYYYMMDD → YYYY.MM.DD)
  const year = moveDate.slice(0, 4);
  const month = moveDate.slice(4, 6);
  const day = moveDate.slice(6, 8);
  const formattedDate = `${year}.${month}.${day}`;

  // 시간 문자열 추출 및 밀리초 제거
  let rawTime: string;
  if (moveTime.includes("T")) {
    rawTime = moveTime.split("T")[1];
  } else {
    rawTime = moveTime.split(" ")[1] || moveTime;
  }
  rawTime = rawTime.split(".")[0]; // "14:00:00"

  // 시:분 분리 및 오전/오후 변환
  const [hourStr, minuteStr] = rawTime.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, "0");
  const ampm = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${formattedDate} ${ampm} ${displayHour}:${minute}`;
}

/**
 * 주소 상세정보 포맷팅 (DetailInfo → "건물타입 | 평수 옵션 | 층수 | 엘리베이터 O/X")
 */
export function formatAddressInfo(detailInfo: DetailInfo): string {
  const elevatorLabel = detailInfo.elevator ? 'O' : 'X';
  return [
    detailInfo.buildingType,                // 건물 타입
    detailInfo.sizeOption,                  // 평수 옵션
    `${detailInfo.floor}층`,                // 층수
    `엘리베이터 ${elevatorLabel}`,         // 엘리베이터 정보
  ].join(' | ');
}
