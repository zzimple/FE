"use client";

interface AddressSearchButtonProps {
  onAddressSelect: (addr: {
    roadFullAddr: string;
    roadAddrPart1: string;
    addrDetail: string;
    zipNo: string;
    entX: string;
    entY: string;
  }) => void;
}

const AddressSearchButton = ({ onAddressSelect }: AddressSearchButtonProps) => {

  const openAddressPopup = () => {
    const width = 570;
    const height = 420;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const confmKey = process.env.NEXT_PUBLIC_JUSO_CONFIRM_KEY;

    const baseUrl =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin
        : "";

    const returnUrl = encodeURIComponent("http://14.63.178.146:8080/juso/callback");

    // 전역 콜백 지정
    (window as any).onJusoCallback = (addr: string) => {
      onAddressSelect(addr);
    };

    const popupUrl = `https://business.juso.go.kr/addrlink/addrLinkUrl.do?confmKey=${confmKey}&returnUrl=${returnUrl}&resultType=1&useDetailAddr=Y`;

    console.log("주소 팝업 URL:", popupUrl); // ← 이 줄 추가
    console.log("🔑 confmKey:", confmKey); // null 또는 undefined 나오면 문제
    console.log("🌐 baseUrl:", baseUrl);
    console.log("📎 returnUrl:", returnUrl);

    window.open(
      popupUrl,
      "주소검색",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );
  };

  return (
    <button
      type="button"
      onClick={openAddressPopup}
      className="h-[32px] px-4 rounded-full bg-[#DBEBFF] text-sm font-bold"
    >
      주소 검색
    </button>
  );
};

export default AddressSearchButton;
