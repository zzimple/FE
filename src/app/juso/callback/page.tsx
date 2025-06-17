// app/juso/callback/page.tsx

"use client";

import { useEffect } from "react";

export default function JusoCallbackPage() {
    useEffect(() => {

        console.log("🚩 콜백 페이지 도착");

        if (typeof window === "undefined") return;


        // 🚫 이 페이지는 POST가 들어오면 아무것도 안됨
        try {
            const params = new URLSearchParams(window.location.search);

            // 정상 처리
        } catch (err) {
            console.error("❌ 주소 콜백 처리 중 오류:", err);
        }

        const params = new URLSearchParams(window.location.search);

        console.log([...params.entries()]);

        const roadFullAddr = params.get("roadFullAddr") || "";
        const zipNo = params.get("zipNo") || "";
        const addrDetail = params.get("addrDetail") || "";
        const roadAddrPart1 = params.get("roadAddrPart1") || "";
        const entX = params.get("entX") || "";
        const entY = params.get("entY") || "";

        console.log("entX", entX);
        console.log("entY", entY);

        console.log("📥 [주소 콜백] 전달받은 주소 정보:");
        console.log(" - roadFullAddr:", roadFullAddr);
        console.log(" - roadAddrPart1:", roadAddrPart1);
        console.log(" - addrDetail:", addrDetail);
        console.log(" - zipNo:", zipNo);
        // console.log("- entX", entX);
        // console.log("- entY", entY);

        // 부모 창에 주소 정보 전달
        if (window.opener && typeof window.opener.onJusoCallback === "function") {
            window.opener.onJusoCallback({
                roadFullAddr,
                zipNo,
                addrDetail,
                roadAddrPart1: roadAddrPart1,
                entX,
                entY,
            });
        }

        // ✅ 팝업 창 닫기
        // window.close();
    }, []);

    return <div>주소를 전달 중입니다...</div>;
}
